import { Router } from "express";
import passport from "passport";

import {
    getMyTickets,
    cancelTicket,
    getTicketsByEvent
} from "../controllers/ticket.controllers.js";

const router = Router();

router.get(
    "/my-tickets",
    passport.authenticate("current", { session: false }),
    getMyTickets
);

router.patch(
    "/:tid/cancel",
    passport.authenticate("current", { session: false }),
    cancelTicket
);

router.get(
    "/event/:eid",
    passport.authenticate("current", { session: false }),
    getTicketsByEvent
);

export default router;