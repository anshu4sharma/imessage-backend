const mongoose = require("mongoose");
const validator = require("validator");
//  the first step will be always create a Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    required: true,
    unique: true,
    type: String,
    validate(data) {
      if (!validator.isEmail(data)) {
        throw new Error("Email is not valid");
      }
    },
  },
  password: {
    required: true,
    minlength: 5,
    type: String,
  },
  isVerified: {
    required: true,
    type: Boolean,
  },
  otp:{
    required:true,
    type:Number
  }
});

//  here we are creating model / collection
const Users = new mongoose.model("Users", UserSchema);

module.exports = Users;
