const mongoose = require("mongoose");
const msgschema = new mongoose.Schema({
  msg: String,
  Usrname: String,
  id: String,
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  room: {
    type: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    email: String,
  },
});

const RoomMsgs = mongoose.model("RoomMsgs", msgschema);
module.exports = RoomMsgs;
