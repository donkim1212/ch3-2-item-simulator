import Joi from "joi";

const signUpSchema = Joi.object({
  username: Joi.string().alphanum().lowercase().min(4).max(12).required(),
  password: Joi.string().min(8).max(16).required(),
  passwordConfirmation: Joi.string().valid(Joi.ref("password")).required(),
});

const signInSchema = Joi.object({
  username: Joi.string().alphanum().lowercase().min(4).max(12).required(),
  password: Joi.string().min(8).max(16).required(),
});

const userValidatorJoi = {
  signUpValidation: async (req, res, next) => {
    const validation = signUpSchema.validate(req.body);

    if (validation.error) {
      console.log(req.originalUrl, "sign-up validation failed.");
      let msg = "Invalid input given.";
      return res.status(400).json({ message: msg });
    }

    next();
  },
  signInValidation: async (req, res, next) => {
    const validation = signInSchema.validate(req.body);

    if (validation.error) {
      console.log(req.originalUrl, "sign-in validation failed.");
      let msg = "Invalid sign-in attempt.";
      return res.status(400).json({ message: msg });
    }

    next();
  },
};

export default userValidatorJoi;
