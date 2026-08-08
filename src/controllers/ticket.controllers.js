import {
    createTicketService,
    getMyTicketsService,
    cancelTicketService,
    getTicketsByEventService
} from "../services/ticket.services.js";

export const createTicket = async (req, res) => {
    try {
        const { quantity } = req.body;

        const ticket = await createTicketService(
            req.user.id,
            req.params.eid,
            quantity
        );

        res.status(201).json({
            message: "Inscripción realizada correctamente",
            ticket
        });
    } catch (error) {
        if (error.message === "Evento no encontrado") {
            return res.status(404).json({ error: error.message });
        }

        if (error.message === "Ya estás inscripto en este evento") {
            return res.status(409).json({ error: error.message });
        }

        res.status(400).json({ error: error.message });
    }
};

export const getMyTickets = async (req, res) => {
    try {
        const tickets = await getMyTicketsService(req.user.id);
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const cancelTicket = async (req, res) => {
    try {
        const ticket = await cancelTicketService(
            req.params.tid,
            req.user
        );

        res.status(200).json({
            message: "Ticket cancelado correctamente",
            ticket
        });
    } catch (error) {
        if (error.message === "Ticket no encontrado") {
            return res.status(404).json({ error: error.message });
        }

        if (error.message === "No tenés permisos para cancelar este ticket") {
            return res.status(403).json({ error: error.message });
        }

        res.status(400).json({ error: error.message });
    }
};

export const getTicketsByEvent = async (req, res) => {
    try {
        const tickets = await getTicketsByEventService(
            req.params.eid,
            req.user
        );

        res.status(200).json(tickets);
    } catch (error) {
        if (error.message === "Evento no encontrado") {
            return res.status(404).json({ error: error.message });
        }

        if (error.message === "No tenés permisos para ver los tickets de este evento") {
            return res.status(403).json({ error: error.message });
        }

        res.status(500).json({ error: error.message });
    }
};