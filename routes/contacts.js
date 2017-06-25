const User = require('../models/user.js');
const express = require('express');
const co = require('co');

const router = express.Router();

// GET on /api/contacts/allContacts
// Give back to the front-end every contacts
router.get('/allContacts', (req, res) => {
  co(function* () {
    const { query } = req;
    const user = yield User.findOne({ _id: query.user });
    yield User.populate(user, { path: 'friendRequestSent._id friendRequestReceived._id contacts._id' });
    res.json(user);
  });
});

// POST on api/contacts/add
// Handle the add of a friend
router.post('/add', (req, res) => {
  co(function* () {
    const { body } = req;
    const user = yield User.findOne({ _id: body.userId });
    user.contacts.push({ _id: body.contactId });
    yield user.save();
    yield User.populate(user, { path: 'friendRequestSent._id friendRequestReceived._id contacts._id' });
    res.json(user);
  });
});


// POST on api/contacts/remove
// Handle the remove of a friend
router.post('/remove', (req, res) => {
  co(function* () {
    const { body } = req;
    // const contact = yield User.findOne({ _id: body.contactId });
    // contact.contacts.pull({ _id: body.userId });
    // yield contact.save();
    const user = yield User.findOne({ _id: body.userId });
    user.contacts.pull({ _id: body.contactId });
    yield user.save();
    yield User.populate(user, { path: 'friendRequestSent._id friendRequestReceived._id contacts._id' });
    res.json(user);
  });
});


module.exports = router;
