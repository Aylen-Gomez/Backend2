import express from "express";
import routes from "./routes/index.js";
import { logger } from "./middlewares/logger.middleware.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

initializePassport();

app.use(passport.initialize());

app.use(logger);

app.use("/api", routes);

app.use(errorHandler);

export default app;