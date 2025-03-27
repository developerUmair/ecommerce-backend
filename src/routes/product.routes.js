import { Router } from "express";
import {
  addProduct,
  getAllProducts,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/add", addProduct);
productRouter.get("/getAll", getAllProducts);
export default productRouter;
