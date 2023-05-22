const channelModel = require('../models/channel')
const feedModel = require('../models/feed')
const newsModel = require('../models/feednews')
const axios = require('axios')
const cherrio = require('cheerio')
const { parse } = require('rss-to-json');
const puppeteer = require('puppeteer');
const fs = require('fs/promises')
const { feedNameObj } = require('../utils/quert-selector');


exports.scrapChannel = async (req, res) => {
    try {
        const channels = await channelModel.find();

        for (let channel of channels) {
            const response = await axios.get(channel.link);
            const $ = cherrio.load(response.data);
            const feeds = $('.links li').toArray();

            //  get rss categories
            const newRss = [];
            feeds.forEach((feed) => {
                let feedLink = $(feed).find($('a')).attr('href');
                const feedName = $(feed).find($('a')).text();
                feedLink = channel.link.concat(feedLink.slice(4));
                newRss.push({ feedName, feedLink, channelid: channel._id })
            })

            // - filterout rss categories to insert new ones
            const oldRss = await feedModel.find();

            if (oldRss.length != 0) {

                const oldRssLinks = []
                oldRss.forEach((link) => {
                    oldRssLinks.push(link.feedLink)
                })
                for (let data of newRss) {
                    if (!oldRssLinks.includes(data.feedLink)) {
                        await feedModel.create(data)
                    }
                }
            } else {
                for (let data of newRss) {
                    await feedModel.create(data)
                }
            }


            // - go through each rss category 
            const allFeeds = await feedModel.find();

            //  xml -> Json -> news metadata
            let rssData = []
            for (let feed of allFeeds) {
                const metadata = await parse(feed.feedLink);
                metadata['feedid'] = feed._id
                rssData.push(metadata)      
            }

            // - visit news links using puppeteer
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();

            try {
                let i = 0;
                for (const data of rssData) {
                    if (data.items.length != 0) {
                        for (const item of data.items) {
                            let feedTitle = data.title.split('|')[1].toLowerCase().replace(/[^a-z]/g, '');
                            if (feedNameObj.hasOwnProperty(feedTitle)) {

                                let selector = feedNameObj[feedTitle]
                                await page.goto(item.link)
                                const textContent = await page.evaluate((selector) => document.querySelector(selector)?.textContent, selector)
                                console.log(`Long Description is--------> ${i++}:${textContent}`);
                                // console.log(data.feedid)

                                await newsModel.create({
                                    title: item.title,
                                    link: item.link,
                                    shortdescription: `${item.description.replaceAll(/<[^>]*>/ig, "").trim()}`,
                                    longdescription: textContent,
                                    publishedDate: item.published,
                                    channelid: channel._id,
                                    feedid: data.feedid
                                });
                            }
                        }
                    }
                }
                console.log(i)
                res.send('scrapping start');
            } catch (error) {
                console.log(error)
            }
        }
    } catch (error) {
        console.log(error)
    }
}