import express from "express";
import Character from "../schemas/characters.schema.js";
import Item from "../schemas/items.schema.js";
import { characterValidatorJoi as cv } from "../middlewares/characters-validator.middleware.js";
import { itemValidatorJoi as iv } from "../middlewares/items-validator.middleware.js";
import CharacterNotFoundError from "../lib/errors/character-not-found.error.js";
import ItemNotFoundError from "../lib/errors/item-not-found.error.js";
import InvalidEquipOperationError from "../lib/errors/invalid-equip-operation.error.js";

const router = express.Router();

/**
 * Read One
 */
router.get(
  "/equipments/:character_id",
  cv.characterIdValidation,
  async (req, res, next) => {
    try {
      const character_id = req.params.character_id;
      let msg = `Retrieving eqipment data for character_id: ${character_id}`;

      const character = await Character.findOne({
        character_id: character_id,
      }).populate({
        path: "equipped",
        select: { item_code: 1, item_name: 1, _id: 0 },
      });

      if (!character) throw new CharacterNotFoundError();

      return res.status(200).json({
        message: msg,
        data: character.equipped,
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * Update
 */
router.put(
  "/equipments/:character_id",
  cv.characterIdValidation,
  iv.itemCodeValidation,
  async (req, res, next) => {
    try {
      const character_id = req.params.character_id;
      const { item_code, equip } = req.body;

      const character = await Character.findOne({
        character_id: character_id,
      }).exec();

      if (!character) throw new CharacterNotFoundError();

      const item = await Item.findOne({ item_code: item_code });

      if (!item) throw new ItemNotFoundError();

      if (character.equipped.includes(item._id)) {
        if (equip) throw new InvalidEquipOperationError();
        const idx = character.equipped.indexOf(item._id);
        character.equipped.splice(idx, 1);
      } else {
        if (!equip) throw new InvalidEquipOperationError();
        character.equipped.push(item._id);
      }

      character.health += equip ? item.health : -item.health;
      character.power += equip ? item.power : -item.power;

      await character.save();

      let msg = `${equip ? "E" : "Une"}quipped the item '${item.item_name}'.`;
      return res.status(200).json({ message: msg });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
