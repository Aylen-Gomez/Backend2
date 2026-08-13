import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
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