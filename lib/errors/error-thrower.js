import { prisma } from "../utils/prisma/index.js";
import CharacterNotFoundError from "./classes/character-not-found.error.js";
import ItemNotFoundError from "./classes/item-not-found.error.js";
import InvalidEquipOperationError from "./classes/invalid-equip-operation.error.js";
import NotEnoughMoneyError from "./classes/not-enough-money.error.js";

const queryBuilder = (where, select) => {
  const query = {
    where: { ...where },
  };

  if (select && Object.keys(select).length !== 0) {
    query.select = { ...select };
  }

  return query;
};

const errorThrower = {
  characterChecker: async function (where, select) {
    const query = queryBuilder(where, select);
    const character = await prisma.characters.findFirstOrThrow(query);

    // if (!character) throw new CharacterNotFoundError();
    return character;
  },
  itemChecker: async function (where, select) {
    const query = queryBuilder(where, select);
    const item = await prisma.items.findFirst(query);

    if (!item) throw new ItemNotFoundError();
    return item;
  },
  equipChecker: async function (equip, where, select) {
    const query = queryBuilder(where, select);

    const equipment = await prisma.equipments.findFirst(query);

    if (!equip) {
      if (!equipment)
        throw new InvalidEquipOperationError(
          "You don't have the item equipped!",
        );
    } else {
      if (equipment)
        throw new InvalidEquipOperationError("Already equipped that item!");
    }

    const inventory = await prisma.inventories.findFirst({
      select: { inventoryId: true, count: true },
      where: {
        characterId: where.characterId,
        itemCode: where.itemCode,
      },
    });

    if (!inventory || inventory.count == 0)
      throw new InvalidEquipOperationError("Item not in your inventory!");

    return { equipment: equipment, inventory: inventory };
  },
  itemBuyChecker: async function (where, select) {
    const query = queryBuilder(where, select);
    const inventory = await prisma.inventories.findFirst(query);
    return inventory;
  },
  itemSellChecker: async function (count, where, select) {
    const query = queryBuilder(where, select);

    const inventory = await prisma.inventories.findFirst(query);
    if (!inventory) throw new ItemNotFoundError();
    if (count && inventory.count < count)
      throw new ItemNotFoundError("Not enough items.");

    return inventory;
  },
};

export default errorThrower;
