const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:  {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phoneNumber:  {
        type: String,
        unique: true,
        required: true,
    },
    dishName:  {
        type: String,
    },
    isWin:  {
        type: Boolean,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;