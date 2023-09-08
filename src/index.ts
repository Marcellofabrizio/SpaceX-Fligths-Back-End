const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { logger } = require("../utils/logger");
import appRouter from "routes";
import { swaggerDocument } from "../swagger";

async function startServer() {
    const app = express();
    dotenv.config();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(appRouter);
    app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    const PORT = process.env.PORT || 3000;

    app.get("/", async (_, res) => {
        res.send({ message: "Fullstack Challenge 🏅 - Space X API" });
    });

    await mongoose
        .connect(
            `mongodb+srv://${process.env.MONGODB_USR}:${process.env.MONGODB_PWD}@cluster0.gwwrw.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`
        )
        .then(() => {
            logger.info("Connected to Mongo");
        })
        .catch((err) => {
            logger.error("Failed to connect to Mongo: " + err);
        });

    app.listen(PORT, () => {
        logger.info(`Running on port ${PORT}`);
    });
}

startServer();
