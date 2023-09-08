import { Router } from "express";
import launchRouter from "./launches";

const router = Router();

router.use(launchRouter);

export default router;
