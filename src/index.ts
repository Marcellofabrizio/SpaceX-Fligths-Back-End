const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
const { logger } = require("../utils/logger");
const mongoose = require("mongoose");

async function startServer() {
    const app = express();
    dotenv.config();
    app.use(cors());
    app.use(bodyParser.json());

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
