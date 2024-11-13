import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './landing/LandingPage';
import MainPage from './main/MainPage';
import ProfilePage from './profile/ProfilePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
