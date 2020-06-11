const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const { connect } = require("mongoose");
const Profile = require("./models/profile");
const PORT = process.env.PORT || 4242;

connect("mongodb://localhost/profile", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((_) => console.log("Mongoose is Connected"))
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

app.get("/", (req, res) => {
  Profile.find({}, (err, profile) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", { profile });
    }
  });
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.post("/profile", upload.single("file"), (req, res) => {
  console.log(req.file);

  const name = req.body.name;
  const image = req.file.path;
  const bio = req.body.bio;
  const profile = { name, image, bio };
  Profile.create(profile, (err, profile) => {
    if (err) {
      console.log(err);
    } else {
      console.log(profile);
      res.redirect("/");
    }
  });
});

app.listen(PORT, (_) => console.log(`Server is Running on the Port ${PORT}`));
