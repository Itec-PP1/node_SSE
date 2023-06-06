const { contact } = require('../models');

const setContacts = async (req, res) => {
    const data = req.body;

    await contact.create(data)
        .then(() => res.json({
            response: "Contacto agregado"
        }))
        .catch((error) => {
            console.log(error)
            return res.status(400).json({ error: error.message })
        });
}

const getAllContacts = async (req, res) => {
    const data = await contact.findAll()
    return res.json({
        response: data
    });
}

const getContacts = async (req, res) => {
    const id = req.params.id;
    const data = await contact.findByPk(id);

    if (!data) {
        return res.json({
            response: "Contacto no encontrado"
        });
    }
    return res.json({
        response: data
    });
}

const deleteContacts = async (req, res) => {
    const id = req.params.id;
    const findContact = await contact.findByPk(id);
    if (!findContact) {
        return res.json({
            response: "Contacto no encontrado"
        });
    }
    const deleteContact = contact.destroy({
        where: {
            id: id
        }
    });

    return res.json({
        response: "Contacto eliminado"
    });
}

module.exports = {
    setContacts,
    getAllContacts,
    getContacts,
    deleteContacts
}