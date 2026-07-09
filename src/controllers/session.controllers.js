import {registerUser} from "../services/session.services.js";


export const register = async(req,res)=>{

    try{
        console.log(req.body);
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
