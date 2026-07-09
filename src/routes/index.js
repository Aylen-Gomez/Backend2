import { Router } from "express";

import eventRouter from "./event.routes.js";
import sessionRouter from "./session.routes.js";
import userRouter from "./user.routes.js";
import ticketRouter from "./ticket.routes.js";

const router = Router();

router.get("/health", (req, res) => {

    res.json({
        status: "OK",
        message: "Server running"
    });

});

router.use("/events", eventRouter);

router.use("/sessions", sessionRouter);

router.use("/users", userRouter);

router.use("/tickets", ticketRouter);

export default router;