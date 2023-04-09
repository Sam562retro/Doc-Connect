const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const path = require('path');
const fileupload = require("express-fileupload");
const fs= require("fs");
const randomstring = require("randomstring");

const http = require('http');
const server = http.createServer(app);

const socketIo = require('socket.io');
const io = new socketIo.Server(server);

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

const connection = () => {
    mongoose.connect('mongodb+srv://gsoham562:O3tkapzWXLA7bBBB@docconnect.t2ej7t6.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected With Mongo DB');
};

connection();


app.use(cookieParser());
app.use(fileupload());
var session;
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
        res.redirect('/logreg')
    }
})

app.use('/hospital', (req,res,next) => {
    session = req.session;
    if(session.userid){
        res.locals.userSession = true;
        next()
    }else{
        res.redirect('/logreg')
    }
})

app.use('/patient', (req,res,next) => {
    session = req.session;
    if(session.userid){
        res.locals.userSession = true;
        next()
    }else{
        res.redirect('/logreg')
    }
})

// *******************************************************************************************************************

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/logreg", (req, res) => {
    res.render("logreg")
})

app.post("/login", async (req, res) => {
    if(req.body.type == "doctor"){
        await docSchema.find({phone: req.body.mobile, password: req.body.password})
        .then(ret => {
            if(ret[0]._id){
                session=req.session;
                session.userid=ret[0]._id;
                res.redirect("/doctor")
            }else{
                res.redirect("/logreg")
            }
        }).catch(err => {
            console.log(err)
            res.redirect("/logreg")
        })
    }else if(req.body.type == "patient"){
        await patSchema.find({phone: req.body.mobile, password: req.body.password})
        .then(ret => {
            if(ret[0]._id){
                session=req.session;
                session.userid=ret[0]._id;
                res.redirect("/patient")
            }else{
                res.redirect("/logreg")
            }
        }).catch(err => {
            console.log(err)
            res.redirect("/logreg")
        })
    }else if(req.body.type == "hospital"){
        await hospSchema.find({phone: req.body.mobile, password: req.body.password})
        .then(ret => {
            if(ret[0]._id){
                session=req.session;
                session.userid=ret[0]._id;
                res.redirect("/hospital")
            }else{
                res.redirect("/logreg")
            }
        }).catch(err => {
            console.log(err)
            res.redirect("/logreg")
        })
    }else{
        res.redirect("/logreg")
    }
})

app.post("/register", async (req, res) => {
    if(req.body.type == "doctor"){
        var obj = { 
            name : req.body.name, 
            password : req.body.password,
            phone : req.body.mobile,
            email : req.body.email,
            location: [req.body.latitude,req.body.longitude],
            fare : req.body.fare
        }

        const fileName = randomstring.generate() + req.files.mbbs.name;
        const filePath = __dirname + '/public/doctor-proofs/' + fileName;
        req.files.mbbs.mv(filePath).catch(err=> (console.log(err)))
        obj.mbbs = `/doctor-proofs/${fileName}`;

        const fileName2 = randomstring.generate() + req.files.mdms.name;
        const filePath2 = __dirname + '/public/doctor-proofs/' + fileName;
        req.files.mdms.mv(filePath2).catch(err=> (console.log(err)))
        obj.mdms = `/doctor-proofs/${fileName2}`;

        await docSchema.create(obj).then(item => {
            session=req.session;
            session.userid=item._id;
            res.redirect("/doctor");
        }).catch(err => {
            console.log(err)
            res.redirect("/logreg?register")
        })

    }else if(req.body.type == "patient"){
        await patSchema.create({
            name: req.body.name,
            password:req.body.password,
            phone:req.body.mobile,
            age:req.body.age,
            gender:req.body.gender,
            location: [req.body.latitude,req.body.longitude]
        }).then(item => {
            session=req.session;
            session.userid=item._id;
            res.redirect("/patient")
        }).catch(err => {
            console.log(err)
            res.redirect("/logreg?register")
        })

    }else if(req.body.type == "hospital"){
        var obj = { 
            name : req.body.name, 
            password : req.body.password,
            phone : req.body.mobile,
            email : req.body.email,
            roomData : req.body.roomdata,
            address : req.body.address,
            fare : req.body.fare
        }

        const fileName = randomstring.generate() + req.files.img.name;
        const filePath = __dirname + '/public/hospital-images/' + fileName;
        req.files.img.mv(filePath).catch(err=> (console.log(err)))
        obj.image = `/hospital-images/` + fileName;

        await hospSchema.create(obj).then(item => {
            session=req.session;
            session.userid=item._id;
            res.redirect("/hospital")
        }).catch(err => {
            console.log(err)
            res.redirect("/logreg?register")
        })
    }else{
        res.redirect("/logreg?register")
    }
})

app.get("/logout", (req, res) => {
    session = req.session;
    if(session.userid){
        req.session.destroy();
    }
    res.redirect("/logreg")
})

// *******************************************************************************************************************


io.on('connection', (socket) => {
      socket.on('roomDetails', (msg) => {
        socket.join(msg.roomId);
      })

      socket.on('msg', (msg) => {
        patSchema.findById(msg.patId).then(pat => {
            var x = pat.chat;
            x.push([msg.user, msg.data])
            patSchema.findByIdAndUpdate(msg.patId, {chat : x}).catch(err => {console.log(err)})
        }).catch(err => console.log(err))

        io.to(msg.roomId).emit("msgReturn", {user: msg.user, data : msg.data});
      })
});


app.get("/doctor/patients/chat/:id", (req, res) => {
    patSchema.findById(req.params.id).then(pat => {
        res.render("dashboard", {type: "doctor", subType: "chat", docId: req.session.userid, patId : req.params.id, chatHis: pat.chat })
    }).catch(err => {console.log(err)})
})

app.get("/patient/chat", async (req, res) => {
    await patSchema.findById(req.session.userid).then(async pat => {
        await docSchema.findById(pat.doc).then(doc => {
            res.render("dashboard", {type: "patient", subType: "chat", patId: req.session.userid, docId : doc._id, chatHis : pat.chat})
        }).catch(err => {console.log(err)})
    }).catch(err => {console.log(err)})
})

// *******************************************************************************************************************

app.use('/doctor', docRouter);
app.use('/hospital', hospRouter);
app.use('/patient', patRouter);

// *******************************************************************************************************************

server.listen(8000);