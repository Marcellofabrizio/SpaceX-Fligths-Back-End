import axios from "axios";
const { FlightModel } = require("./src/models/flight");
const { Rocket } = require("./src/models/rocket");
const { logger } = require("./utils/logger");
import mongoose from "mongoose";
import { exit } from "process";
const dotenv = require("dotenv");

dotenv.config();
const connectionString = `mongodb+srv://${process.env.MONGODB_USR}:${process.env.MONGODB_PWD}@cluster0.gwwrw.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

async function seedRockets() {
    const conn = await mongoose
        .connect(connectionString)
        .then(() => {
            logger.info(`Connected to Mongo: ${connectionString}`);
        })
        .catch((err) => {
            logger.error("Failed to connect to Mongo: " + err);
            return;
        });

    const rocketsCount = await getRocketsCount();

    if (rocketsCount > 0) {
        logger.warn("Rockets already registered");
        mongoose.connection.close();
        return;
    }

    try {
        const response = await axios.get(
            "https://api.spacexdata.com/v4/rockets"
        );
        await Rocket.bulkSave(parseRocketsResponse(response.data)).then(() => {
            logger.info("Saved rockets successfully");
        });
    } catch (err) {
        logger.error(err);
    }

    mongoose.connection.close();
}

async function getRocketsCount(): Promise<number> {
    return Rocket.count({}).then((count) => {
        return count;
    });
}

function parseRocketsResponse(rocketsResponse) {
    return rocketsResponse.map((rocketData) => {
        const rocket = new Rocket();
        rocket.spacexId = new mongoose.mongo.ObjectId(rocketData.id);
        rocket.name = rocketData.name;
        return rocket;
    });
}

seedRockets();
exit;
