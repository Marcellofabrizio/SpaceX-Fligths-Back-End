import { Schema, model } from "mongoose";

export interface IRocket {
    spacexId: string;
    name: string;
}

const rocketSchema = new Schema<IRocket>({
    spacexId: Schema.Types.ObjectId,
    name: String,
});

const Rocket = model("Rocket", rocketSchema);

module.exports = { Rocket };
