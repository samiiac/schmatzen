import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  console.log("running middleware");
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      throw new Error("No auth header");
    }
    token = authHeaders.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const authorize = function (requiredRole) {
  return (req, res, next) => {
    try {
      
  
      if (req.user.role != requiredRole) {
        return res
          .status(403)
          .json({ success: false, message: "Not enough permissions." });
      }
  
      next();
    } catch (error) {
      console.log(error);
      return res
        .status(403)
        .json({ success: false, message: "Not enough permissions." });
    }
  };
};

export { authenticate , authorize};
