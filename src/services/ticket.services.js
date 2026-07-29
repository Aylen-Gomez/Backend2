import TicketRepository from "../repositories/ticket.repositories.js";
import { getEventById } from "./event.services.js";
import crypto from "crypto";

const ticketRepository = new TicketRepository();

export const createTicketService = async (userId, eventId, quantity) => {

    if (quantity <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
    }

    const event = await getEventById(eventId);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    const activeTicket = await ticketRepository.findActiveTicket(
    userId,
    eventId
);

    if (activeTicket) {
        throw new Error("Ya estás inscripto en este evento");
    }

    const reserved = await ticketRepository.countReserved(eventId);

    if (reserved + quantity > event.capacity) {
        throw new Error("No hay cupos disponibles");
    }

    if (event.status !== "published") {
    throw new Error("Solo es posible inscribirse a eventos publicados");
    }

    if (event.status === "cancelled") {
        throw new Error("No es posible inscribirse a un evento cancelado");
    }

    if (event.status === "finished") {
        throw new Error("No es posible inscribirse a un evento finalizado");
    }

    const reservationCode = crypto.randomUUID();

    return await ticketRepository.create({
        user: userId,
        event: eventId,
        quantity,
        reservationCode,
        status: "confirmed"
    });

};

export const getMyTicketsService = async (userId) => {

    return await ticketRepository.findByUser(userId);

};

export const cancelTicketService = async (ticketId) => {

    return await ticketRepository.update(ticketId, {
        status: "cancelled",
        cancelledAt: new Date()
    });

};