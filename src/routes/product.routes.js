import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/add", addProduct);
productRouter.get("/getAll", getAllProducts);
productRouter.get("/:id", getProduct);
productRouter.patch("/:id", updateProduct);
productRouter.get("/category/:categoryId", getProducts);
productRouter.delete("/:id", deleteProduct);
export default productRouter;
