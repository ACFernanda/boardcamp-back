import { Router } from "express";
import {
  getAllCategories,
  addCategorie,
} from "./../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getAllCategories);

categoriesRouter.post("/categories", addCategorie);

export default categoriesRouter;
