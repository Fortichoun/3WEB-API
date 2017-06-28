const Message = require('../models/message.js');
const Room = require('../models/room.js');
const express = require('express');
// const authentication = require('../middlewares/authentication.js');
const co = require('co');

const router = express.Router();

// router.use(authentication);

// GET on /api/rooms
// Search for every groups / channels
router.get('/', (req, res) => {
  const { query } = req;
  co(function* () {
    const rooms = yield Room.find({ typeOfRoom: query.typeOfRoom });
    yield Room.populate(rooms, { path: 'creator' });
    res.json(rooms);
  });
});

// GET on /api/rooms/messages
// Search for every messages in a conversation
router.get('/messages', (req, res) => {
  Message.find({ room: req.query.room })
    .populate('user room')
    .exec((err, docs) => {
      res.json(docs);
    });
});

// POST on /api/rooms
// Handle the creation of a new game / private conversation
router.post('/', (req, res) => {
  const { body } = req;
  co(function* () {
    let room = null;
    const users = [body.user];
    if (body.typeOfRoom === 'contacts') {
      room = yield Room.findOne({ typeOfRoom: body.typeOfRoom, 'users._id': { $all: users } });
    }
    if (body.typeOfRoom === 'games') {
      room = yield Room.findOne({ typeOfRoom: body.typeOfRoom, creator: body.user });
    }
    if (!room) {
      room = new Room({
        name: body.roomName,
        typeOfRoom: body.typeOfRoom,
        creator: body.user,
      });
      room.users.push(body.user);
      yield room.save();
    }
    res.json(room);
  });
});

// GET on /api/rooms/usersInRoom
// Search for every users in the room
router.get('/usersInRoom', (req, res) => {
  co(function* () {
    const room = yield Room.findOne({ _id: req.query.room });
    yield Room.populate(room, { path: 'users._id' });
    res.json(room);
  });
});

module.exports = router;
