const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const responseTime = require("response-time");
var compression = require("compression");
app.use(compression())
 

app.use(responseTime());

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://anshu-chat.vercel.app"],
  })
);
require("./src/db/conn");

const router = require("./src/router/Users");
app.get("/", (req, res) => {
  res.send("hello from anshu sharma ");
});

app.use("/users", router);
app.listen(PORT, () => {
  console.log("Running");
});
