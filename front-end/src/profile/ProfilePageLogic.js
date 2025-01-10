import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEmail,
  updateEmail,
  fetchZipcode,
  updateZipcode,
  fetchAvatar,
  updateAvatar,
  fetchPhone,
  updatePhone,
  fetchHeadline,
  updateHeadline,
  updatePassword,
} from "../store/profileSlice";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";

const useProfileLogic = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.currentUser?.username);
  const { email, zipcode, phone, avatar, headline, error, loading } =
    useSelector((state) => state.profile);

  const [editableUser, setEditableUser] = useState({
    username: "",
    email: "",
    zipcode: "",
    phone: "",
    avatar: "",
    headline: "",
    password: "",
    confirmPassword: "",
  });

  const [updateErrors, setUpdateErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatar || "");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (username) {
      dispatch(fetchEmail(username));
      dispatch(fetchZipcode(username));
      dispatch(fetchPhone(username));
      dispatch(fetchAvatar(username));
      dispatch(fetchHeadline(username));
    }
  }, [username, dispatch]);

  useEffect(() => {
    setEditableUser((prev) => ({
      ...prev,
      email: email || "",
      zipcode: zipcode || "",
      phone: phone || "",
      avatar: avatar || "",
      headline: headline || "",
      password: "",
      confirmPassword: "",
    }));
    setAvatarPreview(avatar || "");
  }, [email, zipcode, phone, avatar, headline]);

  // Validate and preview image
  const validateAndPreviewImage = (file) => {
    if (!file) {
      setUpdateErrors({ avatar: "No file selected." });
      return false;
    }
    if (!file.type.startsWith("image/")) {
      setUpdateErrors({ avatar: "Only image files are allowed." });
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUpdateErrors({ avatar: "File size must not exceed 2MB." });
      return false;
    }
    setUpdateErrors({});
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
    return true;
  };

  const handleImagePreview = (file) => {
    if (validateAndPreviewImage(file)) {
      setSelectedFile(file);
    }
  };

  const uploadImageToFirebase = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `avatars/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  };

  const validateInputs = () => {
    const errors = {};
    if (editableUser.password && editableUser.password !== editableUser.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!editableUser.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableUser.email)) {
      errors.email = "Invalid email format.";
    }
    if (!editableUser.phone.trim() || !/^\d{3}-\d{3}-\d{4}$/.test(editableUser.phone)) {
      errors.phone = "Invalid phone number format.";
    }
    if (!editableUser.zipcode.trim() || !/^\d{5}$/.test(editableUser.zipcode)) {
      errors.zipcode = "Invalid zipcode format.";
    }
    setUpdateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      let avatarURL = editableUser.avatar;
      if (selectedFile) {
        avatarURL = await uploadImageToFirebase(selectedFile);
        await dispatch(updateAvatar(avatarURL)).unwrap();
        setSuccessMessage("Avatar updated successfully!");
      }
      // Update other fields
      const updates = [
        { field: "email", action: updateEmail },
        { field: "zipcode", action: updateZipcode },
        { field: "phone", action: updatePhone },
        { field: "headline", action: updateHeadline },
      ];
      for (const { field, action } of updates) {
        if (editableUser[field] !== field) {
          await dispatch(action(editableUser[field])).unwrap();
        }
      }
      if (editableUser.password) {
        await dispatch(updatePassword(editableUser.password)).unwrap();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return {
    editableUser,
    updateErrors,
    loading,
    error,
    successMessage,
    handleImagePreview,
    handleUpdate,
    avatarPreview,
  };
};

export default useProfileLogic;
