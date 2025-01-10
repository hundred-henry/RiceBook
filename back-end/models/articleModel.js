const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  pid: { type: Number, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: String,
  comments: [
    {
      commentId: Number,
      author: String,
      text: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Article", articleSchema);