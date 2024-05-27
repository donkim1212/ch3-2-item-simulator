import express from "express";
import { prisma } from "../lib/utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import cv from "../middlewares/validators/characters-validator.middleware.js";
import ua from "../middlewares/auths/user-authenticator.middleware.js";
import iv from "../middlewares/validators/items-validator.middleware.js";
import et from "../lib/errors/error-thrower.js";

const router = express.Router();

/**
 * Read One
 */
router.get(
  "/equipments/:characterId",
  cv.characterIdValidation,
  async (req, res, next) => {
    try {
      const { characterId } = req.params;

      et.characterChecker(characterId);

      const equipment = await prisma.equipments.findMany({
        select: { itemCode: true, itemName: true },
        where: { characterId: characterId },
      });

      return res.status(200).json({ equipment });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * Update
 */
router.put(
  "/equipments/:characterId",
  ua.authStrict,
  cv.characterIdValidation,
  iv.itemCodeBodyValidation,
  iv.itemEquipValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;
      const { itemCode, equip } = req.body;

      // error checkers
      const character = et.characterChecker(characterId);
      const item = et.itemChecker(itemCode);
      const { equipment, inventory } = et.equipChecker(
        characterId,
        itemCode,
        equip,
      );

      // can equip/unequip

      await prisma.$transaction(
        async (tx) => {
          if (equip)
            tx.equipments.create({
              data: {
                characterId: characterId,
                itemCode: itemCode,
              },
            });
          else
            tx.equipments.delete({
              where: { itemCode: itemCode },
            });

          prisma.inventories.update({
            where: { characterId: characterId, itemCode: itemCode },
            data: {
              count: equip ? item.count - 1 : item.count + 1,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );

      // Change Character stat???
      // character.health += equip ? item.itemStat.health : -item.itemStat.health;
      // character.power += equip ? item.itemStat.power : -item.itemStat.power;

      let msg = `${equip ? "E" : "Une"}quipped the item '${item.itemName}'.`;
      return res.status(200).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
