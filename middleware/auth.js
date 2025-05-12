require("dotenv").config();
const jwt = require("jsonwebtoken");
const { ERROR } = require("../utils/status");
const { UNAUTHORIZE_ERROR_MESSAGE } = require("../utils/response");
const secretKey = process.env.SECRET_KEY;

const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, secretKey);
      req.userId = user.id;
    } else {
      return res.status(400).json({
        status: ERROR,
        message: UNAUTHORIZE_ERROR_MESSAGE,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: ERROR,
      message: UNAUTHORIZE_ERROR_MESSAGE,
      error: error.message,
    });
  }
};

module.exports = auth;
