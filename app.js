const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const path = require('path');
const fileupload = require("express-fileupload");

// *******************************************************************************************************************

const docRouter = require("./router/doctor");
const hospRouter = require("./router/hospital");
const patRouter = require("./router/patient");

// *******************************************************************************************************************

const docSchema = require("./model/doctor")
const hospSchema = require("./model/hospital")
const patSchema = require("./model/patient")

// *******************************************************************************************************************

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(fileupload());

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


app.get("/logreg", (req, res) => {
    res.render("logreg")
})

app.post("/login", (req, res) => {
    if(req.body.type == "doctor"){
        docSchema.find({phone: req.body.mobile, password: req.body.password})
        .then(ret => {
            if(ret._id){
                session=req.session;
                session.userid=ret._id;
            }else{
                res.redirect("/logreg")
            }
        }).catch(err => {
            console.log(err)
            res.redirect("/")
        })
    }else if(req.body.type == "patient"){
        patSchema.find({phone: req.body.mobile, password: req.body.password})
        .then(ret => {
            if(ret._id){
                session=req.session;
                session.userid=ret._id;
            }else{
                res.redirect("/logreg")
            }
        }).catch(err => {
            console.log(err)
            res.redirect("/")
        })
    }else if(req.body.type == "hospital"){
        hospSchema.find({phone: req.body.mobile, password: req.body.password})
        .then(ret => {
            if(ret._id){
                session=req.session;
                session.userid=ret._id;
            }else{
                res.redirect("/logreg")
            }
        }).catch(err => {
            console.log(err)
            res.redirect("/")
        })
    }else{
        res.redirect("/logreg")
    }
})

app.post("/register", (req, res) => {
    if(req.body.type == "doctor"){
        console.log(req.files)
        // docSchema.create({
            
        // }).then(item => {
        //     session=req.session;
        //     session.userid=item._id;
        //     res.redirect("/doctor")
        // }).catch(err => {
        //     console.log(err)
        //     res.redirect("/")
        // })
    }else if(req.body.type == "patient"){
        patSchema.create({
            
        }).then(item => {
            session=req.session;
            session.userid=item._id;
            res.redirect("/patient")
        }).catch(err => {
            console.log(err)
            res.redirect("/")
        })
    }else if(req.body.type == "hospital"){
        hospSchema.create({
            
        }).then(item => {
            session=req.session;
            session.userid=item._id;
            res.redirect("/hospital")
        }).catch(err => {
            console.log(err)
            res.redirect("/")
        })
    }else{
        res.redirect("/logreg?register")
    }
})



app.use('/doctor', docRouter);
app.use('/hospital', hospRouter);
app.use('/patient', patRouter);

// *******************************************************************************************************************

app.listen(8000);