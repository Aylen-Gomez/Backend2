export default class TicketDTO {

    constructor(ticket) {

        this.id = ticket._id || ticket.id;
        this.status = ticket.status;
        this.quantity = ticket.quantity;
        this.reservationCode = ticket.reservationCode;
        this.cancelledAt = ticket.cancelledAt;
        this.createdAt = ticket.createdAt;

        if (ticket.event) {

            this.event = {
                id: ticket.event._id || ticket.event.id,
                title: ticket.event.title,
                date: ticket.event.date,
                location: ticket.event.location
            };

        } else {

            this.event = ticket.event;
        }

        if (ticket.user) {

            this.user = {
                id: ticket.user._id || ticket.user.id,
                first_name: ticket.user.first_name,
                last_name: ticket.user.last_name,
                email: ticket.user.email
            };

        } else {

            this.user = ticket.user;
        }
    }
}