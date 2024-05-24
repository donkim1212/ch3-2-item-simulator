import Joi from "joi";

const isNotNumber = /[^0-9]/;
const itemCodeSchema = Joi.object({
  itemCode: Joi.number().integer().min(1).required(),
}).unknown(true);
const itemNameSchema = Joi.object({
  itemName: Joi.string().trim().min(1).max(30).required(),
}).unknown(true);
const itemStatSchema = Joi.object({
  itemHealth: Joi.number().optional().integer(),
  itemPower: Joi.number().optional().integer(),
}).unknown(true);
const itemEquipSchema = Joi.object({
  equip: Joi.boolean().strict().required(),
}).unknown(true);

const itemValidatorJoi = {
  itemCodeValidation: async function (req, res, next) {
    const target = {
      itemCode: req.body.itemCode || req.params.itemCode,
    };

    const validation = itemCodeSchema.validate(target);

    if (validation.error) {
      console.log("itemCodeValidation: ", validation.error.message);
      let msg = `Invalid item_code: ${target.itemCode}`;
      return res.status(400).json({ errorMessage: msg });
    }

    next();
  },
  itemNameValiation: async function (req, res, next) {
    const validation = itemNameSchema.validate(req.body);

    if (validation.error) {
      console.log("itemNameValidation: ", validation.error.message);
      let msg = `Invalid item_name: ${req.body.itemName}`;
      return res.status(400).json({ errorMessage: msg });
    }

    next();
  },
  itemStatValidation: async function (req, res, next) {
    const validation = itemStatSchema.validate(req.body);

    if (validation.error) {
      console.log("itemStatValidation: ", validation.error.message);
      let msg = `Invalid item stat given.`;
      return res.status(400).json({ errorMessage: msg });
    }

    next();
  },
  itemEquipValidation: async function (req, res, next) {
    const validation = itemEquipSchema.validate(req.body);

    if (validation.error) {
      console.log("itemEquipValidation: ", validation.error.message);
      let msg = "Failed: 'equip' of type 'boolean' must be defined.";
      return res.status(400).json({ errorMessage: msg });
    }

    next();
  },
};

export { itemValidatorJoi };
