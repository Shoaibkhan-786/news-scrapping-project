const express = require('express');
const connectDb = require('./utils/db-connection');
const scrapChannel = require('./controller/feed-ctrl');
const indexRouter = require('./route');
const app = express();
app.use(express.json());
app.use(indexRouter);


connectDb()
    .then(() => {
        app.listen(8000, () => {
            console.log('server is up and running on 8000')
        })
    }).catch((err) => {
        console.log(err)
    })
