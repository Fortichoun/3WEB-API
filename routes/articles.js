const Article = require('../models/article.js');
const express = require('express');
const co = require('co');

const router = express.Router();

// GET on /api/articles
router.get('/', (req, res) => {
  co(function* () {
    const articles = yield Article.find();
    res.json(articles);
  });
});

// POST on /api/articles
router.post('/', (req, res) => {
  const { body } = req;
  co(function* () {
    const article = new Article({
      title: body.title,
      url: body.url,
      creator: body.user,
    });
    yield article.save();
    res.json(article);
  });
});

router.post('/patchVote', (req, res) => {
  const { body } = req;
  co(function* () {
    const article = yield Article.findOne({ _id: body.articleId });
    article.vote += body.vote;
    yield article.save();
    const articles = yield Article.find();
    res.json(articles);
  });
});

module.exports = router;
