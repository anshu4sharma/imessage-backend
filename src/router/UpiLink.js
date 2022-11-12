const express = require("express");
const router = new express.Router();
const UpiLink = require("../model/UpiSchema");
const { randomUUID } = require("crypto");

router.get("/links/:id", async (req, res) => {
  let Links = await UpiLink.find({ merchantId: { $eq: req.params["id"] } });
  res.send(Links);
});
router.post("/", async (req, res) => {
  let { name, description, upiId, merchantId, amount } = req.body;
  try {
    let uid = randomUUID().slice(0, 8);
    let user = {
      uid: uid,
      name,
      description,
      upiId,
      merchantId,
      amount,
    };
    let upi_Link = new UpiLink(user);
    await upi_Link.save();
    res.send({ success: true, uid: uid });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.get("/showall", async (req, res) => {
  const data = await UpiLink.find();
  res.send(data);
});

router.delete("/deleteAll/:id", async (req, res) => {
  let Del = await UpiLink.deleteMany({ merchantId: { $eq: req.params["id"] } });
  res.send(Del);
});

router.delete("/delete/:id", async (req, res) => {
  let Del = await UpiLink.deleteOne({ uid: { $eq: req.params["id"] } });
  res.send(Del);
});

module.exports = router;
