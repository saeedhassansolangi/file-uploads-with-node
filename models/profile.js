const { Schema, model } = require("mongoose");

const profile = new Schema({
  name: String,
  image: String,
  bio: String,
});

module.exports = model("Profile", profile);
