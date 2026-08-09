import { generateToken } from "../utils/jwt.js";
import UserDTO from "../dto/user.dto.js";

export const register = async (req, res) => {

    const { password, ...safeUser } = req.user.toObject();

    res.status(201).json({
        message: "Usuario registrado correctamente",
        user: safeUser
    });

};

export const login = async (req, res) => {

    try {

        const user = req.user;

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        res.cookie("currentUser", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 3600000,
            secure: process.env.NODE_ENV === "production"
        });

        const userDTO = new UserDTO(user);

        res.status(200).json({
            message: "Login exitoso",
            user: userDTO
        });

    } catch (error) {

        res.status(401).json({
            error: "Credenciales inválidas"
        });

    }

};

export const current = async (req, res) => {

    const userDTO = new UserDTO(req.user);

    res.status(200).json(userDTO);

};

export const logout = async (req, res) => {

    res.clearCookie("currentUser");

    res.status(200).json({
        message: "Logout exitoso"
    });

};