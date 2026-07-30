import {
    createTicketService,
    getMyTicketsService,
    cancelTicketService
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

        res.status(400).json({
            error: error.message
        });

    }

};

export const getMyTickets = async (req, res) => {

    try {

        const tickets = await getMyTicketsService(req.user.id);

        res.status(200).json(tickets);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

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

        res.status(400).json({
            error: error.message
        });

    }

};