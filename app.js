const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const path = require('path')

// *******************************************************************************************************************

const docRouter = require("./router/doctor");
const hospRouter = require("./router/hospital");
const patRouter = require("./router/patient");

// *******************************************************************************************************************

app.use('/', express.static(path.join(__dirname, 'public')))


const connection = () => {
    mongoose.connect('mongodb+srv://gsoham562:O3tkapzWXLA7bBBB@docconnect.t2ej7t6.mongodb.net/?retryWrites=true&w=majority', {
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

app.use('/doctor', (req,res,next) => {
    session = req.session;
    if(session.userid){
        res.locals.userSession = true;
        next()
    }else{
        res.redirect('/login')
    }
})

app.use('/hospital', (req,res,next) => {
    session = req.session;
    if(session.userid){
        res.locals.userSession = true;
        next()
    }else{
        res.redirect('/login')
    }
})

app.use('/patient', (req,res,next) => {
    session = req.session;
    if(session.userid){
        res.locals.userSession = true;
        next()
    }else{
        res.redirect('/login')
    }
})

// *******************************************************************************************************************

app.get("/", (req, res) => {
    res.render("home");
})


app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register")

app.post("/login")

app.post("/register")


app.use('/doctor', docRouter);
app.use('/hospital', hospRouter);
app.use('/patient', patRouter);

// *******************************************************************************************************************

app.listen(8000);