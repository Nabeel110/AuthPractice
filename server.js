const express = require("express");
const mongoose = require("mongoose");
const bodyPasrer = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();

// middlwares
app.use(bodyPasrer.json());

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

//Register Request

app.post("/register", async (req, res) => {
  //   console.log(req.body);

  let newUser = new User({
    name: req.body.name,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  newUser = await newUser.save();

  if (newUser) {
    return res.json({ message: "User Created succesfully" });
  } else {
    return res.json({ message: "Error occcured while creating User" });
  }
});

//Login a User
// username:
// passwor
app.post("/login", async (req, res) => {
  let credentials = {
    username: req.body.username,
    password: req.body.password,
  };

  const user = await User.findOne({ username: credentials.username });

  if (!user) {
    res.json({ message: "User doesn't exist" });
  } else {
    if (user && bcrypt.compareSync(credentials.password, user.password)) {
      return res.json({
        message: "Succesfully logged In!",
        user_id: user._id,
        username: user.username,
      });
    }
  }
});

app.get("/", (req, res) => {
  res.send("hello world12");
});

mongoose.connect(
  "mongodb://localhost:27017/?readPreference=primary&ssl=false",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    dbName: "UsersAuth",
  },
  (err) => {
    if (!err) {
      console.log("Database is connected succesfully!");
    } else {
      console.log("error occured");
    }
  }
);

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
