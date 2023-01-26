const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const UserRoute = require("./src/router/Users");
const UpiRoute = require("./src/router/UpiLink");
const UpiValidateRouter = require("./src/router/UpiValidator");
var cookieParser = require("cookie-parser");
require("dotenv").config();
require("./src/db/conn");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://anshu-chat.vercel.app",
      "https://imessage.pages.dev",
      "https://upipayy.vercel.app",
      "https://upipay.anshusharma.me",
      "https://chat.anshusharma.me",
      "https://nextjs-typescript-template-production.up.railway.app",
    ],
    credentials: "true",
  })
);
app.get("/test", function (req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://nextjs-typescript-template-production.up.railway.app"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  console.log("Cookies: ", req.cookies);
  res.cookie("cokkieName", Math.random()*1000, {
    maxAge: 900000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json([{ name: "anshu" }, { name: "shjarma" }]);
});

app.use("/upi", UpiValidateRouter);
app.use("/users", UserRoute);
app.use("/genlink", UpiRoute);
app.listen(PORT, () => {
  console.log("Running");
});
