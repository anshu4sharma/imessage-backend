const express = require("express")
const router = new express.Router()
const Users = require("../model/UserSchema");
router.get("/", async (req, res) => {
    const data = await Users.find();
    res.send(data);
  });
  router.get("/:id", async (req, res) => {
    const _id = req.params.id;
    const data = await Users.findById({ _id });
    res.send(data);
  });
  
  router.post("/", (req, res) => {
    const user = new Users(req.body);
    user
      .save()
      .then(() => {
        res.send(user);
      })
      .catch((err) => {
        res.send(err);
      });
  });
  router.patch("/:id", (req, res) => {
    const _id = req.params.id;
    const data = Users.findByIdAndUpdate({ _id }, req.body)
      .then(() => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
  router.delete("/:id", (req, res) => {
    const _id = req.params.id;
    const data = Users.findByIdAndDelete({ _id }, req.body)
      .then(() => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  

  module.exports = router