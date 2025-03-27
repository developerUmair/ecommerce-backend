import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/add", addProduct);
productRouter.get("/getAll/", getAllProducts);
productRouter.get("/:id", getProduct);
productRouter.delete("/:id", deleteProduct);
export default productRouter;
