import express from "express";
import ua from "../middlewares/auths/user-authenticator.middleware.js";
import cv from "../middlewares/validators/characters-validator.middleware.js";
import et from "../lib/errors/error-thrower.js";
import { prisma } from "../lib/utils/prisma/index.js";

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
      const { user } = req.body;
      await et.characterUserChecker(user, { characterId });

      const inventory = await prisma.$queryRaw`
        SELECT inv.item_code,
          i.name,
          inv.count
        FROM Inventories as inv
        INNER JOIN Items as i
        ON inv.item_code=i.item_code
        WHERE inv.character_id like ${characterId}
          AND count > 0
      `;

      return res.status(200).json([...inventory]);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
