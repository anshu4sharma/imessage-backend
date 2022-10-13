const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
require("./db/conn");
const router = require("./router/Users");
app.get("/", (req, res) => {
  res.send("hello from anshu ");
});

app.use("/users", router);
app.listen(PORT, () => {
  console.log("Running");
});
