import { Router } from "express";
import passport from "passport";
import { register, login, current, logout } from "../controllers/session.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/register",
    passport.authenticate("register", {
        session: false,
        failWithError: true
    }),
    register
);

router.post("/login", login);

router.get("/current", auth, current);

router.post("/logout", logout);

export default router;