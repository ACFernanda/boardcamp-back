import db from "./../db.js";

export async function getAllGames(req, res) {
  const filter = req.query.name;

  try {
    let result;
    if (filter !== undefined) {
      result = await db.query(
        `SELECT games.*, categories.name as "categoryName" 
           FROM games 
           JOIN categories 
           ON games."categoryId" = categories.id 
           WHERE lower(games.name) LIKE '${filter.toLowerCase()}%'`
      );
    } else {
      result = await db.query(
        `SELECT games.*, categories.name as "categoryName" 
           FROM games 
           JOIN categories ON games."categoryId" = categories.id`
      );
    }
    res.send(result.rows);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao obter os jogos!");
  }
}

export async function addGame(req, res) {
  const newGame = req.body;

  try {
    await db.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
       VALUES ($1, $2, $3, $4, $5)`,
      [
        newGame.name,
        newGame.image,
        newGame.stockTotal,
        newGame.categoryId,
        newGame.pricePerDay,
      ]
    );
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao registrar o jogo!");
  }
}
