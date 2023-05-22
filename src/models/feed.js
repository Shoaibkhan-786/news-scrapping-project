const { Schema, model } = require('mongoose');

const feedSchema = Schema({
    feedName: {
        type: String
    },
    feedLink: {
        type: String
    },
    channelid: {
        type: Schema.Types.ObjectId,
        ref: "channelModel"
    }
    
}, { versionKey: false });


module.exports = feedModel = model('feedModel', feedSchema);