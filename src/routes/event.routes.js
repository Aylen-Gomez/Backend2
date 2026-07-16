import { Router } from "express";
import passport from "passport";
import {
    getEvents,
    createEvent,
    updateEvent,
    getUsers
} from "../controllers/event.controllers.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", getEvents);

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

router.get(
    "/users",
    passport.authenticate("current", { session: false }),
    authorize("admin"),
    getUsers
);

export default router;