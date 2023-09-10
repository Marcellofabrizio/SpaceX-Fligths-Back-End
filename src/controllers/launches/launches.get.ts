import { Request, Response, NextFunction } from "express";

const { Flight } = require("../../models/flight");
const { Rocket } = require("../../models/rocket");

interface IQueryDTO {
    page?: number;
    search?: string;
    limit?: number;
}

const DEFAULT_LIMIT = 5;
/*
    TODO
        - Return 404 if page requested is larger than total pages
*/
export async function getLaunches(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { search, limit, page } = retrieveQueryParams(req.query);

        if (page === undefined) {
            throw new Error("Missing page parameter");
        }

        const query = search
            ? {
                  name: search,
              }
            : {};

        const totalDocs = await Flight.find({
            ...query,
        }).countDocuments();

        const skip = limit * page;
        const totalPages = Math.ceil(totalDocs / limit);
        const hasPrev = page != 0;
        const hasNext = page != totalPages;

        const results = await Flight.find({
            ...query,
        })
            .sort({
                flightNumber: -1,
            })
            .limit(limit)
            .skip(skip)
            .populate("rocket");

        res.status(200).send({
            results: results,
            page: page,
            totalDocs: totalDocs,
            totalPages: totalPages,
            hasPrev: hasPrev,
            hasNext: hasNext,
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

export async function getLaunchesByRocket(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const launches = await Flight.aggregate([
            {
                $lookup: {
                    from: "rockets",
                    foreignField: "_id",
                    localField: "rocket",
                    as: "rocket",
                },
            },
            {
                $group: {
                    _id: {
                        name: "$rocket.name",
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    rocket: { $arrayElemAt: ["$_id.name", 0] },
                    count: 1,
                },
            },
        ]);

        if (launches.length == 0) {
            res.status(201);
            return;
        }

        res.status(200).send({
            launchesByRocket: launches,
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

export async function getLaunchesByYear(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const launches = await Flight.aggregate([
            {
                $lookup: {
                    from: "rockets",
                    foreignField: "_id",
                    localField: "rocket",
                    as: "rocket",
                },
            },
            {
                $addFields: {
                    date: {
                        $toDate: "$dateUtc",
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$date",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: "$_id.year",
                    launches: {
                        $push: {
                            rockets: "$_id.rocketName",
                            count: "$count",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id",
                    launches: { $arrayElemAt: ["$launches.count", 0] },
                },
            },
            {
                $sort: {
                    year: -1,
                },
            },
        ]);

        if (launches.length == 0) {
            res.status(201);
            return;
        }

        res.status(200).send({
            launchesByYear: launches,
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

function retrieveQueryParams(query): IQueryDTO {
    if (query) {
        return {
            search: query.search,
            page: query.page ? query.page : 0,
            limit: query.limit ? query.limit : DEFAULT_LIMIT,
        };
    }

    return {};
}
