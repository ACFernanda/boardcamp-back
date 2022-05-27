import db from "./../db.js";

export async function getAllRentals(req, res) {
  try {
    const result = await db.query(`SELECT * FROM rentals`);

    // ADICIONAR CUSTOMER E GAME - JOIN ENCADEADO

    res.send(result.rows);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao obter as categorias!");
  }
}

export async function addRental(req, res) {
  const newRental = req.body;
  try {
    const result = await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "daysRented")
       VALUES ($1, $2, $3)`,
      [req.body.customerId, req.body.gameId, req.body.daysRented]
    );
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao registrar o aluguel!");
  }
}
