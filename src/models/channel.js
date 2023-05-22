const { Schema, model } = require('mongoose');

const channelSchema = Schema({
    channel_name: {
        type: String
    },
    link: {
        type: String
    },
    
}, { versionKey: false });


module.exports = channelModel = model('channelModel', channelSchema);