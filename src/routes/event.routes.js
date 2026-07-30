import { Router } from "express";
import passport from "passport";
import {
    getEvents,
    getEventByIdController,
    createEvent,
    updateEvent,
    updateEventStatus,
    getUsers
} from "../controllers/event.controllers.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createTicket } from "../controllers/ticket.controllers.js";
import { getTicketsByEvent } from "../controllers/ticket.controllers.js";

const router = Router();

router.get("/", getEvents);

router.get(
    "/users",
    passport.authenticate("current", { session: false }),
    authorize("admin"),
    getUsers
);

router.get("/:id", getEventByIdController);

router.post(
    "/",
    passport.authenticate("current", { session: false }),
    authorize("organizer", "admin"),
    createEvent
);

router.put(
    "/:id",
    passport.authenticate("current", { session: false }),
    authorize("organizer", "admin"),
    updateEvent
);

router.patch(
    "/:id/status",
    passport.authenticate("current", { session: false }),
    authorize("organizer", "admin"),
    updateEventStatus
);

router.post(
    "/:eid/tickets",
    passport.authenticate("current", { session: false }),
    createTicket
);

router.get(
    "/:eid/tickets",
    passport.authenticate("current", { session: false }),
    getTicketsByEvent
);

export default router;