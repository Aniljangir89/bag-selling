const express = require('express');
const router = express.Router();  // Correctly create the router instance
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

// Define your routes
router.post('/create', upload.single("Image"), async (req, res) => {
   try {
       // Destructure the fields from req.body
       let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

       // Ensure all required fields are present, add your own validation if needed
       if (!name || !price) {
           return res.status(400).json({ message: "Name and price are required fields." });
       }

       // Create a new product in the database
       let product = await productModel.create({
           Image: req.file.buffer,  // Assuming image is uploaded as a buffer
           name,
           price,
           discount,
           panelcolor,
           bgcolor,
           textcolor
       });
       req.flash('success','product added in shop.')
       // Send the product as a response
       res.redirect('/owners/admin') // HTTP status 201 for created resource
   } catch (err) {
       // Better error handling with status code
       console.error(err);
       res.status(500).json({ message: "Server error, please try again later." });
   }
});

// Export the router correctly
module.exports = router;  // Export the router instance, not an object
