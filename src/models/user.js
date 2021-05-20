const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
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
        trim:true,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error("password cannot contain 'password'")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]

})

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () { // instance method
    const user = this;
    const token = jwt.sign({_id : user._id.toString()}, 'thisismyawesomefacebookapp');

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async (email,password) => { //model method
    const user = await User.findOne({email});

    if(!user) {
        throw new Error("Unable to login");
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if(!isMatched) {
        throw new Error("Unable to login");
    }

    return user;
}

//hash the plain text password before saving//
userSchema.pre('save', async function (next) {
    const user = this;

    if(user.isModified('password')) { //when user created and when user changes password
        user.password = await bcrypt.hash(user.password,8);
    }

    next();
})


const User = mongoose.model('User', userSchema);

module.exports = User;