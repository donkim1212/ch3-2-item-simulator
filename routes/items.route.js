import express from "express";
import Item from "../schemas/items.schema.js";
import { itemValidatorJoi as iv } from "../middlewares/items-validator.middleware.js";
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
      const item = new Item({
        item_code: item_code,
        item_name: item_name,
        health: item_stat.health,
        power: item_stat.power,
      });
      await item.save();
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
      const item = await Item.findOne({ item_code: item_code }).exec();

      if (!item) throw new ItemNotFoundError();

      let msg = `Successfully found item with item_code ${item_code}`;
      return res.status(200).json({
        message: msg,
        item_code: item.item_code,
        item_name: item.item_name,
        item_stat: {
          health: item.health,
          power: item.power,
        },
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
    const items = await Item.find()
      .select("item_code item_name -_id")
      .sort({ item_code: 1 })
      .exec();
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
    const item_code = req.params.item_code;
    const { item_name, item_stat } = req.body;
    let msg = `Successfully updated the item with code: ${item_code}`;
    try {
      const item = await Item.findOneAndUpdate(
        { item_code: item_code },
        { item_name: item_name, ...item_stat },
        { new: true },
      );

      if (!item) throw new ItemNotFoundError();

      return res.status(200).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
