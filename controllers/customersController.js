import db from "./../db.js";

export async function getAllCustomers(req, res) {
  const filter = req.query.cpf;

  if (filter !== undefined) {
    try {
      const result = await db.query(
        `SELECT * FROM customers WHERE cpf LIKE '${filter}%'`
      );
      res.send(result.rows);
    } catch (e) {
      console.log(e);
      res.status(500).send("Ocorreu um erro ao obter os clientes!");
    }
  } else {
    try {
      const result = await db.query("SELECT * FROM customers");
      res.send(result.rows);
    } catch (e) {
      console.log(e);
      res.status(500).send("Ocorreu um erro ao obter os clientes!");
    }
  }
}

export async function getCustomer(req, res) {
  const { customerId } = req.params;
  try {
    const result = await db.query(`SELECT * FROM customers WHERE id = $1`, [
      customerId,
    ]);
    const customer = result.rows[0];
    res.send(customer);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao obter o cliente!");
  }
}

export async function addCustomer(req, res) {
  const newCustomer = req.body;
  try {
    const result = await db.query(
      `
      INSERT INTO customers (name, phone, cpf, birthday)
      VALUES ($1, $2, $3, $4);
    `,
      [req.body.name, req.body.phone, req.body.cpf, req.body.birthday]
    );

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao registrar o cliente!");
  }
}

export async function updateCustomer(req, res) {
  const { customerId } = req.params;
  try {
    const result = await db.query(
      `
      UPDATE customers 
      SET 
        name = $1,
        phone = $2,
        cpf = $3,
        birthday = $4
      WHERE id=$5`,
      [
        req.body.name,
        req.body.phone,
        req.body.cpf,
        req.body.birthday,
        customerId,
      ]
    );
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao atualizar o cliente!");
  }
}
