const express = require('express');
const connectToDB= require("./config/connectToDB.js")
const app = express();
const cookieparser = require('cookie-parser');
const path = require('path');
const  dotenv=require('dotenv').config();
const flash=require('connect-flash');
const expressSession=require('express-session');

const ownersrouter = require('./routes/ownersrouter');
const usersrouter = require('./routes/usersrouter');
const productsrouter = require('./routes/productsrouter');
const index=require('./routes/index.js');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.EXPRESS_SESSION_SECRET,
}));
app.use(flash());
// Use the routers at appropriate paths
app.use('/',index);
app.use('/owners', ownersrouter);  // Make sure this line is correct
app.use('/users', usersrouter);
app.use('/products', productsrouter);

app.listen(3000, async () => {
    await connectToDB();
    console.log('Server is running on http://localhost:3000');
});
