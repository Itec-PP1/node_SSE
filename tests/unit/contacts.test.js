const { contact } = require('../models');
require('dotenv').config();
const process = require('process');
const { contacts } = require('../models');
const jwt = require('jsonwebtoken');
const { users } = require('../models');

const {
  setContacts,
  getAllContacts,
  getContacts,
  deleteContacts
} = require('./tu_archivo');

// Mocks
const req = {
  body: {},
  headers: {
    authorization: 'Bearer <token>'
  },
  params: {
    id: 1
  }
};

const res = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis()
};

// Tests
describe('setContacts', () => {
  it('should add a contact and return success response', async () => {
    const user = {
      id: 1
    };
    users.findByPk = jest.fn().mockResolvedValue(user);
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
    const user = {
      id: 1
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
    const user = {
      id: 1
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
    const user = {
      id: 1
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

describe('deleteContacts', () => {
  it('should delete the specified contact for the logged-in user', async () => {
    const user = {
      id: 1
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
    const user = {
      id: 1
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
