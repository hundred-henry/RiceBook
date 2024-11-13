// LandingPageLogic.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNewUser } from "../features/userSlice";
import dayjs from "dayjs";
import { loginUser, fetchUsers } from "../features/userSlice";

const useLandingPageLogic = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Registration form state
  const [registerState, setRegisterState] = useState({
    accountname: "",
    displayname: "",
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

  // Retrieve users from Redux state
  const users = useSelector((state) => state.user.users);
  const userStatus = useSelector((state) => state.user.status);

  // Fetch users only on the first render
  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  // Registration submit handler
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const {
      accountname,
      password,
      passwordConfirm,
      dateOfBirth,
      email,
      phoneNumber,
      zipcode,
      ...rest
    } = registerState;
    let newErrors = {};

    // Check if the account name is already taken
    if (users.some((user) => user.username === accountname)) {
      newErrors.accountname = "Account name is already taken";
    }

    if (!accountname) newErrors.accountname = "Account name is required.";
    if (!password) newErrors.password = "Password is required.";
    if (password !== passwordConfirm)
      newErrors.passwordConfirm = "Passwords do not match.";

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    } else {
      const dob = dayjs(dateOfBirth);
      const minDate = dayjs().subtract(100, "year");
      const maxDate = dayjs().subtract(18, "year");
      if (dob.isBefore(minDate) || dob.isAfter(maxDate)) {
        newErrors.dateOfBirth = "You must be between 18 and 100 years old.";
      }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email))
      newErrors.email = "Invalid email format.";

    const phonePattern = /^\d{10}$/;
    if (!phoneNumber || !phonePattern.test(phoneNumber))
      newErrors.phoneNumber = "Invalid phone number. Must be 10 digits.";

    const zipcodePattern = /^\d{5}$/;
    if (!zipcode || !zipcodePattern.test(zipcode))
      newErrors.zipcode = "Invalid zipcode. Must be 5 digits.";

    setRegisterErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newUserId = Date.now();
      const newUser = { id: newUserId, username: accountname, ...rest };
      dispatch(addNewUser(newUser));
      dispatch(loginUser({ userId: newUserId }));
      navigate("/main");
    }
  };

  // Login submit handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const { username, password } = loginState;

    const user = users.find(
      (user) => user.username === username && user.address.street === password
    );

    if (!user) {
      setLoginError("Invalid username or password.");
    } else {
      dispatch(loginUser({ userId: user.id }));
      setLoginError("");
      navigate("/main");
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
    setLoginError,
  };
};

export default useLandingPageLogic;
