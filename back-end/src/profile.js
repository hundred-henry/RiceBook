const { isLoggedIn } = require("./auth");
const { hashPassword } = require("../utils/hashUtils"); // 引入 hashPassword 函数
const mongoose = require("mongoose");

// 检查模型是否已定义
const User = require("../models/userModel");

// Handler: 获取用户 headline
const getHeadline = async (req, res) => {
  const username = req.params.user || req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res
      .status(200)
      .send({ username: user.username, headline: user.headline });
  } catch (error) {
    console.error("Error fetching headline:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 更新用户 headline
const updateHeadline = async (req, res) => {
  const username = req.user.username;
  const { headline } = req.body;

  if (!headline) {
    return res.status(400).send({ error: "Headline is required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { headline },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res
      .status(200)
      .send({ username: user.username, headline: user.headline });
  } catch (error) {
    console.error("Error updating headline:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 获取用户 email
const getEmail = async (req, res) => {
  const username = req.params.user || req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).send({ username: user.username, email: user.email });
  } catch (error) {
    console.error("Error fetching email:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 更新用户 email
const updateEmail = async (req, res) => {
  const username = req.user.username;
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ error: "Email is required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { email },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).send({ username: user.username, email: user.email });
  } catch (error) {
    console.error("Error updating email:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 获取用户 avatar
const getAvatar = async (req, res) => {
  const username = req.params.user || req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res
      .status(200)
      .send({ username: user.username, avatar: user.avatar });
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 更新用户 avatar
const updateAvatar = async (req, res) => {
  const username = req.user.username;
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(400).send({ error: "Avatar URL is required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { avatar },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res
      .status(200)
      .send({ username: user.username, avatar: user.avatar });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};


// Handler: 获取用户 zipcode
const getZipcode = async (req, res) => {
  const username = req.params.user || req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res
      .status(200)
      .send({ username: user.username, zipcode: user.zipcode });
  } catch (error) {
    console.error("Error fetching zipcode:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 更新用户 zipcode
const updateZipcode = async (req, res) => {
  const username = req.user.username;
  const { zipcode } = req.body;

  if (!zipcode) {
    return res.status(400).send({ error: "Zipcode is required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { zipcode },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res
      .status(200)
      .send({ username: user.username, zipcode: user.zipcode });
  } catch (error) {
    console.error("Error updating zipcode:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 获取用户 phone
const getPhone = async (req, res) => {
  const username = req.params.user || req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).send({ username: user.username, phone: user.phone });
  } catch (error) {
    console.error("Error fetching phone:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 更新用户 phone
const updatePhone = async (req, res) => {
  const username = req.user.username;
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).send({ error: "Phone number is required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { phone },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).send({ username: user.username, phone: user.phone });
  } catch (error) {
    console.error("Error updating phone:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 更新用户密码
// Handler: 更新用户密码
const updatePassword = async (req, res) => {
  const username = req.user.username; // 当前登录用户
  const { password } = req.body; // 从请求中获取新密码

  if (!password) {
    return res.status(400).send({ error: "Password is required" });
  }

  try {
    // 加密新密码
    const passwordHash = await hashPassword(password); // 使用 await 解析 Promise

    // 更新数据库中的密码
    const user = await User.findOneAndUpdate(
      { username },
      { passwordHash: passwordHash }, // 确保传递的是解析后的字符串
      { new: true } // 返回更新后的文档
    );

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    return res.status(200).send({ username: user.username, result: "success" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// 导出路由
module.exports = (app) => {
  app.get("/headline/:user?", isLoggedIn, getHeadline);
  app.put("/headline", isLoggedIn, updateHeadline);
  app.get("/email/:user?", isLoggedIn, getEmail);
  app.put("/email", isLoggedIn, updateEmail);
  app.get("/avatar/:user?", isLoggedIn, getAvatar);
  app.put("/avatar", isLoggedIn, updateAvatar);
  app.get("/zipcode/:user?", isLoggedIn, getZipcode);
  app.put("/zipcode", isLoggedIn, updateZipcode);
  app.get("/phone/:user?", isLoggedIn, getPhone); // 添加获取 phone 的路由
  app.put("/phone", isLoggedIn, updatePhone); // 添加更新 phone 的路由
  app.put("/password", isLoggedIn, updatePassword);

  // app.get("/headline/:user?", getHeadline);
  // app.put("/headline", updateHeadline);
  // app.get("/email/:user?", getEmail);
  // app.put("/email", updateEmail);
  // app.get("/avatar/:user?", getAvatar);
  // app.put("/avatar", updateAvatar);
  // app.get("/zipcode/:user?", getZipcode);
  // app.put("/zipcode", updateZipcode);
  // app.get("/phone/:user?", getPhone); // 添加获取 phone 的路由
  // app.put("/phone", updatePhone); // 添加更新 phone 的路由
  // app.put("/password", updatePassword);
};
