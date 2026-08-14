import TicketRepository from "../repositories/ticket.repositories.js";
import { getEventById } from "./event.services.js";
import crypto from "crypto";
import UserRepository from "../repositories/user.repositories.js";
import { sendEmail } from "../utils/sendEmail.js";

const ticketRepository = new TicketRepository();
const userRepository = new UserRepository();

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
        const error = new Error("Ya estás inscripto en este evento");
        error.statusCode = 409;
        throw error;
    }

    const reserved = await ticketRepository.countReserved(eventId);

    if (reserved + quantity > event.capacity) {
        const error = new Error("No hay cupos disponibles");
        error.statusCode = 409;
        throw error;
    }

    if (event.status === "cancelled") {
    throw new Error("No es posible inscribirse a un evento cancelado");
    }

    if (event.status === "finished") {
        throw new Error("No es posible inscribirse a un evento finalizado");
    }

    if (event.status !== "published") {
        throw new Error("Solo es posible inscribirse a eventos publicados");
    }

    const reservationCode = crypto.randomUUID();

    const ticket = await ticketRepository.create({
        user: userId,
        event: eventId,
        quantity,
        reservationCode,
        status: "active"
    });

    const user = await userRepository.findById(userId);

    await sendEmail(
        user.email,
        "Inscripción confirmada",
        `
            <h2>¡Tu inscripción fue confirmada!</h2>
            <p>Te inscribiste correctamente al evento <strong>${event.title}</strong>.</p>
            <p>Cantidad de entradas: <strong>${quantity}</strong></p>
            <p>Código de reserva: <strong>${reservationCode}</strong></p>
        `
    );

    return ticket;

};

export const getMyTicketsService = async (userId) => {

    return await ticketRepository.findByUser(userId);

};

export const cancelTicketService = async (ticketId, user) => {

    const ticket = await ticketRepository.findById(ticketId);

    if (!ticket) {
        const error = new Error("Ticket no encontrado");
        error.statusCode = 404;
        throw error;
    }

    if (ticket.status === "cancelled") {
        throw new Error("El ticket ya está cancelado");
    }

    if (
        user.role !== "admin" &&
        ticket.user.toString() !== user.id
    ) {
        throw new Error("No tenés permisos para cancelar este ticket");
    }

    return await ticketRepository.update(ticketId, {
        status: "cancelled",
        cancelledAt: new Date()
    });

};

export const getTicketsByEventService = async (eventId, user) => {

    const event = await getEventById(eventId);

    if (!event) {
        const error = new Error("Evento no encontrado");
        error.statusCode = 404;
        throw error;
    }

    if (
        user.role !== "admin" &&
        event.organizer.toString() !== user.id
    ) {
        throw new Error("No tenés permisos para ver los tickets de este evento");
    }

    return await ticketRepository.findByEvent(eventId);

};