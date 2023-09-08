import { Schema, model } from "mongoose";

export interface IRocket {
    _id: string;
    name: string;
}

const rocketSchema = new Schema<IRocket>({
    _id: Schema.Types.ObjectId,
    name: String,
});

const Rocket = model("Rocket", rocketSchema);

module.exports = { Rocket };
