const mongoose = require("mongoose");
mongoose
  // .connect("mongodb+srv://anshu0x:Anshu%402008@cluster0.xgitifz.mongodb.net/login?retryWrites=true&w=majority",{
  .connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0",{
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
