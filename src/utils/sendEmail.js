import transporter from "../config/mailer.js";
import env from "../config/env.js";

export const sendEmail = async (to, subject, html) => {

    try {

        await transporter.sendMail({
            from: env.MAIL_FROM,
            to,
            subject,
            html
        });

    } catch (error) {

        console.error("Error al enviar el email:", error.message);

    }

};