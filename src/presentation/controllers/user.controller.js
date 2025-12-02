const User = require('../../infrastructure/models/user');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { phone, password, type } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone and password are required.' });
        }
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ phone, password: hashedPassword, type: type || 'individual' });
        await user.save();
        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                _id: user._id,
                phone: user.phone,
                type: user.type,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone and password are required.' });
        }
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        res.status(200).json({
            message: 'Login successful.',
            user: {
                _id: user._id,
                phone: user.phone,
                type: user.type,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};