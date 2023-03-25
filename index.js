const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const UserRoute = require("./src/router/Users");
const UpiRoute = require("./src/router/UpiLink");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
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
    ],
    credentials: "true",
  })
);
const limiter4auth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const limiter4links = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


app.get("/test", limiter4links,function (req, res) {
  res.setHeader("Access-Control-Allow-Origin",process.env.URL);
  res.setHeader("Access-Control-Allow-Credentials", true);
  console.log("Cookies: ", req.cookies);
  res.cookie("cokkieName", Math.random() * 1000, {
    maxAge: 900000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json([{ name: "anshu" }, { name: "sharma" }]);
});

// Apply the rate limiting middleware to all requests

app.use("/users", limiter4auth, UserRoute);
app.use("/genlink",limiter4links, UpiRoute);

app.listen(PORT, () => {
  console.log("Running");
});
