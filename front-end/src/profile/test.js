import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";

const FirebaseUploadTest = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      console.log("File selected:", e.target.files[0]); // 调试日志
      setFile(e.target.files[0]);
    } else {
      console.log("No file selected.");
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError("No file selected.");
      console.log("No file selected.");
      return;
    }

    console.log("Starting upload...");

    const storageRef = ref(storage, `test-uploads/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setError("Upload failed. Please try again.");
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("File uploaded successfully! URL:", url);
        setDownloadURL(url);
      }
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Firebase Upload Test</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ margin: "10px" }}>
        Upload
      </button>
      {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
      {downloadURL && (
        <p>
          File uploaded successfully!{" "}
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FirebaseUploadTest;
