import React from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import useLandingPageLogic from "./LandingPageLogic";

const CustomTextField = ({
  label,
  value,
  onChange,
  error,
  helperText,
  type = "text",
}) => (
  <TextField
    label={label}
    fullWidth
    margin="normal"
    type={type}
    value={value}
    onChange={onChange}
    error={!!error}
    helperText={helperText}
  />
);

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
  } = useLandingPageLogic();

  const handleRegisterChange = (field) => (e) =>
    setRegisterState({ ...registerState, [field]: e.target.value });
  const handleLoginChange = (field) => (e) =>
    setLoginState({ ...loginState, [field]: e.target.value });
  const handleDateChange = (newValue) => {
    setRegisterState({
      ...registerState,
      dateOfBirth: newValue?.isValid() ? newValue.toISOString() : "",
    });
  };

  return (
    <div className="landing-page-container">
      {/* Main heading */}
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', marginTop: 4 }}>
        Welcome to RiceBook!
      </Typography>
      
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ flexGrow: 1, padding: "40px" }}>
          <Grid container spacing={2} justifyContent="center">
            {/* Register Section */}
            <Grid item xs={12} md={5}>
              <Box
                component="form"
                sx={{
                  p: 3,
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
                onSubmit={handleRegisterSubmit}
              >
                {/* Register heading */}
                <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ fontWeight: 'medium', color: 'secondary.main' }}>
                  Register
                </Typography>
                
                <CustomTextField
                  label="Account Name (Required)"
                  value={registerState.accountname}
                  onChange={handleRegisterChange("accountname")}
                  error={registerErrors.accountname}
                  helperText={registerErrors.accountname}
                />
                <CustomTextField
                  label="Display Name"
                  value={registerState.displayname}
                  onChange={handleRegisterChange("displayname")}
                />
                <CustomTextField
                  label="Register Password (Required)"
                  type="password"
                  value={registerState.password}
                  onChange={handleRegisterChange("password")}
                  error={registerErrors.password}
                  helperText={registerErrors.password}
                />
                <CustomTextField
                  label="Confirm Password (Required)"
                  type="password"
                  value={registerState.passwordConfirm}
                  onChange={handleRegisterChange("passwordConfirm")}
                  error={registerErrors.passwordConfirm}
                  helperText={registerErrors.passwordConfirm}
                />
                <CustomTextField
                  label="E-mail (Required)"
                  value={registerState.email}
                  onChange={handleRegisterChange("email")}
                  error={registerErrors.email}
                  helperText={registerErrors.email}
                />
                <DateField
                  label="Date of Birth (Required)"
                  margin="normal"
                  value={
                    registerState.dateOfBirth
                      ? dayjs(registerState.dateOfBirth)
                      : null
                  }
                  onChange={handleDateChange}
                  fullWidth
                  helperText={registerErrors.dateOfBirth}
                />
                <CustomTextField
                  label="Phone Number (Required)"
                  value={registerState.phoneNumber}
                  onChange={handleRegisterChange("phoneNumber")}
                  error={registerErrors.phoneNumber}
                  helperText={registerErrors.phoneNumber}
                />
                <CustomTextField
                  label="Zipcode (Required)"
                  value={registerState.zipcode}
                  onChange={handleRegisterChange("zipcode")}
                  error={registerErrors.zipcode}
                  helperText={registerErrors.zipcode}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Register
                </Button>
              </Box>
            </Grid>

            {/* Login Section */}
            <Grid item xs={12} md={5}>
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
                {/* Login heading */}
                <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ fontWeight: 'medium', color: 'secondary.main' }}>
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Login
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    </div>
  );
};

export default LandingPage;
