import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  console.log("running middleware");

  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      throw new Error("No auth headers found.");
    }

    const decodedToken = jwt.verify(authHeaders, process.env.JWT_SECRET_KEY);
   
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const authorize = function (requiredRole) {
  return (req, res, next) => {
    console.log(req.user);
    try {
      if (req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ success: false, message: "Not enough permissions." });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};

const authorizeOwnerShip = function (schema) {
  return async (req, res, next) => {
    try {
      const resource = await schema.findById(req.params.id);

      if (resource.user.toString() !== req.user.id) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};

export { authenticate, authorize, authorizeOwnerShip };
