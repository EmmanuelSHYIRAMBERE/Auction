import express from "express";
import bodyParser from "body-parser";
import YAML from "yamljs";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// This is  Stripe CLI webhook secret for testing endpoint locally.
const endpointSecret =
  "whsec_87d4d54043e6830378c08eb5c25ed7fb085d4bb028a6f750997a065b58b457d9";

import apiRouter from "./routes";
import Stripe from "stripe";

dotenv.config();

const swaggerDocument = YAML.load("./config/swagger.yaml");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", apiRouter);
app.get("/", (req, res) => res.send("Welcome to AUCTION Website!"));
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
app.all("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Failed to connect to the database:", err);
  });
