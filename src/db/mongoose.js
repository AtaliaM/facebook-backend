const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/facebook-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

const me = new User({
    name: 'Atalia',
    age: 30
})

me.save()