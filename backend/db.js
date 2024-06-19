const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { DB_URI } = require("./config");

mongoose.connect(DB_URI);

// schema for users
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 6,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        // unique: true, password dont really need to be unique
        trim: true,
        minlength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
})

// Static method to generate a hash from plain text
UserSchema.statics.createHash = async function (plainTextPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltRounds);
};

// Static method to validate password
UserSchema.statics.validatePassword = async function (plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// models for users (using user schema defined above)
const User = mongoose.model('User', UserSchema);


const AccountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    }
})

const Account = mongoose.model('Account', AccountSchema);

module.exports = {
    User,
    Account
}