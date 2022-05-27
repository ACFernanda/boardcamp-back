import { Router } from "express";
import { customerValidator } from "../middlewares/customerValidator.js";
import {
  getAllCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
} from "./../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get("/customers", getAllCustomers);

customersRouter.get("/customers/:id", getCustomer);

customersRouter.post("/customers", customerValidator, addCustomer);

customersRouter.put("/customers/:id", customerValidator, updateCustomer);

export default customersRouter;
