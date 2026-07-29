import TicketRepository from "../repositories/ticket.repositories.js";
import { getEventById } from "./event.services.js";
import crypto from "crypto";

const ticketRepository = new TicketRepository();

export const createTicketService = async (userId, eventId, quantity) => {

    const event = await getEventById(eventId);

    if (!event) {
        throw new Error("Evento no encontrado");
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