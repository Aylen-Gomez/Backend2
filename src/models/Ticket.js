import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({

    user: String,

    event: String,

    quantity: Number

});

export default mongoose.model("Ticket", ticketSchema);