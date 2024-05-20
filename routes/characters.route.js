import express from "express";
import Character from "../schemas/characters.schema.js";
import { characterValidatorJoi as cv } from "../middlewares/characters-validator.middleware.js";
import CharacterNotFoundError from "../lib/errors/character-not-found.error.js";

const router = express.Router();

/**
 * CREATE: Creates a new character, if it is not a duplicate.
 */
router.post(
  "/characters",
  cv.characterNameValidation,
  async (req, res, next) => {
    try {
      const { name } = req.body;

      // get the count using Character.getNextNumber() in schema's pre
      // or simply use Trigger set in MongoDB Atlas
      const character = await Character.create({
        name: name,
      });

      console.log(
        "Character created: ",
        character.character_id,
        character.name,
      );

      return res.status(201).json({ character_id: character.character_id });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * READ: Get the data for the given character_id, if present.
 */
router.get(
  "/characters/:character_id",
  cv.characterIdValidation,
  async (req, res, next) => {
    try {
      const character_id = req.params.character_id;
      let msg = `Successfully retrieved character data.`;
      const character = await Character.findOne({
        character_id: character_id,
      }).populate("equipped");

      if (!character) throw new CharacterNotFoundError();

      return res.status(200).json({
        message: msg,
        data: {
          name: character.name,
          health: character.health,
          power: character.power,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * UPDATE: Updates the character data by the given character_id, if present.
 */
router.put(
  "/characters/:character_id",
  cv.characterIdValidation,
  async (req, res, next) => {
    // const character_id = req.params.character_id;
    res.send(501).json({ errorMessage: "Update user not yet implemented." });
  },
);

/**
 * DELETE: Deletes the character found by character_id, if present.
 */
router.delete(
  "/characters/:character_id",
  cv.characterIdValidation,
  async (req, res, next) => {
    try {
      const cid = req.params.character_id;
      let msg = `Successfully deleted user ${cid}`;
      const character = await Character.deleteOne({ character_id: cid }).exec();

      if (character.deletedCount === 0) throw new CharacterNotFoundError();

      return res.status(200).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
