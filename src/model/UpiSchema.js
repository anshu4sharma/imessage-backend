const mongoose = require("mongoose");
const UpiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    upiId: {
      required: true,
      type: String,
    },
    description: {
      type: String,
    },
    amount: {
      required: true,
      type: Number,
    },
    uid: {
      type: String,
    },
    merchantId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UpiLink = new mongoose.model("UpiLink", UpiSchema);

module.exports = UpiLink;
