const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, enum: ['individual', 'company'], default: 'individual' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
