import { Router } from "express";
import { addRentalValidator } from "../middlewares/addRentalValidator.js";
import {
  getAllRentals,
  addRental,
  endRental,
} from "./../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getAllRentals);

rentalsRouter.post("/rentals", addRentalValidator, addRental);

rentalsRouter.post("/rentals/:id/return", endRental);

// rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
