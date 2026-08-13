import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { registerUser, loginUser } from "../services/session.services.js";
import env from "./env.js";

export const initializePassport = () => {

    passport.use(
        "register",
        new LocalStrategy(
            {
                usernameField: "email",
                passReqToCallback: true,
                session: false
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
                usernameField: "email",
                session: false
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

    passport.use(
        "current",
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    (req) => {
                        return req.cookies.currentUser;
                    }
                ]),
                secretOrKey: env.JWT_SECRET
            },
            async (payload, done) => {

                try {

                    return done(null, payload);

                } catch (error) {

                    return done(error, false);

                }

            }
        )
    );

};