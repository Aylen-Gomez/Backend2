import express from "express";
import routes from "./routes/index.js";
import { logger } from "./middlewares/logger.middleware.js";

const app = express();

app.use(express.json());

app.use(logger);

app.use("/api", routes);

export default app;