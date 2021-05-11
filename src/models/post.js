
const mongoose = require('mongoose');


const Post = mongoose.model('Post', {
    postBody: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'   //reference to the user model
    }

})

module.exports = Post