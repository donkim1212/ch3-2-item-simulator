import express from "express";
import { prisma } from "../lib/utils/prisma/index.js";
import { itemValidatorJoi as iv } from "../middlewares/validators/items-validator.middleware.js";
import ItemNotFoundError from "../lib/errors/item-not-found.error.js";

const router = express.Router();

/**
 * Create: creates item based on the information given by form
 */
router.post(
  "/items",
  iv.itemCodeBodyValidation,
  iv.itemNameValiation,
  iv.itemStatValidation,
  async (req, res, next) => {
    try {
      const { itemCode, itemName, itemStat, itemPrice } = req.body;
      let msg = `Successfully added the item: ${itemName}`;

      const item = await prisma.items.create({
        data: { itemCode, itemName, itemStat, itemPrice },
      });

      if (item) console.log(item);

      return res.status(201).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * Read One:
 */
router.get(
  "/items/:itemCode",
  iv.itemCodeParamsValidation,
  async (req, res, next) => {
    const itemCode = req.params.itemCode;
    try {
      const item = await prisma.items.findFirst({
        select: {
          itemCode: true,
          itemName: true,
          itemStat: true,
          itemPrice: true,
        },
        where: { itemCode: itemCode },
      });

      if (!item) throw new ItemNotFoundError();

      return res.status(200).json({
        itemCode: item.itemCode,
        itemName: item.itemName,
        itemStat: item.itemStat,
        itemPrice: item.itemPrice,
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * Read All
 */
router.get("/items", async (req, res, next) => {
  try {
    const items = await prisma.items.findMany({
      select: {
        itemCode: true,
        itemName: true,
        itemPrice: true,
      },
      orderBy: [{ itemCode: "asc" }],
    });

    // if (!items) return res.status(200).json([]);
    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * Update
 */
router.put(
  "/items/:itemCode",
  iv.itemCodeParamsValidation,
  iv.itemNameValiation,
  iv.itemStatValidation,
  async (req, res, next) => {
    try {
      const itemCode = req.params.itemCode;
      const { itemName, itemStat } = req.body;
      let msg = `Successfully updated the item.`;

      await prisma.items.update({
        where: {
          itemCode: itemCode,
        },
        data: {
          itemName: itemName,
          itemStat: itemStat,
        },
      });

      return res.status(200).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
