import {
    createEventService,
    getAllEventsService,
    getEventById,
    updateEventService
} from "../services/event.services.js";

export const getEvents = async (req, res) => {

    try {

        const { page = 1, limit = 10 } = req.query;

        const result = await getAllEventsService(
            {},
            {
                skip: (page - 1) * limit,
                limit: Number(limit)
            }
        );

        res.status(200).json({
            data: result.events,
            page: Number(page),
            limit: Number(limit),
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

export const createEvent = async (req, res) => {

    try {

        const eventData = {
            ...req.body,
            organizer: req.user.id
        };

        const event = await createEventService(eventData);

        res.status(201).json({
            message: "Evento creado correctamente",
            event
        });

    } catch (error) {

        res.status(400).json({
            error: error.message
        });

    }

};

export const updateEvent = async (req, res) => {

    try {

        const event = await getEventById(req.params.id);

        if (!event) {

            return res.status(404).json({
                error: "Evento no encontrado"
            });

        }

        if (
            req.user.role !== "admin" &&
            event.organizer.toString() !== req.user.id
        ) {

            return res.status(403).json({
                error: "No tenés permisos para modificar este evento"
            });

        }

        const updatedEvent = await updateEventService(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: "Evento actualizado correctamente",
            event: updatedEvent
        });

    } catch (error) {

        res.status(400).json({
            error: error.message
        });

    }

};

export const getUsers = (req, res) => {

    res.status(200).json({
        message: "Ruta exclusiva para administradores"
    });

};