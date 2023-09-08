import { Router } from "express";
import {
    getLaunches,
    getLaunchesByRocket,
    getLaunchesByYear
} from "controllers/launches/launches.get";

const router = Router();

router.get("/launches", getLaunches);
router.get("/launches/stats/rockets", getLaunchesByRocket);
router.get("/launches/stats/year", getLaunchesByYear);


export default router;
