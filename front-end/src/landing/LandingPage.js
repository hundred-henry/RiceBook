import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import useLandingPageLogic from "./logic/LandingPageLogic";
import { GoogleOAuthProvider } from "@react-oauth/google"; // 导入 GoogleOAuthProvider

const LandingPage = () => {
  const {
    registerState,
    setRegisterState,
    registerErrors,
    handleRegisterSubmit,
    loginState,
    setLoginState,
    loginError,
    handleLoginSubmit,
    handleGoogleLoginSuccess,
    handleGoogleLoginFailure, // Google 登录失败处理
  } = useLandingPageLogic();

  return (
    // 用 GoogleOAuthProvider 包裹整个页面，提供 Client ID
    <GoogleOAuthProvider clientId="361435296868-mtebub9igllbemm5c6q6f567hsfrvqtb.apps.googleusercontent.com"> 
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="landing-page-container">
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main", marginTop: 4 }}
          >
            Welcome to RiceBook!
          </Typography>
          <Box sx={{ flexGrow: 1, padding: "40px" }}>
            <Grid container spacing={2} justifyContent="center">
              {/* Register Section */}
              <Grid item xs={12} md={5}>
                <RegisterForm
                  registerState={registerState}
                  setRegisterState={setRegisterState}
                  registerErrors={registerErrors}
                  handleRegisterSubmit={handleRegisterSubmit}
                />
              </Grid>

              {/* Login Section */}
              <Grid item xs={12} md={5}>
                <LoginForm
                  loginState={loginState}
                  setLoginState={setLoginState}
                  loginError={loginError}
                  handleLoginSubmit={handleLoginSubmit}
                  handleGoogleLoginSuccess={handleGoogleLoginSuccess} // 传递 Google 登录成功处理
                  handleGoogleLoginFailure={handleGoogleLoginFailure} // 传递 Google 登录失败处理
                />
              </Grid>
            </Grid>
          </Box>
        </div>
      </LocalizationProvider>
    </GoogleOAuthProvider> // 确保包裹整个页面
  );
};

export default LandingPage;
