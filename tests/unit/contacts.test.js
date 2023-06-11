require('dotenv').config();
const { contacts } = require('../../models');
const { users } = require('../../models');
const process = require('process');
const jwt = require('jsonwebtoken');

const {
  setContacts,
  getAllContacts,
  getContacts,
  updateContacts,
  deleteContacts
} = require('../../controllers/contacts');

// Mocks
const req = {
  body: {
    name: "Jaun",
    phone: "123",
    date: "2023/04/01",
    favorites: false,
    userId: 1
  },
  headers: {
    authorization: ''
  },
  params: {},
};

const res = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis()
};

// Función para iniciar sesión con el usuario "admin"
async function loginAdmin() {
  const adminUser = await users.findOne({ where: { username: 'admin' } });
  if (adminUser) {
    const token = jwt.sign(
      { user_id: adminUser.id, username: adminUser.username },
      process.env.JWT_KEY,
      {
        expiresIn: "2h",
      }
    );
    req.headers.authorization = `Bearer ${token}`;
  }
}

// Antes de ejecutar las pruebas, inicia sesión con el usuario "admin"
beforeAll(async () => {
  await loginAdmin();
});

// Tests
describe('setContacts', () => {
  it('should add a contact and return success response', async () => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = {
      id: decoded.user_id
    };

    users.findByPk = jest.fn().mockResolvedValue(user);
    users.findOne = jest.fn().mockResolvedValue(null);
    contacts.create = jest.fn().mockResolvedValue();

    await setContacts(req, res);

    expect(users.findByPk).toHaveBeenCalledWith(user.id);
    expect(contacts.create).toHaveBeenCalledWith(expect.objectContaining(req.body));
    expect(res.json).toHaveBeenCalledWith({
      response: 'Contacto agregado'
    });
  });

  it('should return error response if user is not logged in', async () => {
    users.findByPk = jest.fn().mockResolvedValue(null);

    await setContacts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Usuario no logueado'
    });
  });

  it('should return error response if contact already exists', async () => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = {
      id: decoded.user_id
    };
    users.findByPk = jest.fn().mockResolvedValue(user);
    contacts.findOne = jest.fn().mockResolvedValue({});

    await setContacts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El contacto ya existe'
    });
  });

  it('should return error response if an exception is thrown', async () => {
    const errorMessage = 'Some error occurred';
    users.findByPk = jest.fn().mockRejectedValue(new Error(errorMessage));

    await setContacts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: errorMessage
    });
  });
});

describe('getAllContacts', () => {
  it('should return all contacts for the logged-in user', async () => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = {
      id: decoded.user_id
    };
    users.findByPk = jest.fn().mockResolvedValue(user);
    contacts.findAll = jest.fn().mockResolvedValue(['contact1', 'contact2']);

    await getAllContacts(req, res);

    expect(users.findByPk).toHaveBeenCalledWith(user.id);
    expect(contacts.findAll).toHaveBeenCalledWith({
      where: {
        userId: user.id
      }
    });
    expect(res.json).toHaveBeenCalledWith({
      response: ['contact1', 'contact2']
    });
  });

  it('should return error response if user is not logged in', async () => {
    users.findByPk = jest.fn().mockResolvedValue(null);

    await getAllContacts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Usuario no logueado'
    });
  });
});

describe('getContacts', () => {
  it('should return the specified contact for the logged-in user', async () => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = {
      id: decoded.user_id
    };
    users.findByPk = jest.fn().mockResolvedValue(user);
    contacts.findOne = jest.fn().mockResolvedValue('contact');

    await getContacts(req, res);

    expect(users.findByPk).toHaveBeenCalledWith(user.id);
    expect(contacts.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
        userId: user.id
      }
    });
    expect(res.json).toHaveBeenCalledWith({
      response: 'contact'
    });
  });

  it('should return "Contacto no encontrado" response if contact is not found', async () => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = {
      id: decoded.user_id
    };
    users.findByPk = jest.fn().mockResolvedValue(user);
    contacts.findOne = jest.fn().mockResolvedValue(null);

    await getContacts(req, res);

    expect(res.json).toHaveBeenCalledWith({
      response: 'Contacto no encontrado'
    });
  });

  it('should return error response if user is not logged in', async () => {
    users.findByPk = jest.fn().mockResolvedValue(null);

    await getContacts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Usuario no logueado'
    });
  });
});

describe('updateContacts', () => {
  it('should update the specified contact for the logged-in user', async () => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = {
      id: decoded.user_id
    };
    users.findByPk = jest.fn().mockResolvedValue(user);
    contacts.findByPk = jest.fn().mockResolvedValue('contact');
    contacts.update = jest.fn().mockResolvedValue();

    await updateContacts(req, res);

    expect(users.findByPk).toHaveBeenCalledWith(user.id);
    expect(contacts.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(contacts.update).toHaveBeenCalledWith(expect.objectContaining(req.body), {
      where: {
        id: req.params.id,
        userId: user.id
      }
    });
    expect(res.json).toHaveBeenCalledWith({
      response: 'Contacto actualizado'
    });
  });

  it('should return "Contacto no encontrado" response if contact is not found', async () => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = {
      id: decoded.user_id
    };
    users.findByPk = jest.fn()
      .mockResolvedValueOnce({ id: 1, username: "admin" })
      .mockResolvedValueOnce(null);

    await updateContacts(req, res);

    expect(res.json).toHaveBeenCalledWith({
      response: 'Contacto no encontrado'
    });
  });
});

describe('deleteContacts', () => {
  it('should delete the specified contact for the logged-in user', async () => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = {
      id: decoded.user_id
    };
    users.findByPk = jest.fn().mockResolvedValue(user);
    contacts.findByPk = jest.fn().mockResolvedValue('contact');
    contacts.destroy = jest.fn().mockResolvedValue();

    await deleteContacts(req, res);

    expect(users.findByPk).toHaveBeenCalledWith(user.id);
    expect(contacts.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(contacts.destroy).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
        userId: user.id
      }
    });
    expect(res.json).toHaveBeenCalledWith({
      response: 'Contacto eliminado'
    });
  });

  it('should return "Contacto no encontrado" response if contact is not found', async () => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = {
      id: decoded.user_id
    };
    users.findByPk = jest.fn().mockResolvedValue(user);
    contacts.findByPk = jest.fn().mockResolvedValue(null);

    await deleteContacts(req, res);

    expect(res.json).toHaveBeenCalledWith({
      response: 'Contacto no encontrado'
    });
  });

  it('should return error response if user is not logged in', async () => {
    users.findByPk = jest.fn().mockResolvedValue(null);

    await deleteContacts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Usuario no logueado'
    });
  });
});
