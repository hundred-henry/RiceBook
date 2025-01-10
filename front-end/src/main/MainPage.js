import React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import LeftBar from "./LeftBar/LeftBar";
import MainBar from "./MainBar/MainBar";
import RightBar from "./RightBar/RightBar";

const MainPage = () => {
  const navigate = useNavigate();

  const handleProfileNavigation = () => {
    navigate("/profile"); // 跳转到 Profile 页面
  };

  
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        border: "1px solid #e0e0e0", // 整体页面边界线
      }}
    >
      <Box
        sx={{
          width: "20%",
          borderRight: "1px solid #e0e0e0", // 左侧边界线
          padding: 2,
        }}
      >
        <LeftBar onProfileClick={handleProfileNavigation} />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
        }}
      >
        <MainBar />
      </Box>

      <Box
        sx={{
          width: "20%",
          borderLeft: "1px solid #e0e0e0", // 右侧边界线
          padding: 2,
        }}
      >
        <RightBar />
      </Box>
    </Box>
  );
};

export default MainPage;
