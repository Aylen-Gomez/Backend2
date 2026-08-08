import EventRepository from "../repositories/event.repositories.js";

const eventRepository = new EventRepository();

const validStatus = [
    "draft",
    "published",
    "cancelled",
    "finished"
];

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

    if (!data.status) {
    data.status = "draft";
    }

    if (!validStatus.includes(data.status)) {
    throw new Error("Estado inválido");
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

export const updateEventStatusService = async (id, status) => {

    const event = await eventRepository.findById(id);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    if (event.status === "cancelled") {
        throw new Error("No se puede modificar un evento cancelado");
    }

    if (!validStatus.includes(status)) {
    throw new Error("Estado inválido");
    }

    if (
        status === "published" &&
        (event.status === "finished" || event.status === "cancelled")
    ) {
        throw new Error("No se puede publicar un evento finalizado o cancelado");
    }

    return await eventRepository.update(id, { status });

};