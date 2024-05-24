import express from "express";
import { prisma } from "../lib/utils/prisma/index.js";
import { characterValidatorJoi as cv } from "../middlewares/validators/characters-validator.middleware.js";
import { itemValidatorJoi as iv } from "../middlewares/validators/items-validator.middleware.js";
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

      const character = await prisma.characters.findFirst({
        character_id: character_id,
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

      const character = await prisma.characters.findFirst({
        character_id: character_id,
      });

      if (!character) throw new CharacterNotFoundError();

      const item = await prisma.items.findFirst({
        item_code: item_code,
      });

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
