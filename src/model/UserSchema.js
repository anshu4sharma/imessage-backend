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
    type: String,
    validate(data) {
      if (!validator.isEmail(data)) {
        throw new Error("Email is not valid");
      }
    },
  },
  phone: {
    unique: [true, "Phone no. is already present"],
    required: true,
    type: Number,
    minlength: 10,
    maxlenth: 10,
  },
  address: {
    required: true,
    type: String,
  },
});

//  here we are creating model / collection
const Users = new mongoose.model("Users", UserSchema);

module.exports = Users;
