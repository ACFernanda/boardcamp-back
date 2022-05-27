import joi from "joi";

export function nameValidator(req, res, next) {
  const request = req.body;

  const categorySchema = joi.object({
    name: joi.string().trim().required(),
  });

  const validation = categorySchema.validate(request);
  if (validation.error) {
    res.status(400).send(validation.error.details);
    return;
  }

  next();
}
