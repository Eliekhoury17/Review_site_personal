const express = require('express');
const session = require('express-session');
const app = express();
const bcrypt = require("bcrypt");
const https = require("https");
const fs = require("fs");
const bodyParser =require("body-parser");
const multer = require('multer');
app.use(session({
    secret: 'secret-site',
    resave: false,
    saveUninitialized: true,
  }));

app.set("view engine","ejs");
app.set('views','views');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(bodyParser.json());
let db = require("./db")

app.use(express.static('public'));
app.use(bodyParser.json());

const {getID,addUser,getUser} = require("./db");

///////////////////  GET   ////////////////////////////////////////////////////////
app.get("/", (req, res) => {
    iduser=req.session.ID;
    res.render("home",{username:req.session.username});
});

app.get("/login", (req, res) => {
    res.render("login",{username:req.session.username,error2:req.session.error2,error1:req.session.error1});
});
app.get("/register", (req, res) => {
    res.render("register",{username:req.session.username,error1:req.session.error1,error2:req.session.error2});
});


///////////////////  POST   ////////////////////////////////////////////////////////

app.post("/",async (req,res)=>{
    const users = await db.getUser(req.session.username);
});

app.post("/register",async (req,res)=> {
    req.session.error1 = "";
    if (await db.getUser(req.body.username)) { // si le pseudo est déjà dans la bdd -> n'enregistre pas l'utilisateur
        req.session.error1 = "username is already used";
        res.redirect("/register")
    }
    else {
        const salt = bcrypt.genSaltSync(10)
        const cryp_mdp = bcrypt.hashSync(req.body.password, salt) // ache le mdp pour l'enregistrer
        await db.addUser(req.body.username,cryp_mdp,req.body.adresse);  // ajoute l'utilisateur à la bdd
        req.session.username = req.body.username
        req.session.adresse = req.body.adresse
        req.session.ID = await getID(req.session.username);
        res.redirect("/");
    }
});

app.post("/login",async (req,res)=>{ // async pour dire que fonction est asynchrone
    req.session.error2 = "";
    console.log(req.body.username);
    await db.getUser(req.body.username).then(user=>{ // "await" pour dire que on attend "getUser" pour continuer
        if(user){
            bcrypt.compare(req.body.password,user.password).then(async passwordCorrect =>{
                if(passwordCorrect){
                    req.session.username = req.body.username;
                    req.session.ID = await getID(req.session.username);
                    console.log(req.session.money)
                    res.redirect('/');
                }else{
                    req.session.error2 = "Wrong password, try again"
                    res.redirect("/login");
                }
            });
        }
        else{
            req.session.error2 = "This username does not exist"
            res.redirect("/login")
        }
    });
});


https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
}, app).listen(3000);