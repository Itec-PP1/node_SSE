const express = require('express');
const router = express.Router();
const { setContacts, getAllContacts, getContacts, deleteContacts } = require('../controllers/contacts');

// Routes for contacts
router.get('/', getAllContacts)

router.post('/', setContacts)

router.get('/:id', getContacts)

router.delete('/:id', deleteContacts)

module.exports = router;