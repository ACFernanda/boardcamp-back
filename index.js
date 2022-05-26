import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";

import router from "./routes/index.js";

const app = express();
app.use(json());
app.use(cors());

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(chalk.bold.green(`Listening on ${process.env.PORT}`));
});
