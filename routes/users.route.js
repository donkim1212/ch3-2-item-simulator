import express from "express";
import { prisma } from "../lib/utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uv from "../middlewares/validators/user-validator.middleware.js";

const router = express.Router();

/**
 * CREATE: Sign-up
 */
router.post("/users/sign-up", uv.signUpValidation, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, process.env.SALT);

    await prisma.users.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Sign-up successful." });
  } catch (err) {
    next(err);
  }
});

/**
 * CREATE: Sign-in
 */
router.post("/users/sign-in", uv.signInValidation, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let msg;

    const user = await prisma.users.findUnique({
      where: { username: username },
    });

    if (!user) throw new Error("User not found.");

    if (!(await bcrypt.compare(password, user.password))) {
      msg = "Password didn't match.";
      return res.status(401).json({ message: msg });
    }

    const token = jwt.sign(
      { userId: user.userId, username: username },
      process.env.SECRET,
      { expiresIn: 1800 },
    );
    res.setHeader("authorization", "Bearer " + token);

    msg = "Sign-in successful.";
    return res.status(200).json({ message: msg });
  } catch (err) {
    next(err);
  }
});

/**
 * READ: get user data
 */
router.get("/users/find/:username", async (req, res, next) => {
  // (NEED AUTH) get user's information
  res.send(501).json({ message: "Feature not yet implemented." });
});

export default router;
