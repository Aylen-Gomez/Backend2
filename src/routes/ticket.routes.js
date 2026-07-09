import { Router } from "express";

import { getTickets } from "../controllers/ticket.controllers.js";

const router = Router();

router.get("/", getTickets);

export default router;