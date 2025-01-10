const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: String, required: true },
  phone: { type: String, required: true },
  zipcode: { type: String, required: true },
  avatar: { type: String },
  headline: { type: String, default: "Hello World" },
  followingUsers: { type: [String], default: [] },
});

module.exports = mongoose.model("User", userSchema);

/*
{
    "username": "testUser",
    "password": "123",
    "email": "test@test.com",
    "dob": "1990-01-01",
    "phone": "123-456-7890",
    "zipcode": "12345",
    "avatar": "https://example.com/avatar.jpg",
    "headline": "Hello World!",
    "followingUsers": ["user1", "user2"]
}
*/