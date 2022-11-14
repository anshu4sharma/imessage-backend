const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://anshu0x:Anshu%402008@userapi.xv6o9pk.mongodb.net/?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
