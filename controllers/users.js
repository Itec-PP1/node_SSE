const { user } = require('../models');

const setUsers = async (req, res) => {
    const data = req.body;

    await user.create(data)
        .then(() => res.json({
            response: "Usuario agregado"
        }))
        .catch((error) => {
            return res.status(400).json({ error: error.message })
        });
}

const getAllUsers = async (req, res) => {
    const data = await user.findAll()
    return res.json({
        response: data
    });
}

const getUser = async (req, res) => {
    const id = req.params.id;
    const data = await user.findByPk(id);

    if (!data) {
        return res.json({
            response: "Usuario no encontrado"
        });
    }
    return res.json({
        response: data
    });
}

const deleteUsers = async (req, res) => {
    const id = req.params.id;
    const findUser = await user.findByPk(id);
    if (!findUser) {
        return res.json({
            response: "Usuario no encontrado"
        });
    }
    const deleteUser = user.destroy({
        where: {
            id: id
        }
    });

    return res.json({
        response: "Usuario eliminado"
    });
}

module.exports = {
    setUsers,
    getAllUsers,
    getUser,
    deleteUsers
}