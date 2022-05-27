import joi from "joi";
import db from "./../db.js";

export async function gameValidator(req, res, next) {
  const newGame = req.body;

  const gameSchema = joi.object({
    name: joi.string().trim().required(),
    image: joi.required(),
    stockTotal: joi.number().positive().greater(0).required(),
    categoryId: joi.required(),
    pricePerDay: joi.number().positive().greater(0).required(),
  });

  const validation = gameSchema.validate(newGame);
  if (validation.error) {
    res.status(400).send(validation.error.details);
    return;
  }

  const checkExisting = await db.query("SELECT * FROM games where name = $1", [
    newGame.name,
  ]);

  if (checkExisting.rows.length !== 0) {
    res.sendStatus(409);
    return;
  }

  const checkIdExisting = await db.query(
    "SELECT * FROM categories WHERE id = $1",
    [newGame.categoryId]
  );

  console.log(checkIdExisting.rows);

  if (checkIdExisting.rows.length === 0) {
    res.status(400).send("problema na id");
    return;
  }

  next();
}
