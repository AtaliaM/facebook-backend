const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('./post');

//sub schemas//
const myFollowers = mongoose.Schema({
    userId: {
        type: String,
    }
}, { _id : false });

const usersIFollow = mongoose.Schema({
    userId: {
        type: String,
    }
}, { _id : false });

//user schema//

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true
    },
    lastName: {
        type: String,
        require: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("age must be a positive number")
            }
        }
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("password cannot contain 'password'")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    path: {
        type: String,
    },
    avatar: {
        type: Buffer
    },
    myFollowers: [myFollowers],
    usersIFollow: [usersIFollow]

})


userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () { 
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismyawesomefacebookapp');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login");
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
        throw new Error("Unable to login");
    }

    return user;
}

//hash the plain text password before saving//
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) { //when user created and when user changes password
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

//deletes user's posts when user is removed//
userSchema.pre('remove', async function (next) {
    const user = this;
    await Post.deleteMany({ owner: user._id });

    next();
})


const User = mongoose.model('User', userSchema);

module.exports = User;