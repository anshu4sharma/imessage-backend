const express = require("express");
const router = new express.Router();
const Users = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const JWT_SECRET = "mynameisanshu$harma";
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const nodemailer = require("nodemailer");
const saltround = 10;
const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "anshusharma.yashvi@gmail.com",
    pass: "mjrdxeztapenmaap",
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

router.get("/showall", async (req, res) => {
  const data = await Users.find();
  res.send(data);
});

router.delete("/pop/:id", async (req, res) => {
  let Del = await Users.findByIdAndDelete(req.params["id"]);
   res.send(Del);
});

router.post("/", async (req, res) => {
  const random = Math.floor(Math.random() * 9000 + 1000);
  let salt = await bcrypt.genSalt(saltround);
  let hash_password = await bcrypt.hash(req.body.password, salt);
  let user = {
    name: req.body.name,
    email: req.body.email,
    password: hash_password,
    otp: random,
  };
  const mailData = {
    from: "anshusharma.yashvi@gmail.com",
    to: req.body.email,
    subject: "Verifcation code",
    text: null,
    html: `<span>Your Verification code is ${random}</span>`,
  };
  let userInfo = new Users(user);
  let IsEmail = await Users.findOne({ email: req.body.email });
  try {
    if (IsEmail) {
      res.send("User Already Exists!");
    } else {
      await userInfo.save();
      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          res.status(500).send("Server error");
        }else{
          res.send("account created successfully");
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.post("/verify", async (req, res) => {
  try {
    let IsValid = await Users.findOne({
      $and: [{ email: req.body.email }, { otp: req.body.otp }],
    });
    if (IsValid) {
      await Users.findOneAndUpdate(
        { email: req.body.email },
        { isVerified: true },
        {
          returnOriginal: false,
        }
      );
       res.send("Verified");
    } else {
      res.send("wrong otp");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.send("please fill the data");
    }
    let IsValidme = await Users.findOne({ email: email });
    if (IsValidme.isVerified) {
      let data = {
        id: IsValidme.id,
      };
      let isMatch = await bcrypt.compare(password, IsValidme.password);
      if (isMatch) {
        let authToken = jwt.sign(data, JWT_SECRET);
        res.status(200).json({ authToken });
      } else {
        res.status(403).send("invalid credential");
      }
    } else {
      res.status(401).send("not verified");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userid = req.id;
    const user = await Users.findById(userid).select("name");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(401).send("Server error");
  }
});

module.exports = router;
