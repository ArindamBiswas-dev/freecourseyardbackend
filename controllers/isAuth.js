const { verify } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuth = (token) => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user.id;
  } catch (error) {
    console.log(error);
    throw new Error("User does not exists");
  }
};

module.exports = {
  isAuth,
};
