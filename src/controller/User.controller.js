const Users = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { saltround } = require("../constants");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

 class UserController {
    static Signup = async (req, res) => {
        const random = Math.floor(Math.random() * 9000 + 1000);
        let salt = await bcrypt.genSalt(saltround);
        let hash_password = await bcrypt.hash(req.body.password, salt);
        let user = {
          name: req.body.name,
          email: req.body.email,
          password: hash_password,
          otp: random,
        };
        let userInfo = new Users(user);
        let IsEmail = await Users.findOne({ email: req.body.email });
        try {
          if (IsEmail) {
            res.status(401).send("User Already Exists!");
          } else {
            await userInfo.save();
            res.json({ result: "success" });
          }
        } catch (error) {
          res.status(500).send("Server error");
        }
      }

      static Verify_user_otp = async (req, res) => {
        try {
            const { email, otp } = req.body;
            const updatedUser = await Users.findOneAndUpdate(
                { email, otp },
                { $set: { isVerified: true } },
                { new: true, upsert: false }
            );
    
            if (updatedUser) {
                res.status(200).send("Verified");
            } else {
                res.status(401).send("Invalid OTP");
            }
        } catch (error) {
            console.error("Error in verifying OTP:", error);
            res.status(500).send("Server error");
        }
    }
    

      static Login =  async (req, res) => {
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            res.status(403).send("please fill the data");
          }
          let IsValidme = await Users.findOne({ email: email });
          if (!IsValidme) {
            res.status(403).send("invalid credential");
          } else {
            if (IsValidme.isVerified) {
              let data = {
                id: IsValidme.id,
                name: IsValidme.name
              };
              let isMatch = await bcrypt.compare(password, IsValidme.password);
              if (isMatch) {
                let authToken = jwt.sign(data, JWT_SECRET);
                res.status(200).send({ authToken });
              } else {
                res.status(403).send("invalid credential");
              }
            } else {
              res.status(401).send("not verified");
            }
          }
        } catch (error) {
          console.log(error);
          res.status(500).send(error);
        }
      }

      static FindUser = async (req, res) => {
        try {
          const userid = req.id;
          const user = await Users.findById(userid);
          res.status(200).send(user);
        } catch (error) {
          console.log(error);
          res.status(401).send("Server error");
        }
      }
}


module.exports = UserController;
