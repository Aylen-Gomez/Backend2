import TicketDAO from "../dao/ticket.dao.js";

export default class TicketRepository {

    constructor() {
        this.ticketDAO = new TicketDAO();
    }

    async create(ticketData) {
        return await this.ticketDAO.create(ticketData);
    }

    async findByUser(userId) {
        return await this.ticketDAO.findByUser(userId);
    }

    async findById(id) {
        return await this.ticketDAO.findById(id);
    }

    async findActiveTicket(userId, eventId) {
        return await this.ticketDAO.findOne({
            user: userId,
            event: eventId,
            status: {
                $ne: "cancelled"
            }
        });
    }

    async countReserved(eventId) {
        return await this.ticketDAO.countActive(eventId);
    }

    async findByEvent(eventId) {
        return await this.ticketDAO.findByEvent(eventId);
    }

    async update(id, data) {
        return await this.ticketDAO.update(id, data);
    }
}