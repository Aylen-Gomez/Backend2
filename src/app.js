import express from "express";
import routes from "./routes/index.js";
import { logger } from "./middlewares/logger.middleware.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

initializePassport();

app.use(passport.initialize());

app.use(logger);

app.use("/api", routes);

export default app;