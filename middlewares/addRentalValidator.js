import joi from "joi";

export function addRentalValidator(req, res, next) {
  const request = req.body;

  const addRentalSchema = joi.object({
    customerId: joi.required(),
    gameId: joi.number().positive().required(),
    daysRented: joi.number().positive().greater(0).required(),
  });

  const validation = addRentalSchema.validate(request);
  if (validation.error) {
    res.status(400).send(validation.error.details);
    return;
  }

  next();
}
