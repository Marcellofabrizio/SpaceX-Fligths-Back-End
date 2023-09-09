import "mocha";
import { expect } from "chai";
import { agent as request } from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

const { Flight } = require("../../models/flight");
const { Rocket } = require("../../models/rocket");
const dotenv = require("dotenv");

dotenv.config("../../../.env");

describe("Launch", () => {
    before(async () => {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGODB_USR}:${process.env.MONGODB_PWD}@cluster0.gwwrw.mongodb.net/${process.env.MONGODB_DATABASE_TEST}?retryWrites=true&w=majority`
        );

        const rocket = new Rocket();
        rocket._id = new mongoose.mongo.ObjectId();
        rocket.name = "Test";
        await rocket.save();

        const flight1 = new Flight();
        flight1._id = new mongoose.mongo.ObjectId();
        flight1.flightNumber = 1;
        flight1.name = "Test Flight 1";
        flight1.dateUtc = "2023-03-29T00:00:00.000Z";
        flight1.logo = "Test";
        flight1.webcast = "Test";
        flight1.article = "Test";
        flight1.reused = true;
        flight1.createdAt = new Date().toDateString();
        flight1.rocket = rocket._id;
        await flight1.save();

        const flight2 = new Flight();
        flight2._id = new mongoose.mongo.ObjectId();
        flight2.flightNumber = 2;
        flight2.name = "Test Flight 2";
        flight2.dateUtc = "2023-03-30T00:00:00.000Z";
        flight2.logo = "Test";
        flight2.webcast = "Test";
        flight2.article = "Test";
        flight2.reused = true;
        flight2.createdAt = new Date().toDateString();
        flight2.rocket = rocket._id;
        await flight2.save();
    });

    after(async () => {
        await Rocket.deleteMany({});
        await Flight.deleteMany({});
        await mongoose.connection.close();
    });

    describe("GET /launches", () => {
        it("Should return all flights when GET /launch", async () => {
            const response = await request(app).get("/v1/launches");
            expect(response.body.results.length).equal(2);
        });

        it("Should return only one flight when GET /launch?limit=1", async () => {
            const response = await request(app).get("/v1/launches?limit=1");
            expect(response.body.results.length).equal(1);
        });
    });

    describe("GET /launches/stats", () => {
        it("Should return stats from one rocket when GET /launch/stats/rockets", async () => {
            const response = await request(app).get(
                "/v1/launches/stats/rockets"
            );
            expect(response.body.launchesByRocket.length).equal(1);
            expect(
                response.body.launchesByRocket[0].rocket.name.some(
                    (n) => n == "Test"
                )
            ).equal(true);
        });

        it("Should return stats from one year when GET /launch/stats/year", async () => {
            const response = await request(app).get("/v1/launches/stats/year");
            expect(response.body.launchesByYear.length).equal(1);
        });
    });
});
