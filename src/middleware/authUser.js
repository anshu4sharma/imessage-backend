const JWT_SECRET = "mynameisanshu$harma";
const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
  //  get the user from the jwt and add id to req object
  const token = req.cookie.token;
  try {
    if (!token) {
      res.status(401).send("Access denied");
    }
    const data = jwt.verify(token, JWT_SECRET);
    req.id = data.id;
    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(401).send(error);
  }
};

module.exports = fetchuser;
