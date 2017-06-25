const User = require('../models/user.js');
const Room = require('../models/room.js');
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../services/config.js');
const co = require('co');

const router = express.Router();

// POST on /api/register
// Handle the user's registration
router.post('/', (req, res, next) => {
  const { body } = req;
  const user = new User({
    userName: body.userName,
    email: body.email,
    password: body.password,
    picture: body.picture,
    birthDate: body.birthDate,
    bio: body.bio,
  });

    // Save user to DB & watch for duplicate email in DB
    // Give back the front-end the new user if success / the error if fail
  user.save((err, savedUser) => {
    if (err) {
      let message = 'Sorry, an error occurred, please retry.';
      if (err.message.indexOf('E11000 duplicate key error') !== -1) {
        message = 'Email already used.';
      }
      return res.json({
        success: false,
        message,
      });
    }
    // Token to authenticate user during his navigation
    const token = jwt.sign(savedUser, config.get('security:secret'), {
      expiresIn: config.get('security:tokenLife'),
    });
    co(function* () {
      const defaultRoom = yield Room.findOne({ _id: '594eeac398890b1db050aa6d' });
      defaultRoom.users.push(savedUser._id);
      yield defaultRoom.save();
    });
    return res.json({
      user,
      success: true,
      token,
    });
  }).catch(err => next(err));
});

module.exports = router;
