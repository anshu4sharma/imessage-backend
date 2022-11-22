const express = require("express");
const router = new express.Router();
const UpiLink = require("../model/UpiSchema");
const QrCode = require("../model/QrCode");
const { randomUUID } = require("crypto");

router.get("/all/:id", async (req, res) => {
  //  fetch all link of a merchant by his id 
  try {
    let Links = await UpiLink.find({ merchantId: { $eq: req.params["id"] } });
    res.send(Links);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/uid/:id", async (req, res) => {
  //  fetch all link of a merchant by his id 
  try {
    let link = await UpiLink.find({ uid: { $eq: req.params["id"] } });
    res.send(link);
  } catch (error) {
    res.status(500).send(error);
  }
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
    res.status(200).send({ success: true, uid: uid });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.post("/saveqrcode", async (req, res) => {
  let { upiId, merchantId } = req.body;
  try {
    let qrCode = new QrCode({ upiId, merchantId });
    await qrCode.save();
    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/getqrcode/:id", async (req, res) => {
  try {
    let qrCode = await QrCode.find({ merchantId: { $eq: req.params["id"] } });
    res.status(200).send(qrCode);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/showall", async (req, res) => {
  try {
    const data = await UpiLink.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/deleteAll/:id", async (req, res) => {
  let Del = await UpiLink.deleteMany({ merchantId: { $eq: req.params["id"] } });
  res.send(Del);
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let Del = await UpiLink.deleteOne({ uid: { $eq: req.params["id"] } });
    res.send(Del);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
