import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});