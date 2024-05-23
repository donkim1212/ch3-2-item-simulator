import express from "express";
import prisma from "../lib/utils/prisma/index.js";
import { itemValidatorJoi as iv } from "../middlewares/validators/items-validator.middleware.js";
import ItemNotFoundError from "../lib/errors/item-not-found.error.js";

const router = express.Router();

/**
 * Create: creates item based on the information given by form
 */
router.post(
  "/items",
  iv.itemCodeValidation,
  iv.itemNameValiation,
  iv.itemStatValidation,
  async (req, res, next) => {
    const { item_code, item_name, item_stat } = req.body;
    let msg = `Successfully added the item: ${item_name}`;
    try {
      const item = prisma.items.create({
        item_code: item_code,
        item_name: item_name,
        health: item_stat.health,
        power: item_stat.power,
      });

      return res.status(201).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * Read One
 */
router.get(
  "/items/:item_code",
  iv.itemCodeValidation,
  async (req, res, next) => {
    const item_code = req.params.item_code;
    try {
      const item = await prisma.items.findFirst({
        item_code: item_code,
      });

      if (!item) throw new ItemNotFoundError();

      let msg = `Successfully found item with item_code ${item_code}`;
      return res.status(200).json({
        message: msg,
        item_code: item.item_code,
        item_name: item.item_name,
        item_health: item.health,
        item_power: item.power,
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * Read All
 */
router.get("/items", async (req, res) => {
  try {
    const items = await prisma.characters.findMany({
      select: { item_code, item_name },
      orderBy: [{ item_code: "asc" }],
    });

    if (!items) return res.status(200).json({});
    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * Update
 */
router.put(
  "/items/:item_code",
  iv.itemCodeValidation,
  iv.itemNameValiation,
  iv.itemStatValidation,
  async (req, res) => {
    try {
      const item_code = req.params.item_code;
      const { item_name, item_health, item_power } = req.body;
      let msg = `Successfully updated the item.`;

      const item = await prisma.items.findUnique({
        where: { item_code: item_code },
      });

      if (!item) throw new ItemNotFoundError();

      await prisma.items.update({
        data: {
          item_name: item_name,
          item_health: item_health,
          item_power: item_power,
        },
        where: {
          item_code: item_code,
        },
      });

      return res.status(200).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
