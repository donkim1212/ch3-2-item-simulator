import { prisma } from "../utils/prisma/index.js";
import CharacterNotFoundError from "../lib/errors/classes/character-not-found.error.js";
import ItemNotFoundError from "../lib/errors/classes/item-not-found.error.js";
import InvalidEquipOperationError from "../lib/errors/classes/invalid-equip-operation.error.js";

const errorThrower = {
  characterChecker: async function (characterId) {
    const character = await prisma.characters.findFirst({
      where: { characterId: characterId },
    });

    if (!character) throw new CharacterNotFoundError();
  },
  itemChecker: async function (itemCode) {
    const item = await prisma.items.findFirst({
      itemCode: itemCode,
    });

    if (!item) throw new ItemNotFoundError();
  },
  equipChecker: async function (characterId, itemCode, equip) {
    const equipment = await prisma.equipments.findFirst({
      where: { characterId: characterId, itemCode: itemCode },
    });
    const inventory = await prisma.equipments.findFirst({
      where: { characterId: characterId, itemCode: itemCode },
    });
    if (equip) {
      if (equipment || !inventory) throw new InvalidEquipOperationError();
    } else {
      if (!equipment || inventory) throw new InvalidEquipOperationError();
    }
  },
};

export default errorThrower;
