const bcrypt = require('bcryptjs');
const User = require('../../infrastructure/models/user');

const { generateAccessToken, generateRefreshToken } = require('../../application/services/user/jwt.service');

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
    if (!phone || !password) return res.status(400).json({ message: 'Phone and password are required.' });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const payload = { id: user._id.toString(), phone: user.phone, type: user.type };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set HttpOnly cookie (also okay — main process can read Set-Cookie header or use returned token)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: 'Login successful.',
      token: accessToken,
      refreshToken, // <-- optional: helpful for main process to set cookie
      user: {
        _id: user._id,
        phone: user.phone,
        type: user.type,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
