import express from "express";
import { PORT } from "./src/config/env.js";
import connectToDatabase from "./src/database/mongodb.js";
import errorMiddleware from "./src/middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.routes.js";
import productRouter from "./src/routes/product.routes.js";
import authorize, { adminProtect } from "./src/middleware/auth.middleware.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', authorize, adminProtect, productRouter)

// middlewares
app.use(errorMiddleware)


app.listen(PORT, async () => {
  console.log(
    `Ecommerce API is running on http://localhost:${PORT}`
  );

  await connectToDatabase();
});


