const channelModel = require('../models/channel');
const feedModel = require('../models/feed');
const newsModel = require('../models/feednews');
const createError = require('http-errors');

exports.fetchNews = async (req, res) => {
    try {
        const channel = req.query.channel;
        const feedLink = req.query.link;
        console.log(channel, feedLink)

        const channel_details = await channelModel.findOne({ channel_name:channel });
        if (!channel_details) throw createError.NotFound("Channel Not found");

        const feed_details = await feedModel.findOne({ feedLink });
        if (!feed_details) throw createError.NotFound("feed Not found");

        const newsData = await newsModel.find({ feedid: feed_details._id });
        console.log(newsData)

        res.send("done");
    } catch (error) {
        console.log(error)
    }
}