import jwt from "jsonwebtoken";

const userAuthenticator = {
  authJWT: async (req, res, next) => {
    try {
      const authorization = req.headers.authorization?.split(" ");
      let msg;
      if (!authorization) throw new Error("Sign-in required.");
      if (authorization[0] !== "Bearer") throw new Error("Invalid token type.");

      jwt.verify(authorization[1], process.env.SECRET, (err, user) => {
        if (err) throw Error(err.message);
        req.body.user = user;
        next();
      });
    } catch (err) {
      console.log(req.originalUrl, "Authentication failed.");
      return res.status(403).json({ message: err.message });
    }
  },
};

export default userAuthenticator;
