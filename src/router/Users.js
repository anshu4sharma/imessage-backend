const express = require("express");
const router = new express.Router();

const fetchuser = require("../middleware/fetchuser");
const  UserController  = require("../controller/User.controller");
const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

// router.get("/showall", async (req, res) => {
//   const data = await Users.find();
//   res.send(data);
// });

// router.delete("/pop/:id", async (req, res) => {
//   let Del = await Users.findByIdAndDelete(req.params["id"]);
//   res.send(Del);
// });

router.post("/", UserController.Signup);

router.post("/verify", UserController.Verify_user_otp);

router.post("/login", UserController.Login);

router.get("/getuser", fetchuser, UserController.FindUser);

module.exports = router;
