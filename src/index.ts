const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { logger } = require("../utils/logger");
const { app } = require("app.ts");

const PORT = process.env.PORT || 3000;

dotenv.config();

(async () => {
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
})();
