import { Router } from "express";
import {
    getLaunches,
    getLaunchesByRocket,
    getLaunchesByYear
} from "controllers/launches/launches.get";

const router = Router();

router.get("/v1/launches", getLaunches);
router.get("/v1/launches/stats/rockets", getLaunchesByRocket);
router.get("/v1/launches/stats/year", getLaunchesByYear);


export default router;
