const mongoose = require("mongoose");
const { isLoggedIn } = require("./auth"); // 使用相对路径正确导入
const Article = require("../models/articleModel");

// GET /articles/:id?
const getArticles = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      if (!isNaN(id)) {
        const article = await Article.findOne({ pid: Number(id) });
        if (!article) {
          return res.status(404).send("Article not found");
        }
        return res.send({ articles: [article] });
      }

      const articlesByAuthor = await Article.find({ author: id });
      if (!articlesByAuthor.length) {
        return res.status(404).send("No articles found for the user");
      }
      return res.send({ articles: articlesByAuthor });
    }

    // 获取当前用户的文章
    const userArticles = await Article.find({ author: req.user.username });
    return res.send({ articles: userArticles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).send("Internal server error");
  }
};

// GET /articles/user/:username
const getArticlesByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // 检查 username 是否存在
    if (!username) {
      return res.status(400).send("Username is required");
    }

    // 查找对应用户的文章
    const userArticles = await Article.find({ author: username });

    if (!userArticles.length) {
      return res.status(404).send("No articles found for the user");
    }

    return res.send({ articles: userArticles });
  } catch (error) {
    console.error("Error fetching articles by username:", error);
    res.status(500).send("Internal server error");
  }
};

// PUT /articles/:id
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, commentId } = req.body;

    const article = await Article.findOne({ pid: id });
    if (!article) {
      return res.status(404).send("Article not found");
    }

    // 更新文章内容（如果没有 commentId）
    if (!commentId && article.author === req.user.username) {
      article.text = text;
      await article.save();
      return res.send({ articles: [article] });
    }

    // 如果 commentId 为 -1，则添加新评论
    if (commentId === -1) {
      const newComment = {
        commentId: new Date().getTime(),
        author: req.user.username,
        text,
        date: new Date(),
      };
      article.comments.push(newComment);
      await article.save();
      return res.send({ articles: [article] });
    }

    // 如果 commentId 已存在，则更新评论
    const comment = article.comments.find((c) => c.commentId === commentId);
    if (comment && comment.author === req.user.username) {
      comment.text = text;
      await article.save();
      return res.send({ articles: [article] });
    }

    return res.status(403).send("Forbidden: You cannot update this article or comment");
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).send("Internal server error");
  }
};

// POST /article
const createArticle = async (req, res) => {
  try {
    const { title, text, author, image } = req.body;

    if (!text) {
      return res.status(400).send("Text is required to create an article");
    }

    const newArticle = new Article({
      pid: new Date().getTime(), // 使用时间戳作为唯一 ID
      title: title || "",
      author: req.user.username, // 从 session 中获取用户名
      text: text,
      image: image || "",
      date: new Date(),
      comments: [],
    });

    await newArticle.save();
    res.status(201).send({ articles: [newArticle] });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).send("Internal server error");
  }
};

// Export routes
module.exports = (app) => {
  // Route handlers
  app.get("/articles/:id?", isLoggedIn, getArticles); // 获取文章
  app.put("/articles/:id", isLoggedIn, updateArticle); // 更新文章或评论
  app.post("/article", isLoggedIn, createArticle); // 创建新文章
  app.get("/articles/user/:username", isLoggedIn, getArticlesByUsername); // 根据 username 获取文章

  // app.get("/articles/:id?", getArticles); // 获取文章
  // app.put("/articles/:id", updateArticle); // 更新文章或评论
  // app.post("/article", createArticle); // 创建新文章
  // app.get("/articles/user/:username", getArticlesByUsername); // 根据 username 获取文章
};
