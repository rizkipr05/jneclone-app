import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import shipmentRoutes from "./routes/shipments.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ status: "OK", service: "jneclone-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
