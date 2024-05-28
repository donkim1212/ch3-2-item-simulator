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

      await et.characterChecker({ characterId });

      const equipments = await prisma.$queryRaw`
        SELECT eq.item_code,
          i.name
        FROM Equipments as eq
        INNER JOIN Items as i
        ON eq.item_code=i.item_code
        WHERE eq.character_id like ${characterId}
      `;
      // const equipment = await prisma.equipments.findMany({
      //   select: { itemCode: true, itemName: true },
      //   where: { characterId: characterId },
      // });

      return res.status(200).json([...equipments]);
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
      const { characterId } = req.params;
      const { itemCode, equip, user } = req.body;

      // error checkers
      const character = await et.characterUserChecker(user, { characterId });
      const item = await et.itemChecker({ itemCode });
      const { equipment, inventory } = await et.equipChecker(equip, {
        characterId,
        itemCode,
      });

      // equip/unequip
      await prisma.$transaction(
        async (tx) => {
          if (equip) {
            await tx.equipments.create({
              data: {
                characterId: characterId,
                itemCode: itemCode,
              },
            });
          } else {
            await tx.equipments.delete({
              where: { equipmentId: equipment.equipmentId },
            });
          }

          await tx.characters.update({
            where: {
              characterId: characterId,
            },
            data: {
              health: {
                increment: equip ? item.itemStat.health : -item.itemStat.health,
              },
              power: {
                increment: equip ? item.itemStat.power : -item.itemStat.power,
              },
            },
          });

          await prisma.inventories.update({
            where: { inventoryId: inventory.inventoryId },
            data: {
              count: equip ? inventory.count - 1 : inventory.count + 1,
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
