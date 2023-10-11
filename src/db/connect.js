const mongoose = require('mongoose');

function connectDB(uri) {
    mongoose.connect(uri);
    mongoose.connection.on('error', console.error);
    mongoose.connection.once('open', () => console.log('Database connected'));
}

module.exports = { connectDB };


