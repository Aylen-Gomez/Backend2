import Event from "../models/Event.js";

export default class EventRepository {

    async create(eventData) {

        return await Event.create(eventData);

    }

    async findAll(filter = {}, options = {}) {

        return await Event.find(filter)
            .sort(options.sort || {})
            .skip(options.skip || 0)
            .limit(options.limit || 0);

    }

    async count(filter = {}) {

        return await Event.countDocuments(filter);

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