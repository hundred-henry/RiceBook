const { hashPassword } = require("../utils/hashUtils");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID = "361435296868-mtebub9igllbemm5c6q6f567hsfrvqtb.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

/**
 * Middleware: Ensure user is logged in
 */
const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.username) {
    req.user = { username: req.session.username };
    return next();
  }
  res.status(401).send("Unauthorized");
};

/**
 * POST /register
 * Register a new user
 */
const register = async (req, res) => {
  const { username, password, email, dob, phone, zipcode, headline, avatar } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ status: "error", message: "User already exists" });
    }

    const passwordHash = await hashPassword(password);

    const newUser = new User({
      username,
      passwordHash,
      email,
      dob,
      phone,
      zipcode,
      headline: headline || "Hello World!",
      avatar,
    });
    await newUser.save();

    res.status(201).send({ status: "success", username });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

/**
 * POST /login
 * Log in an existing user
 */
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).send("Invalid credentials");
    }

    // Store session data
    req.session.username = username;

    // // Set cookie (if needed in addition to session)
    // res.cookie("connect.sid", req.session.id, {
    //   httpOnly: true, // Prevent client-side JS access
    //   secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-site delivery
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    // });

    res.status(200).send({
      username,
      result: "success",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

/**
 * Google Login Handler
 */
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const passwordHash = await hashPassword("123");
      user = new User({
        username: name || `User_${sub}`,
        passwordHash,
        email,
        dob: "2000-01-01",
        phone: "000-000-0000",
        zipcode: "00000",
        avatar: picture || "",
        headline: "Signed up with Google",
      });
      await user.save();
    }

    req.session.username = user.username;

    res.status(201).send({
      status: "success",
      username: user.username,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).send({ status: "error", message: "Invalid Google token" });
  }
};

/**
 * PUT /logout
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to logout");
    }
    res.clearCookie("connect.sid");
    res.status(200).send("OK");
  });
};

module.exports = {
  isLoggedIn,
  register,
  login,
  logout,
  googleLogin,
};
