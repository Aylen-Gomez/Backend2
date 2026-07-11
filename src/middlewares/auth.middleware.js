/*
import { verifyToken } from "../utils/jwt.js";


export const auth = (req, res, next) => {

    try {

        const token = req.cookies.currentUser;

        if (!token) {
            return res.status(401).json({
                error: "No autorizado"
            });
        }


        const payload = verifyToken(token);

        req.user = payload;

        next();


    } catch (error) {

        return res.status(401).json({
            error: "No autorizado"
        });

    }

};

*/