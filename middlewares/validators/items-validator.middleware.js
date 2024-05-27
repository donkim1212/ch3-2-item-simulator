import Joi from "joi";

const isNotNumber = /[^0-9]/;
const itemCodeSchema = Joi.object({
  itemCode: Joi.number().integer().min(1).required(),
}).unknown(true);
const itemNameSchema = Joi.object({
  itemName: Joi.string().trim().min(1).max(30).required(),
}).unknown(true);
const itemStatSchema = Joi.object({
  itemStat: {
    health: Joi.number().integer().optional(),
    power: Joi.number().integer().optional(),
  },
}).unknown(true);
const itemCountSchema = Joi.object({
  count: Joi.number().integer().required(),
});
const itemEquipSchema = Joi.object({
  equip: Joi.boolean().strict().required(),
}).unknown(true);

const itemValidationErrorHandler = function (res, err, keyName) {
  console.log(`Item ${keyName} validation failed: `, err.message);
  let msg = `Item ${keyName} validation failed.`;
  return res.status(400).json({ message: msg });
};

const itemValidatorJoi = {
  itemCodeParamsValidation: async function (req, res, next) {
    const validation = itemCodeSchema.validate(req.params);

    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, "code");
    }

    req.params.itemCode = parseInt(req.params.itemCode);
    next();
  },
  itemCodeBodyValidation: async function (req, res, next) {
    const validation = itemCodeSchema.validate(req.body);

    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, "code");
    }

    next();
  },
  itemNameValiation: async function (req, res, next) {
    const validation = itemNameSchema.validate(req.body);

    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, "name");
    }

    next();
  },
  itemStatValidation: async function (req, res, next) {
    const validation = itemStatSchema.validate(req.body);

    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, "stat");
    }

    const { itemStat } = req.body;
    if (!itemStat) {
      itemStat = { health: 0, power: 0 };
    }
    if (!itemStat.health) itemStat.health = 0;
    if (!itemStat.power) itemStat.power = 0;
    req.body.itemStat = itemStat;

    next();
  },
  itemCountValidation: async function (req, res, next) {
    const validation = itemCountSchema.validate(req.body);
    if (validation.error) {
      console.log("itemCountValidation: ", validation.error.message);
      let msg = "Failed: item count is not valid.";
      return res.status(400).json({ message: msg });
    }

    next();
  },
  itemEquipValidation: async function (req, res, next) {
    const validation = itemEquipSchema.validate(req.body);

    if (validation.error) {
      console.log("itemEquipValidation: ", validation.error.message);
      let msg = "Failed: 'equip' of type 'boolean' must be defined.";
      return res.status(400).json({ message: msg });
    }

    next();
  },
};

export default itemValidatorJoi;
