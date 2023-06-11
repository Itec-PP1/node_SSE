const express = require('express');
const router = express.Router();
const { setUsers, getAllUsers, getUser, updateUser, deleteUsers, login, logout } = require('../controllers/users');
const auth = require('../middleware/auth');

// Routes for users
router.get('/', auth, getAllUsers)

router.post('/', setUsers)

router.get('/:id', auth, getUser)

router.put('/:id', auth, updateUser)

router.delete('/:id', auth, deleteUsers)

router.post('/login', login)

router.post('/logout', logout)

module.exports = router;