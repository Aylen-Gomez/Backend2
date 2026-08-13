import mongoose from "mongoose";
import env from "./env.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Error conectando MongoDB:", error.message);
    }
};