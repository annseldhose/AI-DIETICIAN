const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    healthProfile: {
        age: Number,
        gender: String,
        weight: Number,
        height: Number,
        dietType: String,
        disease: String
    },
    dietPlan: {
        breakfast: String,  // Change to String
        lunch: String,      // Change to String
        dinner: String,     // Change to String
        snacks: String,     // Change to String
        snack2: String      // Add the second snack if needed
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
