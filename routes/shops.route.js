import express from "express";
import { prisma } from "../lib/utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import ua from "../middlewares/auths/user-authenticator.middleware.js";
import cv from "../middlewares/validators/characters-validator.middleware.js";
import iv from "../middlewares/validators/items-validator.middleware.js";
import et from "../lib/errors/error-thrower.js";

const router = express.Router();

/**
 * Buy items from the shop.
 */
router.post(
  "/shops/:characterId",
  ua.authStrict,
  cv.characterIdValidation,
  iv.itemCodeBodyValidation,
  iv.itemCountValidation,
  async (req, res, next) => {
    try {
      const { characterId } = req.params;
      const { itemCode, count } = req.body;

      // error checker
      const item = await et.itemChecker(
        { itemCode },
        { itemName: true, itemPrice: true },
      );
      const character = await et.characterMoneyChecker(
        item.itemPrice,
        count,
        { characterId },
        { money: true },
      );
      const inventory = await et.itemBuyChecker(
        {
          characterId,
          itemCode,
        },
        { inventoryId: true, count: true },
      );

      const updatedMoney = character.money - item.itemPrice * count;

      // can buy
      if (character.money >= item.itemPrice) {
        await prisma.$transaction(
          async (tx) => {
            if (inventory) {
              await tx.inventories.update({
                where: { inventoryId: inventory.inventoryId },
                data: {
                  count: {
                    increment: count,
                  },
                },
              });
            } else {
              await tx.inventories.create({
                data: {
                  characterId: characterId,
                  itemCode: itemCode,
                  count: count,
                },
              });
            }

            await tx.characters.update({
              where: { characterId: characterId },
              data: {
                money: updatedMoney,
              },
            });
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
        );
      }
      let msg = `Bought ${count} ${item.itemName}(s).`;
      return res.status(200).json({ message: msg, money: updatedMoney });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * Sell item from inventory.
 */
router.patch(
  "/shops/:characterId",
  ua.authStrict,
  cv.characterIdValidation,
  iv.itemCodeBodyValidation,
  iv.itemCountValidation,
  async (req, res, next) => {
    //
    try {
      const { characterId } = req.params;
      const { itemCode, count } = req.body;

      const character = await et.characterMoneyChecker({ characterId });
      const item = await et.itemChecker({ itemCode });
      const inventory = await et.itemSellChecker(count, {
        characterId,
        itemCode,
      });

      const updatedMoney =
        character.money + Math.round(item.itemPrice * count * 0.6);

      await prisma.$transaction(
        async (tx) => {
          await tx.inventories.update({
            where: { inventoryId: inventory.inventoryId },
            data: {
              count: {
                increment: -count,
              },
            },
          });

          await tx.characters.update({
            where: { characterId: characterId },
            data: {
              money: updatedMoney,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
      let msg = `Sold ${count} ${item.itemName}(s).`;
      return res.status(200).json({ message: msg, money: updatedMoney });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
