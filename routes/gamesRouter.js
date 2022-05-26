import { Router } from "express";
import { getAllGames, addGame } from "./../controllers/gamesController.js";

const gamesRouter = Router();

gamesRouter.get("/games", getAllGames);

gamesRouter.post("/games", addGame);

export default gamesRouter;
