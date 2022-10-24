const express = require("express");
const router = new express.Router();
const Users = require("../model/UserSchema");
const bcrypt = require("bcrypt");
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

router.get("/", async (req, res) => {
  const data = await Users.find();
  res.send(data);
});

router.delete("/:id", async (req, res) => {
  let Del = await Users.findByIdAndDelete(req.params["id"]);
  await res.send(Del);
});

router.post("/", async (req, res) => {
  const random = Math.floor(Math.random() * 9000 + 1000);
  let salt = await bcrypt.genSalt(saltround);
  let hash_password = await bcrypt.hash(req.body.password, salt);
  let user = {
    name: req.body.name,
    email: req.body.email,
    isVerified: req.body.isVerified,
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
      res.status(404).send("User Already Exists!");
    } else {
      await userInfo.save();
      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          return console.log(error);
        }
        res.status(200).send({ message: "Mail send" });
      });
      res.send(userInfo);
    }
  } catch (error) {
    console.log(error);
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
      await res.send("Verified");
    } else {
      res.send("wrong otp");
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.send("please fill the data");
    }
    let IsValidme = await Users.findOne({ email: email });
    if (IsValidme) {
      let isMatch = await bcrypt.compare(password, IsValidme.password);
      if (isMatch) {
        await res.send("Login Success");
      } else {
        res.send("wrong otp");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
