const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 8);
    const user = await User.create({ email, password: hash });
    res.json({ message: 'User registered', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
};