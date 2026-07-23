import EventRepository from "../repositories/event.repositories.js";

const eventRepository = new EventRepository();

export const createEventService = async (data) => {

    if (new Date(data.date) < new Date()) {
        throw new Error("No se puede crear un evento con una fecha pasada");
    }

    if (data.capacity <= 0) {
        throw new Error("La capacidad debe ser mayor a 0");
    }

    if (data.price < 0) {
        throw new Error("El precio no puede ser negativo");
    }

    return await eventRepository.create(data);

};

export const getAllEventsService = async (filter, options) => {

    const events = await eventRepository.findAll(filter, options);

    const total = await eventRepository.count(filter);

    return {
        events,
        total
    };

};

export const getEventById = async (id) => {

    return await eventRepository.findById(id);

};

export const updateEventService = async (id, data) => {

    const event = await eventRepository.findById(id);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    if (event.status === "cancelled") {
        throw new Error("No se puede modificar un evento cancelado");
    }

    return await eventRepository.update(id, data);

};