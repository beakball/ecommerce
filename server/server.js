import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";

// routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// connecting to database
connectDB();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port - ${PORT}`.bgCyan.black);
});
