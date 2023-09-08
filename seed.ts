import axios from "axios";
const { Flight } = require("./src/models/flight");
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

async function seedFlights() {
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
        await Flight.bulkSave(parseFlightsResponse(response.data)).then(() => {
            logger.info("Saved flights successfully");
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

function parseFlightsResponse(flightsResponse) {
    return flightsResponse.map((flightData) => {
        const flight = new Flight();
        flight._id = new mongoose.mongo.ObjectId(flightData.id);
        flight.flightNumber = flightData.flight_number;
        flight.name = flightData.name;
        flight.dateUtc = flightData.date_utc;
        flight.result = flightData.result;
        flight.logo = flightData.links.patch.small;
        flight.webcast = flightData.links.webcast;
        flight.article = flightData.links.article;
        flight.reused = flightData.cores.some((core) => core.reused === true);
        flight.createdAt = new Date().toDateString();
        flight.rocket = new mongoose.mongo.ObjectId(flightData.rocket);
        return flight;
    });
}

seedRockets();
seedFlights();
exit;
