
const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

router.get('/', listContacts);
router.post('/', createContact);
router.get('/:contactId', getContactById);
router.put('/:contactId', updateContact);
router.delete('/:contactId', deleteContact);

router.get('/:contactId/notes', listNotes);
router.post('/:contactId/notes', addNote);

router.get('/search', searchContacts);

router.get('/:contactId/activities', listActivities);
router.post('/:contactId/activities', addActivity);

module.exports = router;
