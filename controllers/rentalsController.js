import dayjs from "dayjs";
import joi from "joi";

import db from "./../db.js";

export async function getAllRentals(req, res) {
  const filterCustomerId = req.query.customerId;
  const filterGameId = req.query.gameId;

  try {
    let resultRentals;
    if (filterCustomerId === undefined && filterGameId === undefined) {
      resultRentals = await db.query(`SELECT * FROM rentals`);
    }
    if (filterCustomerId !== undefined) {
      resultRentals = await db.query(
        `SELECT * FROM rentals WHERE rentals."customerId" = ${filterCustomerId}`
      );
    }
    if (filterGameId !== undefined) {
      resultRentals = await db.query(
        `SELECT * FROM rentals WHERE rentals."gameId" = ${filterGameId}`
      );
    }

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

    const openRentals = await db.query(
      'SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL',
      [newRental.gameId]
    );
    if (openRentals.rows.length >= game.stockTotal) {
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

export async function endRental(req, res) {
  const rentalId = req.params.id;

  try {
    const resultRental = await db.query(`SELECT * FROM rentals WHERE id = $1`, [
      rentalId,
    ]);
    const rental = resultRental.rows[0];

    if (rental === undefined) {
      res.sendStatus(404);
      return;
    }

    const { rentDate, daysRented, returnDate, originalPrice } = rental;

    if (returnDate !== null) {
      res.sendStatus(400);
      return;
    }

    const today = dayjs().format("YYYY-MM-DD");
    const lateDays = dayjs(today).diff(rentDate, "day") - daysRented;
    const delayFee =
      lateDays > 0 ? lateDays * (originalPrice / daysRented) : null;

    await db.query(
      `
      UPDATE rentals SET ("returnDate", "delayFee") = ($1, $2) WHERE id = $3`,
      [today, delayFee, rentalId]
    );
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao registrar a devolu????o!");
  }
}

export async function deleteRental(req, res) {
  const rentalId = req.params.id;

  try {
    const resultRental = await db.query(`SELECT * FROM rentals WHERE id = $1`, [
      rentalId,
    ]);
    const rental = resultRental.rows[0];

    if (rental === undefined) {
      res.sendStatus(404);
      return;
    }

    if (rental.returnDate !== null) {
      res.sendStatus(400);
      return;
    }

    await db.query(`DELETE FROM rentals WHERE id = $1`, [rentalId]);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao deletar o aluguel!");
  }
}
