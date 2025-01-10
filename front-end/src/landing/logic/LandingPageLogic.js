import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/userSlice";
import api from "../../utils/api"; // 引入 axios 实例

const useLandingPageLogic = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Registration form state
  const [registerState, setRegisterState] = useState({
    accountname: "",
    password: "",
    passwordConfirm: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    zipcode: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});

  // Login form state
  const [loginState, setLoginState] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { credential } = response;

      // 将 Google id_token 发送到后端
      const result = await api.post("/auth/google-login", {
        token: credential,
      });

      // 更新 Redux 状态
      dispatch({
        type: "user/loginUser/fulfilled",
        payload: result, // 直接使用 result
      });

      navigate("/main");
    } catch (error) {
      console.error("Google Login Error:", error);
      setLoginError(error.message || "Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google Login Failed:", error);
    setLoginError("Google login failed. Please try again.");
  };

  // Registration submit handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    const {
      accountname,
      password,
      passwordConfirm,
      dateOfBirth,
      email,
      phoneNumber,
      zipcode,
    } = registerState;

    // Validation
    if (!accountname) newErrors.accountname = "Account name is required.";
    if (!password) newErrors.password = "Password is required.";
    if (password !== passwordConfirm)
      newErrors.passwordConfirm = "Passwords do not match.";

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    } else {
      const dob = new Date(dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 18 || age > 100) {
        newErrors.dateOfBirth = "You must be between 18 and 100 years old.";
      }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email))
      newErrors.email = "Invalid email format.";

    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneNumber || !phonePattern.test(phoneNumber))
      newErrors.phoneNumber =
        "Invalid phone number. Must be like XXX-XXX-XXXX.";

    const zipcodePattern = /^\d{5}$/;
    if (!zipcode || !zipcodePattern.test(zipcode))
      newErrors.zipcode = "Invalid zipcode. Must be 5 digits.";

    setRegisterErrors(newErrors);

    // If there are validation errors, stop further execution
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Proceed with registration
    try {
      await api.post("/register", {
        username: accountname,
        password: password,
        dob: dateOfBirth,
        email: email,
        phone: phoneNumber,
        zipcode: zipcode,
      });

      // If registration succeeds, navigate to main page
      navigate("/main");
    } catch (error) {
      // Display server-side error message
      setRegisterErrors({
        accountname: error.response?.data?.message || "Registration failed.",
      });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = loginState;

    try {
      await dispatch(loginUser({ username, password })).unwrap(); // 使用 Redux Thunk
      setLoginError("");
      navigate("/main");
    } catch (error) {
      setLoginError("Invalid username or password.");
    }
  };

  return {
    registerState,
    setRegisterState,
    registerErrors,
    handleRegisterSubmit,
    loginState,
    setLoginState,
    loginError,
    handleLoginSubmit,
    handleGoogleLoginSuccess,
    handleGoogleLoginFailure,
  };
};

export default useLandingPageLogic;
