const express = require('express');
const router = express.Router();
const { setUsers, getAllUsers, getUser, deleteUsers, login } = require('../controllers/users');
const auth = require('../middleware/auth');

// Routes for users
router.get('/', auth, getAllUsers)

router.post('/', setUsers)

router.get('/:id', auth, getUser)

router.delete('/:id', auth, deleteUsers)

router.post('/login', login)

module.exports = router;