import { Router } from "express";
import {
  getAllCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
} from "./../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get("/customers", getAllCustomers);

customersRouter.get("/customers/:id", getCustomer);

customersRouter.post("/customers", addCustomer);

customersRouter.put("/customers/:id", updateCustomer);

export default customersRouter;
