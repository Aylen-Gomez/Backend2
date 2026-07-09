import UserDAO from "../dao/user.dao.js";

export default class UserRepository {

    constructor() {
        this.userDAO = new UserDAO();
    }

    async create(user) {
        return await this.userDAO.create(user);
    }

    async findByEmail(email) {
        return await this.userDAO.findByEmail(email);
    }

}