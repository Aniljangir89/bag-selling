const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY environment variable is not defined');
    }
    return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);
};

module.exports.generateToken = generateToken;
