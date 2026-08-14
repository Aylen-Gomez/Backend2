import {
    createEventService,
    getAllEventsService,
    getEventById,
    updateEventService,
    updateEventStatusService
} from "../services/event.services.js";
import EventDTO from "../dto/event.dto.js";

export const getEvents = async (req, res, next) => {

    try {

        const {
            page = 1,
            limit = 10,
            status,
            category,
            location,
            dateFrom,
            dateTo,
            sort
        } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (category) {
            filter.category = category;
        }

        if (location) {
            filter.location = location;
        }

        if (dateFrom || dateTo) {

            filter.date = {};

            if (dateFrom) {
                filter.date.$gte = new Date(dateFrom);
            }

            if (dateTo) {
                filter.date.$lte = new Date(dateTo);
            }

        }

        const options = {
            skip: (page - 1) * limit,
            limit: Number(limit)
        };

        if (sort) {

            options.sort = {
                [sort]: 1
            };

        }

        const result = await getAllEventsService(
            filter,
            options
        );

        const eventsDTO = result.events.map(
            event => new EventDTO(event)
        );

        res.status(200).json({
            data: eventsDTO,
            page: Number(page),
            limit: Number(limit),
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        });

    } catch (error) {

        next(error);

    }

};

export const getEventByIdController = async (req, res, next) => {

    try {

        const event = await getEventById(req.params.id);

        if (!event) {

            return res.status(404).json({
                error: "Evento no encontrado"
            });

        }

        res.status(200).json(new EventDTO(event));

    } catch (error) {

        next(error);

    }

};

export const createEvent = async (req, res, next) => {

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

        next(error);

    }

};

export const updateEvent = async (req, res, next) => {

    try {

        const updatedEvent = await updateEventService(
            req.params.id,
            req.body,
            req.user.id,
            req.user.role
        );

        res.status(200).json({
            message: "Evento actualizado correctamente",
            event: updatedEvent
        });

    } catch (error) {

        next(error);

    }

};

export const updateEventStatus = async (req, res, next) => {

    try {

        const updatedEvent = await updateEventStatusService(
            req.params.id,
            req.body.status,
            req.user.id,
            req.user.role
        );

        res.status(200).json({
            message: "Estado del evento actualizado correctamente",
            event: updatedEvent
        });

    } catch (error) {

        next(error);

    }

};

export const getUsers = (req, res) => {

    res.status(200).json({
        message: "Ruta exclusiva para administradores"
    });

};
