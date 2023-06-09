require('dotenv').config();
const process = require('process');
const { contacts } = require('../models');
const jwt = require('jsonwebtoken');
const { users } = require('../models');

const setContacts = async (req, res) => {
    const data = req.body;
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log(decoded)
        const user = await users.findByPk(decoded.user_id);
        if (!user) {
            return res.status(400).json({ error: 'Usuario no logueado' });
        }
        data.userId = user.id;
        await contacts.create(data)
            .then(() => res.json({
                response: "Contacto agregado"
            }))
            .catch((error) => {
                console.log(error)
                return res.status(400).json({ error: error.message })
            });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const getAllContacts = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await users.findByPk(decoded.user_id);

    if (!user) {
        return res.status(400).json({ error: 'Usuario no logueado' });
    }

    const data = await contacts.findAll({
        where: {
            userId: user.id
        }
    })
    return res.json({
        response: data
    });
}

const getContacts = async (req, res) => {
    const id = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await users.findByPk(decoded.user_id);

    if (!user) {
        return res.status(400).json({ error: 'Usuario no logueado' });
    }

    const data = await contacts.findOne({
        where: {
            id: id,
            userId: user.id
        }
    });

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
    const findContact = await contacts.findByPk(id);
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await users.findByPk(decoded.user_id);

    if (!user) {
        return res.status(400).json({ error: 'Usuario no logueado' });
    }
    if (!findContact) {
        return res.json({
            response: "Contacto no encontrado"
        });
    }
    const deleteContact = contacts.destroy({
        where: {
            id: id,
            userId: user.id
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