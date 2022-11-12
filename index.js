const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const responseTime = require("response-time");
var compression = require("compression");
const UserRoute = require("./src/router/Users");
const UpiRoute = require("./src/router/UpiLink");
require("./src/db/conn");
app.use(compression());
app.use(responseTime());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://anshu-chat.vercel.app",
      "https://imessage.pages.dev",
    ],
  })
);
app.get("/", (req, res) => {
  res.send("hello from anshu sharma ");
});
app.use("/users", UserRoute);
app.use("/genlink", UpiRoute);
app.listen(PORT, () => {
  console.log("Running");
});
