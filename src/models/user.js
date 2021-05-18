const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    }

})

userSchema.pre('save', async function (next) {
    const user = this;

    if(user.isModified('password')) { //when user created and when user changes password
        user.password = await bcrypt.hash(user.password,8);
    }

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;