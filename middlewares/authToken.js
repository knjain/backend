const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "No token provided." });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }
    // console.log(decoded);

    req.user = decoded;
    // console.log(req.user);

    next();
  });
};

module.exports = {
  authenticateToken,
};