const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your User Name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your Email Address "],
        trim: true,
        unique: true
    },
    role: {
        type: Number,
        required: [true, "Please enter your User Name"],
        default: 0   //0=user , 1=admin
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"],
        trim: true
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/student90844/image/upload/v1614197410/avata_t32dqm.jpg",

    }
  
}, {
        timestamps: true
});

module.exports = mongoose.model("Users", userSchema)