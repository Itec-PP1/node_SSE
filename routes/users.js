const express = require('express');
const router = express.Router();
const { setUsers, getAllUsers, getUser, deleteUsers } = require('../controllers/users');

// Routes for users
router.get('/', getAllUsers)

router.post('/', setUsers)

router.get('/:id', getUser)

router.delete('/:id', deleteUsers)

module.exports = router;