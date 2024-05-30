import jwt from "jsonwebtoken";

const userAuthenticator = {
  authStrict: async function (req, res, next) {
    try {
      const authorization = req.headers.authorization?.split(" ");

      if (!authorization) {
        const error = new Error("Sign-in required.");
        error.code = 401;
        throw error;
      }
      if (authorization[0] !== "Bearer") {
        const error = new Error("Invalid token type.");
        error.code = 400;
        throw error;
      }

      jwt.verify(authorization[1], process.env.SECRET, (err, user) => {
        if (err) {
          const error = new Error(err.message);
          error.code = 403;
          throw error;
        }
        req.body.user = user;
        next();
      });
    } catch (err) {
      return res.status(err.code).json({ message: err.message });
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
      next();
    }
  },
};

export default userAuthenticator;
