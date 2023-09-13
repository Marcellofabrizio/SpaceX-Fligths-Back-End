import "mocha";
import { expect } from "chai";
import { agent as request } from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

const { Launch } = require("../../models/launch");
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

        const launch1 = new Launch();
        launch1._id = new mongoose.mongo.ObjectId();
        launch1.flightNumber = 1;
        launch1.name = "Test Launch 1";
        launch1.dateUtc = "2023-03-29T00:00:00.000Z";
        launch1.logo = "Test";
        launch1.webcast = "Test";
        launch1.article = "Test";
        launch1.reused = true;
        launch1.createdAt = new Date().toDateString();
        launch1.rocket = rocket._id;
        await launch1.save();

        const launch2 = new Launch();
        launch2._id = new mongoose.mongo.ObjectId();
        launch2.flightNumber = 2;
        launch2.name = "Test Launch 2";
        launch2.dateUtc = "2023-03-30T00:00:00.000Z";
        launch2.logo = "Test";
        launch2.webcast = "Test";
        launch2.article = "Test";
        launch2.reused = true;
        launch2.createdAt = new Date().toDateString();
        launch2.rocket = rocket._id;
        await launch2.save();
    });

    after(async () => {
        await Rocket.deleteMany({});
        await Launch.deleteMany({});
        await mongoose.connection.close();
    });

    describe("GET /launches", () => {
        it("Should return all launchs when GET /launch", async () => {
            const response = await request(app).get("/v1/launches");
            expect(response.body.results.length).equal(2);
        });

        it("Should return only one launch when GET /launch?limit=1", async () => {
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
