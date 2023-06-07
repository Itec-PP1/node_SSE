const express = require('express');
const router = express.Router();
const { setContacts, getAllContacts, getContacts, deleteContacts } = require('../controllers/contacts');
const auth = require('../middleware/auth');

// Routes for contacts
router.get('/', auth, getAllContacts)

router.post('/', auth, setContacts)

router.get('/:id', auth, getContacts)

router.delete('/:id', auth, deleteContacts)

module.exports = router;