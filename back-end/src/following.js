const { isLoggedIn } = require("./auth");
const mongoose = require("mongoose");

// 导入用户模型
const User = require("../models/userModel");

// Handler: 获取用户的关注列表
const getFollowing = async (req, res) => {
  const username = req.params.user || req.user.username; // 如果未指定参数，默认当前用户
  try {
    const user = await User.findOne({ username }); // 查询用户

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    return res.status(200).send({
      username: user.username,
      following: user.followingUsers,
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 添加关注用户
const addFollowing = async (req, res) => {
  const username = req.user.username; // 当前登录用户
  const userToAdd = req.params.user; // 要关注的用户

  if (!userToAdd) {
    return res.status(400).send({ error: "User to add is required" });
  }

  try {
    // 查询当前用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // 检查是否已经关注
    if (user.followingUsers.includes(userToAdd)) {
      return res.status(400).send({ error: "User already followed" });
    }

    // 检查要关注的用户是否存在
    const targetUser = await User.findOne({ username: userToAdd });
    if (!targetUser) {
      return res.status(404).send({ error: "User to follow not found" });
    }

    // 添加关注
    user.followingUsers.push(userToAdd);
    await user.save();

    return res.status(200).send({
      username: user.username,
      following: user.followingUsers,
    });
  } catch (error) {
    console.error("Error adding following:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Handler: 移除关注用户
const removeFollowing = async (req, res) => {
  const username = req.user.username; // 当前登录用户
  const userToRemove = req.params.user; // 要移除的用户

  if (!userToRemove) {
    return res.status(400).send({ error: "User to remove is required" });
  }

  try {
    // 查询当前用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // 检查是否已关注
    if (!user.followingUsers.includes(userToRemove)) {
      return res.status(400).send({ error: "User not followed" });
    }

    // 移除关注用户
    user.followingUsers = user.followingUsers.filter(
      (followedUser) => followedUser !== userToRemove
    );
    await user.save();

    return res.status(200).send({
      username: user.username,
      following: user.followingUsers,
    });
  } catch (error) {
    console.error("Error removing following:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// 导出路由处理程序
module.exports = (app) => {
  app.get("/following/:user?", isLoggedIn, getFollowing); // 获取用户的关注列表
  app.put("/following/:user", isLoggedIn, addFollowing); // 添加关注用户
  app.delete("/following/:user", isLoggedIn, removeFollowing); // 移除关注用户

  // app.get("/following/:user?", getFollowing); // 获取用户的关注列表
  // app.put("/following/:user", addFollowing); // 添加关注用户
  // app.delete("/following/:user", removeFollowing); // 移除关注用户
};
