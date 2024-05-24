import Joi from "joi";

const characterIdSchema = Joi.object({
  character_id: Joi.number().integer().min(1).required(),
}).unknown(true);
const characterNameSchema = Joi.object({
  name: Joi.string().trim().min(1).max(20).required(),
}).unknown(true);

const characterValidatorJoi = {
  characterIdValidation: async function (req, res, next) {
    const validation = characterIdSchema.validate(req.params);

    if (validation.error) {
      console.log("characterIdValidation: ", validation.error.message);
      let msg = `Invalid character_id: ${req.params.character_id}`;
      return res.status(400).json({ errorMessage: msg });
    }

    next();
  },

  characterNameValidation: async function (req, res, next) {
    const validation = characterNameSchema.validate(req.body);

    if (validation.error) {
      console.log("characterNameValidation: ", validation.error.message);
      let msg = `Invalid name: ${req.body.name}`;
      return res.status(400).json({ errorMessage: msg });
    }

    next();
  },
};

const characterValidator = {
  characterIdValidation: (req, res, next) => {
    const cid = req.params.character_id;
    // cid === undefined || cid === null || typeof cid != "number"
    if (!cid) {
      return res.status(400).json({
        errorMessage: `Invalid character_id: ${cid}`,
      });
    }
    next();
  },

  characterNameValidation: (req, res, next) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        errorMessage: `Invalid name: ${name}`,
      });
    }
    next();
  },
};

export { characterValidator, characterValidatorJoi };
