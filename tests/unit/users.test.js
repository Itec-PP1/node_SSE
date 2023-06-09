const { users } = require('../../models');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  setUsers,
  getAllUsers,
  getUser,
  deleteUsers,
  login
} = require("../../controllers/users");

// Test para la función setUsers
describe("setUsers", () => {
  it("should create a new user and return a token", async () => {
    const req = {
      body: {
        firstname: "Seba",
        lastname: "Prueba",
        username: "prueba",
        password: "password",
        born: "1990-01-01",
        email: "john@example.com",
        phone: "1234567890"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    await setUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuario creado',
      token: expect.any(String)
    });
  });

  it("should return an error if any required field is missing", async () => {
    const req = {
      body: {
        firstname: "Seba",
        lastname: "Prueba",
        username: "prueba",
        born: "1990-01-01",
        email: "john@example.com",
        phone: "1234567890"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    await setUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Todos los campos son requeridos");
  });

});

// Test para la función login
describe("login", () => {
  it("should login the user and return a token", async () => {
    const req = {
      body: {
        username: "johndoe",
        password: "password"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    // Mock de la función findOne() del modelo users para retornar un usuario existente
    users.findOne = jest.fn().mockResolvedValue({ id: 1, username: "johndoe", password: await bcrypt.hash("password", 10) });
    // Mock de la función compare() de bcrypt para retornar true
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuario logueado',
      token: expect.any(String)
    });
  });

  it("should return an error if any required field is missing", async () => {
    const req = {
      body: {
        // Missing username field
        password: "password"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Todos los campos son requeridos");
  });

  it("should return an error if the username or password is incorrect", async () => {
    const req = {
      body: {
        username: "johndoe",
        password: "password"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    // Mock de la función findOne() del modelo users para retornar null
    users.findOne = jest.fn().mockResolvedValue(null);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Credenciales incorrectas");
  });

});

// Test para la función getAllUsers
describe("getAllUsers", () => {
  it("should return all users", async () => {
    const req = {};
    const res = {
      json: jest.fn()
    };
    // Mock de la función findAll() del modelo users
    users.findAll = jest.fn().mockResolvedValue([{ id: 1, username: "johndoe" }, { id: 2, username: "janedoe" }]);
    await getAllUsers(req, res);
    expect(res.json).toHaveBeenCalledWith({
      response: [{ id: 1, username: "johndoe" }, { id: 2, username: "janedoe" }]
    });
  });

});

// Test para la función getUser
describe("getUser", () => {
  it("should return the user with the specified id", async () => {
    const req = {
      params: {
        id: 1
      }
    };
    const res = {
      json: jest.fn()
    };
    // Mock de la función findByPk() del modelo users
    users.findByPk = jest.fn().mockResolvedValue({ id: 1, username: "johndoe" });
    await getUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      response: { id: 1, username: "johndoe" }
    });
  });

  it("should return an error if the user with the specified id is not found", async () => {
    const req = {
      params: {
        id: 1
      }
    };
    const res = {
      json: jest.fn()
    };
    // Mock de la función findByPk() del modelo users para retornar null
    users.findByPk = jest.fn().mockResolvedValue(null);
    await getUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      response: "Usuario no encontrado"
    });
  });
});

// Test para la función deleteUsers
describe("deleteUsers", () => {
  it("should delete the user with the specified id", async () => {
    const req = {
      params: {
        id: 1
      }
    };
    const res = {
      json: jest.fn()
    };
    // Mock de la función findByPk() del modelo users para retornar un usuario existente
    users.findByPk = jest.fn().mockResolvedValue({ id: 1, username: "johndoe" });
    // Mock de la función destroy() del modelo users
    users.destroy = jest.fn().mockResolvedValue(1);
    await deleteUsers(req, res);
    expect(res.json).toHaveBeenCalledWith({
      response: "Usuario eliminado"
    });
  });

  it("should return an error if the user with the specified id is not found", async () => {
    const req = {
      params: {
        id: 1
      }
    };
    const res = {
      json: jest.fn()
    };
    // Mock de la función findByPk() del modelo users para retornar null
    users.findByPk = jest.fn().mockResolvedValue(null);
    await deleteUsers(req, res);
    expect(res.json).toHaveBeenCalledWith({
      response: "Usuario no encontrado"
    });
  });

});
