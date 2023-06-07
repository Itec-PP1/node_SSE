const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const body = req.headers["authorization"];
  if (!body) {
    return res.status(403).send("El token es requerido");
  }
  const token = body.replace("Bearer ", "")
  try {
    const decoded = jwt.verify(token, config.JWT_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Token invalido");
  }
  return next();
};

module.exports = verifyToken;