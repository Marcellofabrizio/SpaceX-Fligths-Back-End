const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
import appRouter from "routes";
import { swaggerDocument } from "../swagger";

export const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(appRouter);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", async (_, res) => {
    res.send({ message: "Fullstack Challenge 🏅 - Space X API" });
});
