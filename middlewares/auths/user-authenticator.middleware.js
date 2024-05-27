import jwt from "jsonwebtoken";

const userAuthenticator = {
  authStrict: async function (req, res, next) {
    try {
      const authorization = req.headers.authorization?.split(" ");

      if (!authorization) throw new Error("Sign-in required.");
      if (authorization[0] !== "Bearer") throw new Error("Invalid token type.");

      jwt.verify(authorization[1], process.env.SECRET, (err, user) => {
        if (err) throw Error(err.message);
        req.body.user = user;
        next();
      });
    } catch (err) {
      console.log(req.originalUrl, "Authentication failed: ", err.message);
      // TODO: create custom error class to set status code
      return res.status(403).json({ message: err.message });
    }
  },
  authOptional: async function (req, res, next) {
    try {
      const authorization = req.headers.authorization?.split(" ");

      jwt.verify(authorization[1], process.env.SECRET, (err, user) => {
        if (err) throw Error(err.message);
        req.body.user = user;
        next();
      });
    } catch (err) {
      req.body.user = null;
      console.log("authLight: ", err.name);
      next();
    }
  },
};

export default userAuthenticator;
