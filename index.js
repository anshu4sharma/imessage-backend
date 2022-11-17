const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const UserRoute = require("./src/router/Users");
const UpiRoute = require("./src/router/UpiLink");
var cookieParser = require("cookie-parser");
app.use(cookieParser());
var session = require('express-session')
require("./src/db/conn");
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://anshu-chat.vercel.app",
      "https://imessage.pages.dev",
      "https://upipayy.vercel.app",
    ],
    credentials: true, // is neccessary for setting cookie
    exposedHeaders: ["set-cookie"], // is neccessary for setting cookie
  })
);
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.get("/", (req, res) => {
  res.send(" im anshu sharma ....");
});

app.use("/users", UserRoute);
app.use("/genlink", UpiRoute);
app.listen(PORT, () => {
  console.log("Running");
});
