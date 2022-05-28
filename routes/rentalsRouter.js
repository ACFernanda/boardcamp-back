import { Router } from "express";
import {
  getAllRentals,
  addRental,
} from "./../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getAllRentals);

rentalsRouter.post("/rentals", addRental);

// rentalsRouter.post("/rentals/:id/return", endRental);

// rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
