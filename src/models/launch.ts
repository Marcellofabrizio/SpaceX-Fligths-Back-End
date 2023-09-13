import { Schema, model } from "mongoose";
import { IRocket } from "./rocket";
import mongoosePaginate from "mongoose-paginate-v2";

export interface ILaunch {
    _id: string;
    flightNumber: number;
    logo: string;
    name: string;
    dateUtc: string;
    rocket: IRocket;
    success: boolean;
    webcast: string;
    reused: boolean;
    createdAt: Date;
}

const launchSchema = new Schema<ILaunch>({
    _id: Schema.Types.ObjectId,
    flightNumber: Number,
    logo: String,
    name: String,
    dateUtc: String,
    rocket: {
        type: Schema.Types.ObjectId,
        ref: "Rocket",
    },
    success: Boolean,
    webcast: String,
    reused: Boolean,
    createdAt: Date,
});

launchSchema.plugin(mongoosePaginate);

const Launch = model("Launch", launchSchema);

module.exports = { Launch };
