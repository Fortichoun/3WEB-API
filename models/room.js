const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Room = new Schema({
  name: String,
  users: [{
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  typeOfRoom: String,
  createdAt: {
    default: new Date(),
    type: Date,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  winner: Schema.Types.ObjectId,
  roundPlayed: Number,
  timePlayed: Number,
  lastMessage: Date,
}, {
  collection: 'rooms',
  versionKey: false,
});

module.exports = mongoose.model('Room', Room);
