const User = require("./modal");

// Register user
const registerUser = async (req, res) => {
    const { name, email, phoneNumber } = req.body;

    try {
        const existUser = await User.findOne({ phoneNumber });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "User already spin the wheel",
            });
        }

        const user = await User.create({
            name,
            email,
            phoneNumber,
        });

        await user.save();
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error, 
        })        
    }
};

const updateUser = async (req, res) => {
    const { email, dishName, isWin } = req.body;
    
    try {
        const user = await User.findOneAndUpdate(
            { email },
            { dishName, isWin },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};

module.exports = { registerUser, updateUser };