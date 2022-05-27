import { Router } from "express";
import { gameValidator } from "../middlewares/gameValidator.js";
import { getAllGames, addGame } from "./../controllers/gamesController.js";

const gamesRouter = Router();

gamesRouter.get("/games", getAllGames);

gamesRouter.post("/games", gameValidator, addGame);

export default gamesRouter;
