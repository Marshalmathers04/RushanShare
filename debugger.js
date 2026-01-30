const mongoose = require("mongoose");
const Post = require("./models/Post.js");

async function test() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");

  const newPost = new Post({ title: "Nigger" });

  // 1️⃣ validate first
  const err = newPost.validateSync();
  console.log("Validation errors:", err);

  // 2️⃣ save to DB and catch DB errors
  try {
    await newPost.save();
    console.log("Saved successfully!");
  } catch (saveErr) {
    console.error("Save failed:", saveErr);
  }

  await mongoose.disconnect();
}

test();

