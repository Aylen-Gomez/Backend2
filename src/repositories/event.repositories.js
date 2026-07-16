import Event from "../models/Event.js";

export default class EventRepository {

    async create(eventData) {

        return await Event.create(eventData);

    }

    async findById(id) {

        return await Event.findById(id);

    }

    async update(id, data) {

        return await Event.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

    }

}