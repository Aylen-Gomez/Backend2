import "./config/env.js";
import app from "./app.js";
import { connectDB } from "./config/database.js";

connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});