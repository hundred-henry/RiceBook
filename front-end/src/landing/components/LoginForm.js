import React from "react";
import { Box, Button, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { GoogleLogin } from "@react-oauth/google"; // 导入 GoogleLogin 组件

const CustomTextField = ({ label, value, onChange, error, type = "text" }) => (
  <TextField
    label={label}
    fullWidth
    margin="normal"
    type={type}
    value={value}
    onChange={onChange}
    error={!!error}
  />
);

const LoginForm = ({
  loginState,
  setLoginState,
  loginError,
  handleLoginSubmit,
  handleGoogleLoginSuccess, // 添加 Google 登录成功的处理函数
  handleGoogleLoginFailure, // 添加 Google 登录失败的处理函数
}) => {
  const handleLoginChange = (field) => (e) =>
    setLoginState({ ...loginState, [field]: e.target.value });

  return (
    <Box
      component="form"
      sx={{
        p: 3,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 3,
      }}
      onSubmit={handleLoginSubmit}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ fontWeight: "medium", color: "secondary.main" }}>
        Login
      </Typography>
      <CustomTextField
        label="Login Username"
        value={loginState.username}
        onChange={handleLoginChange("username")}
        error={!!loginError}
      />
      <CustomTextField
        label="Login Password"
        type="password"
        value={loginState.password}
        onChange={handleLoginChange("password")}
        error={!!loginError}
      />
      {loginError && (
        <Typography variant="body2" color="error" align="center" gutterBottom>
          {loginError}
        </Typography>
      )}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>

      {/* Google 登录按钮 */}
      <Typography variant="body2" align="center" sx={{ mt: 2, mb: 2 }}>
        Or login/register with
      </Typography>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess} // 处理 Google 登录成功
        onError={handleGoogleLoginFailure} // 处理 Google 登录失败
      />
    </Box>
  );
};

export default LoginForm;
