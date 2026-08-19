import TicketRepository from "../repositories/ticket.repositories.js";
import { getEventById } from "./event.services.js";
import crypto from "crypto";
import UserRepository from "../repositories/user.repositories.js";
import { sendEmail } from "../utils/sendEmail.js";

const ticketRepository = new TicketRepository();
const userRepository = new UserRepository();

export const createTicketService = async (userId, eventId, quantity) => {

    if (quantity <= 0) {
        const error = new Error("La cantidad debe ser mayor a 0");
        error.statusCode = 400;
        throw error;
    }

    const event = await getEventById(eventId);

    if (!event) {
        const error = new Error("Evento no encontrado");
        error.statusCode = 404;
        throw error;
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
        const error = new Error("No es posible inscribirse a un evento cancelado");
        error.statusCode = 400;
        throw error;
    }

    if (event.status === "finished") {
        const error = new Error("No es posible inscribirse a un evento finalizado");
        error.statusCode = 400;
        throw error;
    }

    if (event.status !== "published") {
        const error = new Error("Solo es posible inscribirse a eventos publicados");
        error.statusCode = 400;
        throw error;
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
        const error = new Error("El ticket ya está cancelado");
        error.statusCode = 400;
        throw error;
    }

    if (
        user.role !== "admin" &&
        ticket.user.toString() !== user.id
    ) {
        const error = new Error("No tenés permisos para cancelar este ticket");
        error.statusCode = 403;
        throw error;
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
        const error = new Error("No tenés permisos para ver los tickets de este evento");
        error.statusCode = 403;
        throw error;
    }

    return await ticketRepository.findByEvent(eventId);

};