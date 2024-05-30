import Joi from "joi";

const characterIdSchema = Joi.object({
  characterId: Joi.number().integer().min(1).required(),
}).unknown(true);
const characterNameSchema = Joi.object({
  characterName: Joi.string().trim().min(1).max(20).required(),
}).unknown(true);

const characterValidatorJoi = {
  characterIdValidation: async function (req, res, next) {
    const validation = characterIdSchema.validate(req.params);

    if (validation.error) {
      return res
        .status(400)
        .json({ message: `Invalid characterId: ${req.params.characterId}` });
    }

    req.params.characterId = parseInt(req.params.characterId);
    next();
  },

  characterNameValidation: async function (req, res, next) {
    const validation = characterNameSchema.validate(req.body);

    if (validation.error) {
      return res
        .status(400)
        .json({ message: `Invalid name: ${req.body.characterName}` });
    }

    next();
  },
};

export default characterValidatorJoi;
