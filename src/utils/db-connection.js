const { connect, connection, set} = require('mongoose');

const connectDb = () => {
    set('strictQuery', true)
    return connect('mongodb://localhost:27017/news-scrapping')
}

connection.on("connected", () => {
    console.log('database connected')
})

module.exports = connectDb