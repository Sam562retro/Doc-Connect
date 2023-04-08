const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const path = require('path')

// *******************************************************************************************************************


app.use('/', express.static(path.join(__dirname, 'public')))


const connection = () => {
    mongoose.connect('mongodb+srv://gsoham562:2g2Yy8yvVNMLYmnU@star-website.e30uxrn.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected With Mongo DB');
};

connection();


app.use(cookieParser());
app.use(sessions({
    secret: "hberbghebghebghekjnvehibvknseigndfv3234567gfdsdfghjshcvq4d5786efdfwuidhy267kjfneve",
    saveUninitialized:true,
    cookie: { maxAge: (1000 * 60 * 60 * 24) },
    resave: true 
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));


// *******************************************************************************************************************



// *******************************************************************************************************************



// *******************************************************************************************************************

app.listen(8000);