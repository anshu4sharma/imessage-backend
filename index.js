const express = require("express");
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors())
require("./src/db/conn");
const router = require("./src/router/Users");
app.get("/", (req, res) => {
  res.send("hello from anshu ");
});

app.use("/users", router);
app.listen(PORT, () => {
  console.log("Running");
});
