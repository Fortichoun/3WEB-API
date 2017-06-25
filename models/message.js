const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Message = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
  },
  content: String,
  createdAt: Date,
}, {
  collection: 'messages',
  versionKey: false,
});


module.exports = mongoose.model('Message', Message);
