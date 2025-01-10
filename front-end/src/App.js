import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./landing/LandingPage";
import MainPage from "./main/MainPage";
import ProfilePage from "./profile/ProfilePage";
import FirebaseUploadTest from "./profile/test";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LandingPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/test" element={<FirebaseUploadTest />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
