const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    //decode the token inside which we only stored id;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).send({ msg: "Unauthorized Access" });
  }
};

module.exports = auth;
