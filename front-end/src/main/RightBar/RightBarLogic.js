import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createArticle } from "../../store/articleSlice";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../utils/firebase";

const useRightBarLogic = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const username = currentUser ? currentUser.username : null; // 检查 currentUser 是否存在

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // 存储图片文件
  const [imagePreview, setImagePreview] = useState(null); // 存储图片预览
  const [errorMessage, setErrorMessage] = useState(""); // 用于记录错误信息

  // 图片上传到 Firebase Storage
  const uploadImageToFirebase = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `articles/${Date.now()}_${file.name}`);
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

  // 处理图片上传
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // 显示图片预览
      };
      reader.readAsDataURL(file); // 读取图片为 Data URL
    }
  };

  // 添加文章
  const handleAddPost = async () => {
    if (!content) {
      setErrorMessage("Post content is required."); // 验证文章内容是否填写
      return;
    }

    if (!username) {
      setErrorMessage("You must be logged in to create a post."); // 验证用户是否登录
      return;
    }

    setErrorMessage(""); // 清除之前的错误信息

    // 上传图片并获取 URL
    let uploadedImageUrl = "";
    if (image) {
      try {
        uploadedImageUrl = await uploadImageToFirebase(image); // 上传图片
      } catch (error) {
        setErrorMessage("Failed to upload image. Please try again."); // 上传失败时显示错误信息
        return;
      }
    }

    const newArticle = {
      title: title || "Untitled", // 如果未填写标题，使用默认标题
      text: content, // 文章内容
      author: username, // 当前用户
      image: uploadedImageUrl || "", // 如果上传了图片，使用图片 URL，否则为空字符串
    };

    try {
      // Dispatch Redux Action
      await dispatch(createArticle(newArticle)).unwrap(); // 等待异步操作完成
      clearForm(); // 清空表单
    } catch (error) {
      console.error("Failed to create article:", error);
      setErrorMessage("Failed to create article. Please try again.");
    }
  };

  // 清空表单和预览图片
  const clearForm = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setImagePreview(null); // 清除图片预览
    setErrorMessage(""); // 清除错误信息
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    image,
    setImage,
    imagePreview,
    handleImageChange,
    handleAddPost,
    clearForm,
    errorMessage, // 传递错误信息
  };
};

export default useRightBarLogic;
