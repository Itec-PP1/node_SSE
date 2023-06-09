require('dotenv').config();
const { users } = require('../models');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const setUsers = async (req, res) => {
  const {
    firstname,
    lastname,
    username,
    password,
    born,
    email,
    phone,
  } = req.body;

  try {

    if (!(firstname && lastname && username && password && born && email && phone)) {
      res.status(400).send("Todos los campos son requeridos");
    }
    const oldUser = await users.findOne({ where: { username } });
    if (oldUser) {
      return res.status(409).send("El usuario ya existe. Por favor inicie sesión");
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    await users.create(
      {
        firstname,
        lastname,
        username,
        password: encryptedPassword,
        born,
        email: email.toLowerCase(),
        phone,
      }
    )
    // Create token
    const token = jwt.sign(
      { user_id: users._id, email },
      process.env.JWT_KEY,
      {
        expiresIn: "2h",
      }
    );
    res.status(201).json({
      message: 'Usuario creado',
      token
    });
  } catch (err) {
    console.log(err);
  }

}

const getAllUsers = async (req, res) => {
  const data = await users.findAll()
  return res.json({
    response: data
  });
}

const getUser = async (req, res) => {
  const id = req.params.id;
  const data = await users.findByPk(id);

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
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await users.findByPk(decoded.user_id);

  if (!user) {
    return res.status(400).json({ error: "Usuario no logueado" });
  }
  if (user.id != 1) {
    return res.status(400).json({ error: "No tiene permisos para eliminar este usuario" });
  }
  const findUser = await users.findByPk(id);
  if (!findUser) {
    return res.json({
      response: "Usuario no encontrado"
    });
  }
  const deleteUser = users.destroy({
    where: {
      id: id
    }
  });

  return res.json({
    response: "Usuario eliminado"
  });
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("Todos los campos son requeridos");
    }

    const user = await users.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user.id, username },
        process.env.JWT_KEY,
        {
          expiresIn: "2h",
        }
      );
      res.status(200).json({
        message: 'Usuario logueado',
        token
      });
    }
    res.status(400).send("Credenciales incorrectas");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  setUsers,
  getAllUsers,
  getUser,
  deleteUsers,
  login
}