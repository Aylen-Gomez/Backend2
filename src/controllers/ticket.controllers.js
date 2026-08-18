import {
    createTicketService,
    getMyTicketsService,
    cancelTicketService,
    getTicketsByEventService
} from "../services/ticket.services.js";
import TicketDTO from "../dto/ticket.dto.js";

export const createTicket = async (req, res, next) => {
    try {
        const { quantity } = req.body;

        const ticket = await createTicketService(
            req.user.id,
            req.params.eid,
            quantity
        );

        const ticketDTO = new TicketDTO(ticket);

        res.status(201).json({
            message: "Inscripción realizada correctamente",
            ticket: ticketDTO
        });
    } catch (error) {
        next(error);
    }
};

export const getMyTickets = async (req, res, next) => {
    try {
        const tickets = await getMyTicketsService(req.user.id);

        const ticketsDTO = tickets.map(
            ticket => new TicketDTO(ticket)
        );

        res.status(200).json(ticketsDTO);

    } catch (error) {
        next(error);
    }
};

export const cancelTicket = async (req, res, next) => {
    try {
        const ticket = await cancelTicketService(
            req.params.tid,
            req.user
        );

        const ticketDTO = new TicketDTO(ticket);

        res.status(200).json({
            message: "Ticket cancelado correctamente",
            ticket: ticketDTO
        });
    } catch (error) {
        next(error);
    }
};

export const getTicketsByEvent = async (req, res, next) => {
    try {
        const tickets = await getTicketsByEventService(
            req.params.eid,
            req.user
        );

        const ticketsDTO = tickets.map(
            ticket => new TicketDTO(ticket)
        );

        res.status(200).json(ticketsDTO);

    } catch (error) {
        next(error);
    }
};