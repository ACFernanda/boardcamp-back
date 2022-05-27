import db from "./../db.js";

export async function getAllCategories(req, res) {
  try {
    const result = await db.query("SELECT * FROM categories");
    res.send(result.rows);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao obter as categorias!");
  }
}

export async function addCategory(req, res) {
  const newCategory = req.body;
  try {
    const checkExisting = await db.query(
      "SELECT * FROM categories where name = $1",
      [newCategory.name]
    );

    if (checkExisting.rows.length !== 0) {
      res.sendStatus(409);
      return;
    }

    await db.query(`INSERT INTO categories (name) VALUES ($1)`, [
      req.body.name,
    ]);
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao registrar a categoria!");
  }
}
