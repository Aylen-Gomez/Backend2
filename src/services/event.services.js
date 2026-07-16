import EventRepository from "../repositories/event.repositories.js";

const eventRepository = new EventRepository();

export const createEventService = async (data) => {

    return await eventRepository.create(data);

};

export const getEventById = async (id) => {

    return await eventRepository.findById(id);

};

export const updateEventService = async (id, data) => {

    return await eventRepository.update(id, data);

};