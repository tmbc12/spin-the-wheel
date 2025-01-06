const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const { registerUser, updateUser } = require("./controller");
const connectDB = require("./connectDB");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: 'https://spin-the-wheel-alpha.vercel.app/',
    credentials: true
}))

app.post("/register", registerUser);
app.post("/update", updateUser);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
}); 