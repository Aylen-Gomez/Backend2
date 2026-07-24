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

export default router;