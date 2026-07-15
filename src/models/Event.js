import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

    title: String,

    description: String,

    date: Date,

    location: String,

    price: Number,

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});

export default mongoose.model("Event", eventSchema);