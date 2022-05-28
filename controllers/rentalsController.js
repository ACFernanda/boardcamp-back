import dayjs from "dayjs";
import joi from "joi";

import db from "./../db.js";

export async function getAllRentals(req, res) {
  try {
    const resultRentals = await db.query(`SELECT * FROM rentals`);
    const rentals = resultRentals.rows;

    let completeRentals = [];
    let completeRental = null;
    let customer = null;
    let game = null;
    for (let rental of rentals) {
      const customerResult = await db.query(
        `SELECT customers.id, customers.name FROM customers WHERE id = $1`,
        [rental.customerId]
      );
      customer = customerResult.rows[0];

      const gameResult = await db.query(
        `SELECT games.id, games.name, games."categoryId", categories.name as "categoryName" 
      FROM games 
      JOIN categories ON games."categoryId" = categories.id
      WHERE games.id = $1;`,
        [rental.gameId]
      );
      game = gameResult.rows[0];

      completeRental = { ...rental, customer, game };
      completeRentals.push(completeRental);
    }

    res.send(completeRentals);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao obter as categorias!");
  }
}

export async function addRental(req, res) {
  const newRental = req.body;
  const today = dayjs().format("YYYY-MM-DD");

  try {
    const checkCostumer = await db.query(
      `SELECT * FROM customers WHERE id = $1`,
      [newRental.customerId]
    );
    const customer = checkCostumer.rows[0];

    if (customer === undefined) {
      res.sendStatus(400);
      return;
    }

    const checkGame = await db.query("SELECT * FROM games WHERE id = $1", [
      newRental.gameId,
    ]);

    const game = checkGame.rows[0];

    if (game === undefined) {
      res.sendStatus(400);
      return;
    }

    const originalPrice = game.pricePerDay * newRental.daysRented;

    const result = await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
       VALUES ($1, $2, $3, $4, null, $5, null)`,
      [
        req.body.customerId,
        req.body.gameId,
        today,
        req.body.daysRented,
        originalPrice,
      ]
    );
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao registrar o aluguel!");
  }
}
