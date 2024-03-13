const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedtoken;
  try {
    decodedtoken = jwt.verify(token, "ErkadoUserToken");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedtoken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedtoken.userId;
  next();
};
