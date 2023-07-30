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

const {getID,getAge,getName,getEmail,addUser,getUser} = require("./db");
const { name } = require('ejs');

///////////////////  GET   ////////////////////////////////////////////////////////
app.get("/", (req, res) => {
    let iduser;
    iduser=req.session.ID;
    res.render("home",{username:req.session.username,name:req.session.name,
        age:req.session.age,email:req.session.email,error1:req.session.error1,error2:req.session.error2,iduser:iduser});
});

app.get("/login", (req, res) => {
    let iduser;
    iduser=req.session.ID;
    res.render("login",{username:req.session.username,name:req.session.name,
        age:req.session.age,email:req.session.email,error1:req.session.error1,error2:req.session.error2,iduser:iduser});
});
app.get("/register", (req, res) => {
    let iduser;
    iduser=req.session.ID;
    res.render("register",{username:req.session.username,name:req.session.name,
        age:req.session.age,email:req.session.email,error1:req.session.error1,error2:req.session.error2,iduser:iduser});
});

app.get("/books_review", (req, res) => {
    let iduser;
    iduser=req.session.ID;
    res.render("books_review",{username:req.session.username,name:req.session.name,
        age:req.session.age,email:req.session.email,error1:req.session.error1,error2:req.session.error2,iduser:iduser});
});

app.get("/articles_review", (req, res) => {
    let iduser;
    iduser=req.session.ID;
    res.render("articles_review",{username:req.session.username,name:req.session.name,
        age:req.session.age,email:req.session.email,error1:req.session.error1,error2:req.session.error2,iduser:iduser});
});

app.get("/films_review", (req, res) => {
    let iduser;
    iduser=req.session.ID;
    res.render("films_review",{username:req.session.username,name:req.session.name,
        age:req.session.age,email:req.session.email,error1:req.session.error1,error2:req.session.error2,iduser:iduser});
});

app.get("/profile", (req, res) => {
    let iduser;
    iduser=req.session.ID;
    res.render("profile",{username:req.session.username,name:req.session.name,
        age:req.session.age,email:req.session.email,error1:req.session.error1,error2:req.session.error2,iduser:iduser});
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
        await db.addUser(req.body.username,cryp_mdp,req.body.email,req.body.name,req.body.age);  // ajoute l'utilisateur à la bdd
        req.session.username = req.body.username
        req.session.email = req.body.email
        req.session.name = req.body.name
        req.session.age = req.body.age
        req.session.ID = await getID(req.session.username);
        res.redirect("/");
    }
});

app.post("/login",async (req,res)=>{ // async pour dire que fonction est asynchrone
    req.session.error2 = "";
    await db.getUser(req.body.username).then(user=>{ // "await" pour dire que on attend "getUser" pour continuer
        if(user){
            bcrypt.compare(req.body.password,user.password).then(async passwordCorrect =>{
                if(passwordCorrect){
                    req.session.username = req.body.username;
                    req.session.ID = await getID(req.session.username);
                    req.session.age = await getAge(req.session.username);
                    req.session.name = await getName(req.session.username);
                    req.session.email = await getEmail(req.session.username);
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