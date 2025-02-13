const express=require('express');
const router=express.Router();
const isLoggedIn=require('../middlewares/isLoggedIn');
const productModel=require('../models/product-model');

router.get('/', (req, res) => {
    const errorMessages = req.flash('error');
    const successMessages = req.flash('success');
    
    res.render('index', {
        messages: {
            error: errorMessages,
            success: successMessages
        }
    });
});


router.get('/login',(req,res)=>{
     const errorMessages = req.flash('error');
    const successMessages = req.flash('success');
    
    res.render('login', {
        messages: {
            error: errorMessages,
            success: successMessages
        }
    });
})
router.get('/shop', async (req, res) => {
    try {
        let products = await productModel.find();

        // Convert each image to Base64
        products = products.map(product => {
            if (product.Image && Buffer.isBuffer(product.Image)) {
                product.imageBase64 = product.Image.toString('base64');
            } else {
                product.imageBase64 = null;  // If no image is available
            }
            return product;
        });

        // Access the user from the session (if authenticated)
        const user = req.session.user;  // Assuming you stored user data in session
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
    
        // Pass flash messages to the shop route
        res.locals.messages = {
            error: errorMessages,
            success: successMessages
        };
        // Pass both products and user to the view
        res.render('shop', { products, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching products');
    }
});

router.get('/profile', isLoggedIn, (req, res) => {
    // Get flash messages
    const errorMessages = req.flash('error');
    const successMessages = req.flash('success');

    // Pass flash messages to the shop route
    res.locals.messages = {
        error: errorMessages,
        success: successMessages
    };

    // Redirect to the shop page
    res.redirect('/shop');
});

module.exports=router;