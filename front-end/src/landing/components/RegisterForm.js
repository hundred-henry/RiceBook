import React from "react";
import { Box, Button, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs from "dayjs";

const CustomTextField = ({ label, value, onChange, error, helperText, type = "text" }) => (
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

const RegisterForm = ({
  registerState,
  setRegisterState,
  registerErrors,
  handleRegisterSubmit,
}) => {
  const handleRegisterChange = (field) => (e) =>
    setRegisterState({ ...registerState, [field]: e.target.value });

  const handleDateChange = (newValue) => {
    setRegisterState({
      ...registerState,
      dateOfBirth: newValue?.isValid() ? newValue.toISOString() : "",
    });
  };

  return (
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
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ fontWeight: "medium", color: "secondary.main" }}>
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
        value={registerState.dateOfBirth ? dayjs(registerState.dateOfBirth) : null}
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
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Register
      </Button>
    </Box>
  );
};

export default RegisterForm;
