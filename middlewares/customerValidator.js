import JoiBase from "@hapi/joi";
import JoiDate from "@hapi/joi-date";
import db from "./../db.js";

export async function customerValidator(req, res, next) {
  const customer = req.body;

  const Joi = JoiBase.extend(JoiDate);

  const customerSchema = Joi.object({
    name: Joi.string().trim().required(),
    phone: Joi.string()
      .trim()
      .pattern(/^\d{10,11}$/)
      .required(),
    cpf: Joi.string()
      .trim()
      .pattern(/^\d{11}$/)
      .required(),
    birthday: Joi.date().format("YYYY-MM-DD").required(),
  });

  const validation = customerSchema.validate(customer);
  if (validation.error) {
    res.status(400).send(validation.error.details);
    return;
  }

  const checkExistingCPF = await db.query(
    "SELECT * FROM customers where cpf = $1",
    [customer.cpf]
  );

  if (checkExistingCPF.rows.length !== 0) {
    res.sendStatus(409);
    return;
  }

  next();
}
