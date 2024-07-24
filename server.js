import express from "express";
import bodyParser from "body-parser";
import YAML from "yamljs";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";

import apiRouter from "./routes";

dotenv.config();

const swaggerDocument = YAML.load("./config/swagger.yaml");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", apiRouter);
app.get("/", (req, res) => res.send("Welcome to AUCTION Website!"));

app.all("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Failed to connect to the database:", err);
  });
