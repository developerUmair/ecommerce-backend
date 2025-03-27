import { Router } from "express";
import { createCategory, getCategory } from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/add", createCategory);
categoryRouter.get("/:id", getCategory);
export default categoryRouter;
