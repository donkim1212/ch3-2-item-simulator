import express from "express";
import { prisma } from "../lib/utils/prisma/index.js";
import { characterValidatorJoi as cv } from "../middlewares/validators/characters-validator.middleware.js";
import ua from "../middlewares/auths/user-authenticator.middleware.js";
import CharacterNotFoundError from "../lib/errors/character-not-found.error.js";

const router = express.Router();

/**
 * CREATE: Creates a new character, if it is not a duplicate.
 */
router.post(
  "/characters",
  ua.authJWT,
  cv.characterNameValidation,
  async (req, res, next) => {
    try {
      const { characterName, user } = req.body;
      console.log(user, "----------------------");
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
  ua.authLight,
  cv.characterIdValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;
      let msg = `Successfully retrieved character data.`;
      const character = await prisma.characters.findFirst({
        where: { characterId: characterId },
        select: {
          characterName: true,
          health: true,
          power: true,
          money: req.body.user ? true : false,
        },
      });

      if (!character) throw new CharacterNotFoundError();

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
  ua.authJWT,
  cv.characterIdValidation,
  async (req, res, next) => {
    try {
      const cid = req.params.characterId;
      let msg = `Successfully deleted character ${cid}`;
      const character = await prisma.characters.delete({
        where: { characterId: cid },
      });

      if (!character) throw new CharacterNotFoundError();

      return res.status(200).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
