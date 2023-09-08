import { Schema, model } from "mongoose";
import { IRocket } from "./rocket";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IFlight {
    _id: string;
    flightNumber: number;
    logo: string;
    name: string;
    dateUtc: string;
    rocket: IRocket;
    result: boolean;
    webcast: string;
    reused: boolean;
    createdAt: Date;
}

const flightSchema = new Schema<IFlight>({
    _id: Schema.Types.ObjectId,
    flightNumber: Number,
    logo: String,
    name: String,
    dateUtc: String,
    rocket: {
        type: Schema.Types.ObjectId,
        ref: "Rocket",
    },
    result: Boolean,
    webcast: String,
    reused: Boolean,
    createdAt: Date,
});

flightSchema.plugin(mongoosePaginate);

const Flight = model("Flight", flightSchema);

module.exports = { Flight };
