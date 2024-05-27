import express from "express";
import ua from "../middlewares/auths/user-authenticator.middleware.js";
import cv from "../middlewares/validators/characters-validator.middleware.js";
import { prisma } from "../lib/utils/prisma/index.js";
import CharacterNotFoundError from "../lib/errors/classes/character-not-found.error.js";

const router = express.Router();

/**
 * READ All: get all inventory items the character owns
 */
router.get(
  "/inventories/:characterId",
  ua.authStrict,
  cv.characterIdValidation,
  async (req, res, next) => {
    try {
      //
      const { characterId } = req.params;
      const character = await prisma.characters.findFirst({
        where: { characterId: characterId },
      });

      if (!character) throw new CharacterNotFoundError();
      const inventory = await prisma.$queryRaw`
        SELECT inv.item_code,
          i.name,
          inv.count
        FROM Inventories as inv
        INNER JOIN Items as i
        ON inv.item_code=i.item_code
        WHERE inv.character_id like ${characterId}
      `;

      return res.status(200).json([...inventory]);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
