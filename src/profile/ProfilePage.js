import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { fetchUsers, updateUserDetails } from "../features/userSlice";

// 通用的 TextField 组件
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

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 获取 Redux 状态中的 userId 和用户列表
  const userId = useSelector((state) => state.user.userId);
  const users = useSelector((state) => state.user.users);

  const [updateErrors, setUpdateErrors] = useState({});
  const [editableUser, setEditableUser] = useState({
    username: "",
    name: "",
    password: "", 
    confirmPassword: "", 
    email: "",
    phone: "",
    zipcode: "",
  });

  // 如果用户数据不存在，则从服务器获取用户信息
  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [users, dispatch]);

  // 根据持久化的 userId 获取当前用户
  const user = users.find((user) => user.id === userId);

  // 初始化可编辑用户数据
  useEffect(() => {
    if (user) {
      setEditableUser({
        username: user.username || "",
        name: user.name || "",
        password: user.address?.street || "",
        confirmPassword: user.address?.street || "", 
        email: user.email || "",
        phone: user.phone || "",
        zipcode: user.address?.zipcode || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  // 输入验证函数
  const validateInputs = () => {
    let errors = {};

    if (!editableUser.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!editableUser.password.trim()) {
      errors.password = "Password is required.";
    } else if (editableUser.password !== editableUser.confirmPassword) {
      errors.passwordConfirm = "Passwords do not match.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editableUser.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(editableUser.email)) {
      errors.email = "Invalid email format.";
    }

    const phonePattern = /^\d{10}$/;
    if (!editableUser.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!phonePattern.test(editableUser.phone)) {
      errors.phone = "Invalid phone number. Must be 10 digits.";
    }

    const zipcodePattern = /^\d{5}$/;
    if (!editableUser.zipcode.trim()) {
      errors.zipcode = "Zipcode is required.";
    } else if (!zipcodePattern.test(editableUser.zipcode)) {
      errors.zipcode = "Invalid zipcode. Must be 5 digits.";
    }

    setUpdateErrors(errors);
    return Object.keys(errors).length === 0; // 返回是否无错误
  };

  const handleUpdate = () => {
    // 确保 user 和 editableUser 都存在并且包含必需的字段
    if (user && validateInputs()) {
      // 确保传递的 payload 包含了用户的完整信息
      dispatch(
        updateUserDetails({
          userId: userId,
          username: editableUser.username || user.username,
          name: editableUser.name || user.name,
          password: editableUser.password || user.address?.street,
          email: editableUser.email || user.email,
          phone: editableUser.phone || user.phone,
          zipcode: editableUser.zipcode || user.address?.zipcode,
        })
      );
    } else {
      console.error("User data is missing or invalid");
    }
  };
  const handleBackToMainPage = () => {
    navigate("/main");
  };

  return (
    <Box sx={{ maxWidth: 750, margin: "auto", marginTop: 4 }}>
      {/* 显示用户头像 */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <Avatar
          alt={user?.username || "User"}
          src={user?.avatar}
          sx={{ width: 100, height: 100 }} // 控制头像大小
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <Button variant="contained" component="label">
          Upload Image
          <input
            type="file"
            hidden
            // onChange={(e) => setImage(e.target.value)}
          />
        </Button>
      </Box>

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
            {/* Username */}
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", fontWeight: "bold" }}
              >
                Username
              </TableCell>
              <TableCell align="center">
                <CustomTextField
                  value={editableUser.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  error={updateErrors.username}
                  helperText={updateErrors.username}
                />
              </TableCell>
              <TableCell align="center">{user?.username}</TableCell>
            </TableRow>

            {/* Name */}
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", fontWeight: "bold" }}
              >
                Display Name
              </TableCell>
              <TableCell align="center">
                <CustomTextField
                  value={editableUser.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </TableCell>
              <TableCell align="center">{user?.name}</TableCell>
            </TableRow>

            {/* Password */}
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", fontWeight: "bold" }}
              >
                Password
              </TableCell>
              <TableCell align="center">
                <CustomTextField
                  type="password"
                  value={editableUser.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  error={updateErrors.password}
                  helperText={updateErrors.password}
                />
              </TableCell>
              <TableCell align="center">
                {"*".repeat(user?.address?.street?.length || 0)}
              </TableCell>
            </TableRow>

            {/* Confirm Password */}
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", fontWeight: "bold" }}
              >
                Confirm Password
              </TableCell>
              <TableCell align="center">
                <CustomTextField
                  type="password"
                  value={editableUser.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  error={updateErrors.passwordConfirm}
                  helperText={updateErrors.passwordConfirm}
                />
              </TableCell>
              <TableCell align="center">
                {"*".repeat(user?.address?.street?.length || 0)}
              </TableCell>
            </TableRow>

            {/* Email */}
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", fontWeight: "bold" }}
              >
                Email
              </TableCell>
              <TableCell align="center">
                <CustomTextField
                  value={editableUser.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={updateErrors.email}
                  helperText={updateErrors.email}
                />
              </TableCell>
              <TableCell align="center">{user?.email}</TableCell>
            </TableRow>

            {/* Phone */}
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", fontWeight: "bold" }}
              >
                Phone Number
              </TableCell>
              <TableCell align="center">
                <CustomTextField
                  value={editableUser.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={updateErrors.phone}
                  helperText={updateErrors.phone}
                />
              </TableCell>
              <TableCell align="center">{user?.phone}</TableCell>
            </TableRow>

            {/* Zipcode */}
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontSize: "16px", fontWeight: "bold" }}
              >
                Zipcode
              </TableCell>
              <TableCell align="center">
                <CustomTextField
                  value={editableUser.zipcode}
                  onChange={(e) =>
                    handleInputChange("zipcode", e.target.value)
                  }
                  error={updateErrors.zipcode}
                  helperText={updateErrors.zipcode}
                />
              </TableCell>
              <TableCell align="center">{user?.address?.zipcode}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 按钮区域 */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          UPDATE
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleBackToMainPage}
        >
          Back to MainPage
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;
