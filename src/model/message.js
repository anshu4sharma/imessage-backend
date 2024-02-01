const mongoose = require("mongoose");
const msgschema = new mongoose.Schema({
  msg: String,
  Usrname: String,
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  id: String,
  receiverId: {
    type: String,
    default: "",
  },
});

const msgs = mongoose.model("Msg", msgschema);
module.exports = msgs;
