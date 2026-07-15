import EventRepository from "../repositories/event.repositories.js";

const eventRepository = new EventRepository();

export const createEventService = async (data) => {

    return await eventRepository.create(data);

};