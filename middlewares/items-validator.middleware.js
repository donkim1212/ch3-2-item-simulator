import Joi from "joi";

const isNotNumber = /[^0-9]/;
const itemCodeSchema = Joi.object({
  item_code: Joi.number().integer().min(1).required(),
}).unknown(true);
const itemNameSchema = Joi.object({
  item_name: Joi.string().trim().min(1).max(30).required(),
}).unknown(true);
const itemStatSchema = Joi.object({
  item_stat: {
    health: Joi.number().optional().integer(),
    power: Joi.number().optional().integer(),
  },
}).unknown(true);
const itemEquipSchema = Joi.object({
  equip: Joi.boolean().strict().required(),
}).unknown(true);

const itemValidatorJoi = {
  itemCodeValidation: async function (req, res, next) {
    const target = {
      item_code: req.body.item_code || req.params.item_code,
    };

    const validation = itemCodeSchema.validate(target);

    if (validation.error) {
      console.log("itemCodeValidation: ", validation.error.message);
      let msg = `Invalid item_code: ${target.item_code}`;
      return res.status(400).json({ errorMessage: msg });
    }

    next();
  },
  itemNameValiation: async function (req, res, next) {
    const validation = itemNameSchema.validate(req.body);

    if (validation.error) {
      console.log("itemNameValidation: ", validation.error.message);
      let msg = `Invalid item_name: ${req.body.item_name}`;
      return res.status(400).json({ errorMessage: msg });
    }

    next();
  },
  itemStatValidation: async function (req, res, next) {
    const validation = itemStatSchema.validate(req.body);

    if (validation.error) {
      console.log("itemStatValidation: ", validation.error.message);
      let msg = `Invalid item_stat: ${req.body.item_stat}`;
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

const itemValidator = {
  itemCodeValidation: (req, res, next) => {
    const item_code = req.body.item_code || req.params.item_code;
    if (isNotNumber.test(item_code))
      return res
        .status(400)
        .json({ errorMessage: `Invalid item_code: ${item_code}` });
    next();
  },
  itemNameValiation: (req, res, next) => {
    const { item_name } = req.body;
    if (!item_name)
      return res
        .status(400)
        .json({ errorMessage: `Invalid item_name: ${item_name}` });
    next();
  },
  itemStatValidation: (req, res, next) => {
    const { item_stat } = req.body || { item_stat: {} };

    if (item_stat.health && isNotNumber.test(item_stat.health)) {
      return res
        .status(400)
        .json({ errorMessage: `Invalid health: ${item_stat.health}` });
    }
    if (item_stat.power && isNotNumber.test(item_stat.power)) {
      return res
        .status(400)
        .json({ errorMessage: `Invalid power: ${item_stat.power}` });
    }

    next();
  },
  itemEquipValidation: (req, res, next) => {
    const { equip } = req.body;
    if (equip === true || equip === false) next();
    let msg = "Failed: 'equip' of type 'boolean' must be defined in req.body.";
    return res.status(400).json({ errorMessage: msg });
  },
};

export { itemValidator, itemValidatorJoi };
