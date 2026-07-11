import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

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
                    console.log(user);

                    return done(null, user);

                } catch (error) {

                    return done(null, false, {
                        message: error.message
                    });
                }

            }
        )
    );

};