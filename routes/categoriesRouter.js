import { Router } from "express";
import {
  getAllCategories,
  addCategory,
} from "./../controllers/categoriesController.js";
import { nameValidator } from "../middlewares/categoryValidator.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getAllCategories);

categoriesRouter.post("/categories", nameValidator, addCategory);

export default categoriesRouter;
