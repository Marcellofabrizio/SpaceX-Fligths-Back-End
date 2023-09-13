import axios from "axios";
const { Launch } = require("./src/models/launch");
const { Rocket } = require("./src/models/rocket");
const { logger } = require("./utils/logger");
import mongoose from "mongoose";
import { exit } from "process";
const dotenv = require("dotenv");

dotenv.config();
const connectionString = `mongodb+srv://${process.env.MONGODB_USR}:${process.env.MONGODB_PWD}@cluster0.gwwrw.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

async function seedRockets() {
    await mongoose
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

async function seedLaunchs() {
    await mongoose
        .connect(connectionString)
        .then(() => {
            logger.info(`Connected to Mongo: ${connectionString}`);
        })
        .catch((err) => {
            logger.error("Failed to connect to Mongo: " + err);
            return;
        });

    try {
        const response = await axios.get(
            "https://api.spacexdata.com/v5/launches"
        );
        await Launch.bulkSave(parseLaunchsResponse(response.data)).then(() => {
            logger.info("Saved launchs successfully");
        });
    } catch (err) {
        logger.error(err);
    }

    mongoose.connection.close();
}

function parseRocketsResponse(rocketsResponse) {
    return rocketsResponse.map((rocketData) => {
        const rocket = new Rocket();
        rocket._id = new mongoose.mongo.ObjectId(rocketData.id);
        rocket.name = rocketData.name;
        return rocket;
    });
}

function parseLaunchsResponse(launchsResponse) {
    return launchsResponse.map((launchData) => {
        const launch = new Launch();
        launch._id = new mongoose.mongo.ObjectId(launchData.id);
        launch.flightNumber = launchData.flight_number;
        launch.name = launchData.name;
        launch.dateUtc = launchData.date_utc;
        launch.success = launchData.success;
        launch.logo = launchData.links.patch.small;
        launch.webcast = launchData.links.webcast;
        launch.article = launchData.links.article;
        launch.reused = launchData.cores.some((core) => core.reused === true);
        launch.createdAt = new Date().toDateString();
        launch.rocket = new mongoose.mongo.ObjectId(launchData.rocket);
        return launch;
    });
}

seedRockets();
seedLaunchs();
exit;
