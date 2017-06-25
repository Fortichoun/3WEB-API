const Message = require('../models/message.js');
const Room = require('../models/room.js');
const co = require('co');

// Socket IO
// Handle reception of a new message & send back this message to front-end
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('newMessage', (data) => {
      const message = new Message({
        user: data.user,
        content: data.message,
        room: data.room,
        createdAt: data.createdAt,
      });
      co(function* () {
        yield message.save();
        yield Message.populate(message, { path: 'user' });
        const room = yield Room.findOne({ _id: message.room });
        room.lastMessage = message.createdAt;
        yield room.save();
        io.emit('messageCreated', message);
      });
    });
  });
};

