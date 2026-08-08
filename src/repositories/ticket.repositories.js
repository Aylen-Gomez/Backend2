import Ticket from "../models/Ticket.js";

export default class TicketRepository {

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

    async findActiveTicket(userId, eventId) {
        return await Ticket.findOne({
            user: userId,
            event: eventId,
            status: {
                $ne: "cancelled"
            }
        });
    }

    async countReserved(eventId) {
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

    async findByEvent(eventId) {
        return await Ticket.find({
            event: eventId
        }).populate(
            "user",
            "first_name last_name email"
        );
    }

    async update(id, data) {
        return await Ticket.findByIdAndUpdate(
            id,
            data,
            { returnDocument: "after" }
        );
    }
}