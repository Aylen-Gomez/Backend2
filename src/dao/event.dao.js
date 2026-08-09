import Event from "../models/Event.js";

export default class EventDAO {

    async create(eventData) {
        return await Event.create(eventData);
    }

    async findAll(filter, options = {}) {
        return await Event.find(filter, null, options);
    }

    async count(filter) {
        return await Event.countDocuments(filter);
    }

    async findById(id) {
        return await Event.findById(id);
    }

    async findOne(filter) {
        return await Event.findOne(filter);
    }

    async update(id, data) {
        return await Event.findByIdAndUpdate(
            id,
            data,
            { returnDocument: "after" }
        );
    }
}