"use strict";

const jwt = require("jsonwebtoken");

function generateToken(payload) {
  let token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
module.exports = {
  generateToken,
  verifyToken,
};

