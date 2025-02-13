const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');
const productModel=require('../models/product-model');
module.exports.registerUser = async (req, res) => {
  const { email, password, fullname } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      req.flash("error", "You already have an account, please login.");
      return res.redirect('/'); // Redirect to login page if the user already exists
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const user = await userModel.create({
      email,
      password: hashedPassword,
      fullname,
    });

    // Store user data in session
    req.session.user = user;

    // Generate a token and set it in a cookie
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });

    // Flash success message and redirect to the shop page
    req.flash("success", "Welcome to our E-com Web.");
    res.redirect('/shop');  // Redirect to shop after successful registration
  } catch (err) {
    console.error('Error during registration:', err);
    req.flash("error", "Something went wrong!");
    res.redirect('/');  // Redirect to the login page in case of error
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Please create an account first.");
      return res.redirect('/'); // If user doesn't exist, redirect to login page
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Generate a token and set it in a cookie
      const token = generateToken(user);
      res.cookie('token', token, { httpOnly: true });

      // Store user data in session
      req.session.user = user;

      req.flash("success", "You have logged in successfully.");
      return res.redirect('/shop');  // Redirect to the shop page after successful login
    } else {
     
      req.flash("error", "Invalid password.");
      return res.redirect('/'); // If the password is invalid, redirect to login
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.logout = (req, res) => {
  // Clear the session and token
  req.session.destroy((err) => {
    if (err) {
      console.log('Error destroying session:', err);
    }
  });

  res.clearCookie('token'); // Clear the token cookie
  res.redirect('/'); // Redirect to the homepage or login page
};

module.exports.UserCart = async (req, res) => {

  try {
      const userId = req.user._id; // Get the logged-in user's ID
      const { productId, quantity } = req.body; // Get productId and quantity from request body
    
      // Find the product by productId
      const product = await productModel.findById(productId);
      if (!product) {
          return res.status(404).send('Product not found');
      }

      // Prepare product data for the cart
      const cartItem = {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity || 1, // Default quantity to 1 if not provided
          totalPrice: product.price * (quantity || 1),
      };

      // Find the user and update their cart
      const user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Add the product to the user's cart
      user.cart.push(cartItem);
      await user.save();
      req.flash('success','item added successfully');
      res.redirect('/shop')
  } catch (error) {
      console.error(error);
      res.status(500).send('Error adding product to cart');
  }
};


module.exports.viewCart= async (req, res) => {
    try {
        // Assuming user is authenticated and stored in req.user
        const userId = req.user._id; 
     
        // Find the user by their ID and populate the cart (this assumes you have a 'cart' array with references to products)
        const user = await userModel.findById(userId).populate('cart.productId');
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Get the cart data for the user
        const cart = user.cart;

        // Calculate the total amount for the cart
        const totalAmount = cart.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);
        console.log(totalAmount);
        // Send the cart data to the cart view (EJS or any other template engine)
        res.render('cart', { cart, totalAmount });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching cart data');
    }
};
