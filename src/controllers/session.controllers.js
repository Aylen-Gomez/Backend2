import { registerUser, loginUser } from "../services/session.services.js";
import { generateToken } from "../utils/jwt.js";

export const register = async(req,res)=>{

    try{
        const {first_name,last_name,email,password}=req.body;


        if(!first_name || !last_name || !email || !password){
            return res.status(400).json({
                error:"Todos los campos son obligatorios"
            });
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({
                error:"Email inválido"
            });
        }


        if(password.length < 6){
            return res.status(400).json({
                error:"La contraseña debe tener mínimo 6 caracteres"
            });
        }


        const user = await registerUser(req.body);


        const {password:_, ...safeUser}=user.toObject();


        res.status(201).json({
            message:"Usuario registrado correctamente",
            user:safeUser
        });


    }catch(error){

        res.status(400).json({
            error:error.message
        });

    }

};

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email y contraseña son obligatorios"
            });
        }

        const user = await loginUser(email, password);

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

        res.status(200).json({
            message: "Login exitoso",
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(401).json({
            error: error.message
        });

    }

};

export const current = async (req, res) => {

    res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
    });

};

export const logout = async (req, res) => {

    res.clearCookie("currentUser");

    res.status(200).json({
        message: "Logout exitoso"
    });

};
