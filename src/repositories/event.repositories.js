import EventDAO from "../dao/event.dao.js";

export default class EventRepository {

    constructor() {
        this.eventDAO = new EventDAO();
    }

    async create(eventData) {
        return await this.eventDAO.create(eventData);
    }

    async findAll(filter, options = {}) {
        return await this.eventDAO.findAll(filter, options);
    }

    async count(filter) {
        return await this.eventDAO.count(filter);
    }

    async findById(id) {
        return await this.eventDAO.findById(id);
    }

    async findOne(filter) {
        return await this.eventDAO.findOne(filter);
    }

    async update(id, data) {
        return await this.eventDAO.update(id, data);
    }
}