export const getLaunches = {
    tags: ["Launch"],
    parameters: [
        {
            in: "query",
            name: "limit",
            type: "number",
        },
        {
            in: "query",
            name: "search",
            type: "string",
        },
        {
            in: "query",
            name: "page",
            type: "string",
        },
    ],
    responses: {
        "200": {
            description: "Pagination data with launch data results",
            content: {
                "application/json": {
                    ref: "#/definitions/Launch",
                },
            },
        },
    },
};

export const getLaunchesByRocket = {
    tags: ["Launch"],
    responses: {
        "200": {
            description: "Statistics about launches per rocket",
            content: {
                "application/json": {
                    ref: "#/definitions/LaunchByRocketStats",
                },
            },
        },
    },
};

export const getLaunchesByYear = {
    tags: ["Launch"],
    responses: {
        "200": {
            description: "Statistics about launches per year",
            content: {
                "application/json": {
                    ref: "#/definitions/LaunchByYearStats",
                },
            },
        },
    },
};
