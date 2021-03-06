import db from "./../db.js";

export async function getAllCustomers(req, res) {
  const filter = req.query.cpf;

  try {
    let result;
    if (filter !== undefined) {
      result = await db.query(
        `SELECT * FROM customers WHERE cpf LIKE '${filter}%'`
      );
    } else {
      result = await db.query("SELECT * FROM customers");
    }
    res.send(result.rows);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao obter os clientes!");
  }
}

export async function getCustomer(req, res) {
  const customerId = req.params.id;

  try {
    const result = await db.query(`SELECT * FROM customers WHERE id = $1`, [
      customerId,
    ]);
    const customer = result.rows[0];

    if (customer === undefined) {
      res.sendStatus(404);
      return;
    }

    res.send(customer);
  } catch (e) {
    console.log(e);
    res.status(500).send("Ocorreu um erro ao obter o cliente!");
  }
}

export async function addCustomer(req, res) {
  const newCustomer = req.body;
  try {
    await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
      [
        newCustomer.name,
        newCustomer.phone,
        newCustomer.cpf,
        newCustomer.birthday,
      ]
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
    await db.query(
      `UPDATE customers 
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
