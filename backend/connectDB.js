const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://reachus:iyJsKj2LfntdTCwc@momonation.ckkk5.mongodb.net/?retryWrites=true&w=majority&appName=momonation"); 
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    };
};

module.exports = connectDB;