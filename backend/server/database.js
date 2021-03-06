const mongoose = require('mongoose');

// const URI = 'mongodb://localhost/data-licores';

// const URI2 = 'mongodb+srv://MongoUser:<Password>@cluster0.wbaqo.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(process.env.MONGO_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(console.log('DB is connected'))
    .catch(err => console.error(err))

module.exports = mongoose;