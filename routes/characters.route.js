import express from "express";
import { prisma } from "../lib/utils/prisma/index.js";
import cv from "../middlewares/validators/characters-validator.middleware.js";
import ua from "../middlewares/auths/user-authenticator.middleware.js";
import et from "../lib/errors/error-thrower.js";

const router = express.Router();

/**
 * CREATE: Creates a new character, if it is not a duplicate.
 */
router.post(
  "/characters",
  ua.authStrict,
  cv.characterNameValidation,
  async (req, res, next) => {
    try {
      const { characterName, user } = req.body;
      const character = await prisma.characters.create({
        data: {
          characterName: characterName,
          userId: user.userId,
        },
      });

      console.log(
        "Character created: ",
        character.characterId,
        character.characterName,
      );

      return res.status(201).json({ characterId: character.characterId });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * READ: Get the data for the given characterId, if present.
 */
router.get(
  "/characters/:characterId",
  ua.authOptional,
  cv.characterIdValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;
      let msg = `Successfully retrieved character data.`;
      const character = await et.characterChecker(
        { characterId: characterId },
        {
          characterName: true,
          health: true,
          power: true,
          money: req.body.user ? true : false,
        },
      );

      return res.status(200).json({
        message: msg,
        data: {
          ...character,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * UPDATE: Updates the character data by the given characterId, if present.
 */
router.put(
  "/characters/:characterId",
  cv.characterIdValidation,
  async (req, res, next) => {
    // const characterId = req.params.characterId;
    res.send(501).json({ message: "Feature not yet implemented." });
  },
);

/**
 * DELETE: Deletes the character found by characterId, if present.
 */
router.delete(
  "/characters/:characterId",
  ua.authStrict,
  cv.characterIdValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;
      let msg = `Successfully deleted character ${characterId}`;
      await prisma.characters.delete({
        where: { characterId: characterId },
      });

      return res.status(200).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
