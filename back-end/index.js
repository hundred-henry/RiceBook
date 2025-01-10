const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const url = "mongodb+srv://hw88:F9YVBWBIMOkfXL98@ricebook.nvnyj.mongodb.net/?retryWrites=true&w=majority"; // 数据库 URL

const app = express();

// 根据环境设置允许的来源
const allowedOrigins = [
  "http://localhost:3000",
  "https://ricebook-hw88.surge.sh",
  "https://ricebook-hw88-bca234b45bd7.herokuapp.com",
];

// 设置中间件
app.use(bodyParser.json());
app.use(cookieParser());

// 配置跨域
app.use(
  cors({
    origin: function (origin, callback) {
      // 检查来源是否在允许列表中，或者是非跨域请求（如同源）
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 允许携带 Cookie
    methods: "GET, POST, PUT, DELETE", // 允许的请求方法
    allowedHeaders: "Content-Type, Authorization", // 允许的请求头
  })
);

// 配置 trust proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // 必须在 Heroku 或其他代理服务上启用
}

// 配置 session 中间件
app.use(
  session({
    secret: "sakiko", // 使用硬编码的 session secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: url }),
    cookie: {
      maxAge: 3600000, // 1小时
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 生产环境启用 https
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 配合跨域策略
    },
  })
);

// 连接 MongoDB
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// 引入路由
const auth = require("./src/auth"); // 包含 Google 登录逻辑
const profile = require("./src/profile");
const articles = require("./src/articles");
const following = require("./src/following");

// 配置路由
app.post("/register", auth.register);
app.post("/login", auth.login);
app.post("/auth/google-login", auth.googleLogin); // 添加 Google 登录路由
app.put("/logout", auth.logout);

app.get("/ping", (req, res) => {
  res.status(200).send({ message: "pong" });
});

articles(app);
profile(app);
following(app);

// 默认路由
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// 导出 app 供测试使用
module.exports = app;

// 启动服务
const PORT = process.env.PORT || 5000; // 默认使用 5000 端口
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
