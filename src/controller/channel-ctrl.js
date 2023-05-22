const channelModel = require('../models/channel')

exports.insertChannel = async (req,res) => {
    try {
        const { channel_name, link } = req.body;
        const channel = await channelModel.find({channel_name,link})
        
        if(channel.length == 0) {
            await channelModel.create({channel_name, link})
            res.send('channel inserted')
        }
    } catch (error) {
        console.log(error)
    }
}







