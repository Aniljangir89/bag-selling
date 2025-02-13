const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports = async (req, res, next) => {

  try {
   
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    const user = await userModel.findOne({ email: decoded.email }).select('-password');
    

    if (!user) {
      console.log('User not found');
      req.flash('error', 'User not found');
      return res.redirect('/login');
    }
    req.user = user;
    next();
  } catch (err) {
    console.log('Error during token verification:', err); // Log any errors
    req.flash('error', 'Something went wrong');
    res.redirect('/login');
  }
};
