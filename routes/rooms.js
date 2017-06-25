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
    let rooms = yield Room.find({ 'users._id': query.userId, typeOfRoom: query.typeOfRoom })
      .sort({ lastMessage: -1 });
    if (query.typeOfRoom === 'channels') {
      const roomsUserIsNotIn = yield Room.find({ typeOfRoom: query.typeOfRoom, 'users._id': { $ne: query.userId } })
        .sort({ lastMessage: -1 });
      if (rooms.length === 0) rooms = roomsUserIsNotIn;
      else if (roomsUserIsNotIn.length !== 0) rooms = rooms.concat(roomsUserIsNotIn);
    }
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
// Handle the creation of a new group / channel / private conversation
router.post('/', (req, res) => {
  const { body } = req;
  co(function* () {
    let room = null;
    const users = [body.user];
    body.usersInRoom.map(user => users.push(user));
    if (body.typeOfRoom === 'contacts') {
      room = yield Room.findOne({ typeOfRoom: body.typeOfRoom, 'users._id': { $all: users } });
    }
    if (!room) {
      room = new Room({
        name: body.roomName,
        typeOfRoom: body.typeOfRoom,
      });
      room.users.push(body.user);
      body.usersInRoom.map(user => room.users.push(user));
      if (body.typeOfRoom !== 'contacts') room.moderators.push(body.user);
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
