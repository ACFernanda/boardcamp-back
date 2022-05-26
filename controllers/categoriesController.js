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

export async function addCategorie(req, res) {
  const newCategorie = req.body;
  try {
    const result = await db.query(
      `
      INSERT INTO categories (name)
      VALUES ($1);
    `,
      [req.body.name]
    );

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao registrar a receita!");
  }
}
