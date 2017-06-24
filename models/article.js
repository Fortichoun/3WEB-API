const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Article = new Schema({
  title: String,
  url: String,
  vote: {
    type: Number,
    default: 0,
  },
  creator: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'articles',
  versionKey: false,
});

module.exports = mongoose.model('Article', Article);
