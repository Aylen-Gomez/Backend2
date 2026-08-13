import nodemailer from "nodemailer";
import env from "./env.js";

const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: false,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
    }
});

transporter.verify((error, success) => {

    if (error) {
        console.error("❌ Error de conexión con el servidor de correo:");
        console.error(error);
    } else {
        console.log("✅ Servidor de correo listo para enviar emails");
    }

});

export default transporter;