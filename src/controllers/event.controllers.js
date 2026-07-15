export const getEvents = (req, res) => {

    res.json([]);

};
export const createEvent = (req, res) => {

    res.status(201).json({
        message: "Evento creado correctamente"
    });

};

export const getUsers = (req, res) => {

    res.status(200).json({
        message: "Ruta exclusiva para administradores"
    });

};