import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { registerUser, loginUser } from "../services/session.services.js";

export const initializePassport = () => {

    passport.use(
        "register",
        new LocalStrategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, email, password, done) => {

                try {

                    const user = await registerUser(req.body);

                    return done(null, user);

                } catch (error) {

                    return done(null, false, {
                        message: error.message
                    });

                }

            }
        )
    );


    passport.use(
        "login",
        new LocalStrategy(
            {
                usernameField: "email"
            },
            async (email, password, done) => {

                try {
                
                    const user = await loginUser(email, password);

                    return done(null, user);

                } catch (error) {


                    return done(null, false, {
                        message: "Credenciales inválidas"
                    });

                }

            }
        )
    );

};