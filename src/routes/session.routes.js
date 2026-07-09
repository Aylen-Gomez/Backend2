import { Router } from "express";

import { getSessions } from "../controllers/session.controllers.js";

const router = Router();

router.get("/", getSessions);

export default router;