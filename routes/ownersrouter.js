const express = require('express');
const router = express.Router();
const ownerModel=require('../models/owner-model');
const bcrypt=require('bcrypt');
if (process.env.NODE_ENV === 'development') {
    console.log("executed");
    
    // Handle POST request for login
    if (process.env.NODE_ENV === 'development') {
        
    
        // Handle POST request for creating a new account
        router.post('/create', async function (req, res) {
            try {
                const { email, password} = req.body; // Include any other details needed for the owner
    
              
    
                // Check if an owner already exists with the provided email
                const existingOwner = await ownerModel.findOne({ where: { email } });
    
                if (existingOwner) {
                    return res.status(400).json({ error: 'Owner with this email already exists' });
                }
    
                // Hash the password before saving it to the database
                const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of hashing
    
                // Create a new owner record in the database
                const newOwner = await ownerModel.create({
                    email,
                    password: hashedPassword,
                    // You can add other fields if needed
                });
    
                // Respond with the newly created owner's data (except password)
               
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to create account' });
            }
        });
    }
    
}

router.get('/',function(req,res){
    res.render('owner-login')
})
// Define the routes
router.get('/admin', (req, res) => {
    const errorMessages = req.flash('error');
    const successMessages = req.flash('success');
    
    res.render('createproducts', {
        messages: {
            error: errorMessages,
            success: successMessages
        }
    });
});

// Export the router
module.exports = router;
