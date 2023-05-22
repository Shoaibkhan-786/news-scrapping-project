const { Router } = require('express');
const { insertChannel } = require('../controller/channel-ctrl');
const { scrapChannel } = require('../controller/feed-ctrl');
const { fetchNews } = require('../controller/news-ctrl');

const indexRouter = Router();

// for insert channel
indexRouter.post('/insert-channel', insertChannel);

// for start scrapping
indexRouter.get('/start', scrapChannel);

// for getting news
indexRouter.get('/find-news', fetchNews)

module.exports = indexRouter;