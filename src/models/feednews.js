const { Schema, model } = require('mongoose');

const newsSchema = Schema({
    title: {
        type: String
    },
    link: {
        type: String
    },
    shortdescription: {
        type: String
    },
    publishedDate: {
        type: Date
    },
    longdescription: {
        type: String
    },
    feedid: {
        type: Schema.Types.ObjectId,
        ref: "feedModel"
    },
    channelid: {
        type: Schema.Types.ObjectId,
        ref: "channelModel"
    }
    
}, { versionKey: false });


module.exports = newsModel = model('newsModel', newsSchema);