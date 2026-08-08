import User from "../models/User.js";

export default class UserDAO {

    async create(user) {
        return await User.create(user);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(id) {
    return await User.findById(id);
    }

}