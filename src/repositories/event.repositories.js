import Event from "../models/event.js";

export default class EventRepository {

    async create(eventData) {

        return await Event.create(eventData);

    }

}