import UserRepository from "../repositories/user.repositories.js";
import { createHash, validatePassword } from "../utils/hash.js";


const userRepository = new UserRepository();


export const registerUser = async(data)=>{

    const email = data.email.trim().toLowerCase();


    const exists = await userRepository.findByEmail(email);

    if(exists){
        throw new Error("El email ya está registrado");
    }


    const hashedPassword = await createHash(data.password);


    const newUser = {
        first_name: data.first_name,
        last_name: data.last_name,
        email,
        password: hashedPassword
    };


    return await userRepository.create(newUser);

};

export const loginUser = async (email, password) => {

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
        throw new Error("Credenciales inválidas");
    }


    const isValidPassword = await validatePassword(password, user.password);
    
    if (!isValidPassword) {
        throw new Error("Credenciales inválidas");
    }

    return user;

};
