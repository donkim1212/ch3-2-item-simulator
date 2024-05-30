import express from "express";
import { prisma } from "../lib/utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import ua from "../middlewares/auths/user-authenticator.middleware.js";
import cv from "../middlewares/validators/characters-validator.middleware.js";
import et from "../lib/errors/error-thrower.js";

const router = express.Router();
const EARNED = 100;

/**
 * UPDATE: earn money
 */
router.patch(
  "/works/:characterId",
  ua.authStrict,
  cv.characterIdValidation,
  async (req, res, next) => {
    //
    try {
      const { characterId } = req.params;
      const { user } = req.body;
      const character = await et.characterUserChecker(
        user,
        { characterId },
        { money: true },
      );

      character.money += EARNED;

      await prisma.$transaction(
        async (tx) => {
          await tx.characters.update({
            where: { characterId: characterId },
            data: {
              money: character.money,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );

      let msg = `You've earned ${EARNED}g.`;
      return res.status(200).json({ message: msg, money: character.money });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
