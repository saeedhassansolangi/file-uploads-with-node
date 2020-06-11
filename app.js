const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const profile = new mongoose.Schema({
  file: String,
  name: String,
});

const Profile = mongoose.model("Profil", profile);

mongoose.connect("mongodb://localhost/file", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
//Step 3:

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb("firstArgsIsError","destinationfolder")
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname); // creating file names
  },
});

// step 5: accepting file types

const fileFilter = (req, file, cb) => {
  // cb(null,false) // rejecting file
  // cb(null,true) // accetping file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// fieldname: 'file',
// originalname: 'images.jpeg',
// encoding: '7bit',
// mimetype: 'image/jpeg',
// destination: 'uploads',
// filename: '90c01a5a9c4ccd91c3859504f518bdb9',
// path: 'uploads/90c01a5a9c4ccd91c3859504f518bdb9',
// size: 13381

// step 4 : setting file size limits
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5, // file size is 5 MB , 1024 is bites
  },
  fileFilter: fileFilter,
});

// Step :1 first create a folder with it and then create a storage
// const upload = multer({ dest: "uploads" });

app.get("/", (req, res) => {
  res.send("HI");
});

app.get("/file", (req, res) => {
  res.render("file");
});

//Step 2:
// upload.single ; means we are uploading only single file , profileImage is the name used internally
// it just a name , we dont need to worry about it
app.post("/file", upload.single("file"), (req, res) => {
  const name = req.body.name;
  const file = req.file.path;
  const proifle = { file, name };
  Profile.create(proifle);
  res.send("hello World");
});

app.listen(5000);
