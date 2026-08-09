import Ticket from "../models/Ticket.js";

export default class TicketDAO {

    async create(ticketData) {
        return await Ticket.create(ticketData);
    }

    async findByUser(userId) {
        return await Ticket.find({
            user: userId
        }).populate(
            "event",
            "title date location"
        );
    }

    async findById(id) {
        return await Ticket.findById(id);
    }

    async findOne(filter) {
        return await Ticket.findOne(filter);
    }

    async findByEvent(eventId) {
        return await Ticket.find({
            event: eventId
        }).populate(
            "user",
            "first_name last_name email"
        );
    }

    async countActive(eventId) {
        const tickets = await Ticket.find({
            event: eventId,
            status: {
                $ne: "cancelled"
            }
        });

        let total = 0;

        tickets.forEach(ticket => {
            total += ticket.quantity;
        });

        return total;
    }

    async update(id, data) {
        return await Ticket.findByIdAndUpdate(
            id,
            data,
            { returnDocument: "after" }
        );
    }
}