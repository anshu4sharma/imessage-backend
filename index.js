const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const UserRoute = require("./src/router/Users");
const UpiRoute = require("./src/router/UpiLink");
require("./src/db/conn");
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://anshu-chat.vercel.app",
      "https://imessage.pages.dev",
      "https://upipayy.vercel.app",
    ]
  })
);
app.get("/", (req, res) => {
  res.send("i'm anshu sharma ....");
});

app.use("/users", UserRoute);
app.use("/genlink", UpiRoute);
app.listen(PORT, () => {
  console.log("Running");
});
