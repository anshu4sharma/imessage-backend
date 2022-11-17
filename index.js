const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const UserRoute = require("./src/router/Users");
const UpiRoute = require("./src/router/UpiLink");
var cookieParser = require("cookie-parser");
app.use(cookieParser());
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
app.use(function(req, res, next) {  
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); 
app.get("/", (req, res) => {
  res.send("hello im anshu sharma ....");
});
app.use("/users", UserRoute);
app.use("/genlink", UpiRoute);
app.listen(PORT, () => {
  console.log("Running");
});
