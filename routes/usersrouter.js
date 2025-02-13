const express = require('express');
const router = express.Router();  // Correctly create the router instance
const {registerUser,loginUser,logout,profile ,UserCart,viewCart}=require('../controllers/authController.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');


router.get('/cart',isLoggedIn, (req, res) => {
    res.render('cart');
});

router.post('/register',registerUser);

router.post('/login',loginUser);

router.post('/cart',isLoggedIn,UserCart);

router.get('/mycart',isLoggedIn,viewCart)
router.get('/logout',logout);


module.exports = router;  
