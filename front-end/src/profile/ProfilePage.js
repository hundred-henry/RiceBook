import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useProfileLogic from "./ProfilePageLogic";

const CustomTextField = ({ label, value, onChange, error, helperText }) => (
  <TextField
    label={label}
    fullWidth
    margin="normal"
    value={value}
    onChange={onChange}
    error={!!error}
    helperText={helperText}
  />
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    editableUser,
    updateErrors,
    error,
    successMessage,
    handleInputChange,
    handleImagePreview,
    handleUpdate,
    email,
    zipcode,
    phone,
    avatarPreview,
    headline,
  } = useProfileLogic();

  return (
    <Box sx={{ maxWidth: 750, margin: "auto", marginTop: 4 }}>
      {/* Avatar */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <Avatar
          alt="User Avatar"
          src={avatarPreview || editableUser.avatar}
          sx={{ width: 100, height: 100 }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <Button variant="contained" component="label">
          Upload Image
          <input
            type="file"
            hidden
            onChange={(e) => handleImagePreview(e.target.files[0])} // Preview image locally
          />
        </Button>
      </Box>

      {error && (
        <Typography color="error" align="center" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      {successMessage && (
        <Typography color="primary" align="center" sx={{ marginBottom: 2 }}>
          {successMessage}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontSize: "18px", fontWeight: "bold" }}
              >
                Attribute
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "18px", fontWeight: "bold" }}
              >
                Edit
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "18px", fontWeight: "bold" }}
              >
                Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Email */}
            <TableRow>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">
                <CustomTextField
                  value={editableUser.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={updateErrors.email}
                  helperText={updateErrors.email}
                />
              </TableCell>
              <TableCell align="center">{email || "N/A"}</TableCell>
            </TableRow>

            {/* Zipcode */}
            <TableRow>
              <TableCell align="center">Zipcode</TableCell>
              <TableCell align="center">
                <CustomTextField
                  value={editableUser.zipcode}
                  onChange={(e) => handleInputChange("zipcode", e.target.value)}
                  error={updateErrors.zipcode}
                  helperText={updateErrors.zipcode}
                />
              </TableCell>
              <TableCell align="center">{zipcode || "N/A"}</TableCell>
            </TableRow>

            {/* Phone */}
            <TableRow>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">
                <CustomTextField
                  value={editableUser.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={updateErrors.phone}
                  helperText={updateErrors.phone}
                />
              </TableCell>
              <TableCell align="center">{phone || "N/A"}</TableCell>
            </TableRow>

            {/* Headline */}
            <TableRow>
              <TableCell align="center">Headline</TableCell>
              <TableCell align="center">
                <CustomTextField
                  value={editableUser.headline}
                  onChange={(e) => handleInputChange("headline", e.target.value)}
                  error={updateErrors.headline}
                  helperText={updateErrors.headline}
                />
              </TableCell>
              <TableCell align="center">{headline || "N/A"}</TableCell>
            </TableRow>

            {/* Password */}
            <TableRow>
              <TableCell align="center">Password</TableCell>
              <TableCell align="center">
                <CustomTextField
                  type="password"
                  value={editableUser.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  error={updateErrors.password}
                  helperText={updateErrors.password}
                />
              </TableCell>
              <TableCell align="center">{"*".repeat(8)}</TableCell>
            </TableRow>

            {/* Confirm Password */}
            <TableRow>
              <TableCell align="center">Confirm Password</TableCell>
              <TableCell align="center">
                <CustomTextField
                  type="password"
                  value={editableUser.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  error={updateErrors.confirmPassword}
                  helperText={updateErrors.confirmPassword}
                />
              </TableCell>
              <TableCell align="center">{"*".repeat(8)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          UPDATE
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/main")}
        >
          Back to MainPage
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;