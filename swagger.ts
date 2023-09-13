import {
    getLaunches,
    getLaunchesByRocket,
    getLaunchesByYear,
} from "./api/v1/launch.swagger";

export const swaggerDocument = {
    openapi: "3.0.1",
    info: {
        version: "1.0.0",
        title: "SpaceX Launchs API",
        description: "Documentação da API do SpaceX",
        termsOfService: "",
        contact: {
            name: "Marcello Fabrizio",
        },
        license: {
            name: "Apache 2.0",
            url: "https://www.apache.org/licenses/LICENSE-2.0.html",
        },
    },
    paths: {
        "/v1/launches": {
            get: getLaunches,
        },
        "/v1/launches/stats/rockets": {
            get: getLaunchesByRocket,
        },
        "/v1/launches/stats/year": {
            get: getLaunchesByYear,
        },
    },
    definitions: {
        Rocket: {
            type: "object",
            properties: {
                _id: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
            },
        },
        Launch: {
            type: "object",
            properties: {
                _id: {
                    type: "string",
                },
                logo: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
                dateUtc: {
                    type: "string",
                },

                webcast: {
                    type: "string",
                },
                reused: {
                    type: "boolean",
                },
                createdAt: {
                    type: "string",
                },
                success: {
                    type: "boolean",
                },
                flightNumber: {
                    type: "number",
                },
                rocket: {
                    ref: "#/definitions/Rocket",
                },
            },
        },
        LaunchGETResult: {
            type: "object",
            properties: {
                page: {
                    type: "number",
                },
                totalDocs: {
                    type: "number",
                },
                totalPages: {
                    type: "number",
                },
                hasPrev: {
                    type: "boolean",
                },
                hasNext: {
                    type: "boolean",
                },
                results: {
                    type: "array",
                    items: {
                        ref: "#/definitions/Launch",
                    },
                },
            },
        },
        LaunchByRocketStats: {
            type: "object",
            properties: {
                launchesByRocket: {
                    type: "array",
                    items: {
                        rocket: {
                            type: "name",
                        },
                        count: {
                            type: "number",
                        },
                    },
                },
            },
        },
        LaunchByYearStats: {
            type: "object",
            properties: {
                launchesByYear: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            year: {
                                type: "number",
                            },
                            launches: {
                                type: "number",
                            },
                        },
                    },
                },
            },
        },
    },
};
