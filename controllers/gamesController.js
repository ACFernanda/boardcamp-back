import db from "./../db.js";

export async function getAllGames(req, res) {
  try {
    const result = await db.query("SELECT * FROM games");

    // INCLUIR "CATEGORYNAME" ANTES DE ENVIAR O RESULTADO

    res.send(result.rows);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao obter os jogos!");
  }
}

export async function addGame(req, res) {
  const newGame = req.body;
  try {
    const result = await db.query(
      `
      INSERT INTO games (name, image, stockTotal, categoryId, pricePerDay)
      VALUES ($1, $2, $3, $4, $5);
    `,
      [
        req.body.name,
        req.body.image,
        req.body.stockTotal,
        req.body.categoryId,
        req.body.pricePerDay,
      ]
    );
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao registrar o jogo!");
  }
}