const {Sequelize,Model,DataType,where, DataTypes, DATE, STRING} = require('sequelize');
const moment = require("moment");
const bcrypt = require("bcrypt"); // servira pour les dates
const Op = Sequelize.Op;// servira pour les recherches
const sequelize = new Sequelize({
    dialect:"sqlite",
    storage:"db.sqlite3"
})
sequelize.sync()

class User extends Model{}


User.init({
    username:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
        primaryKey: true
    },
    name:{
        type:DataTypes.STRING,
        unique:false,
        allowNull:false,
    },
    age:{
        type:DataTypes.INTEGER,
        unique:false,
        allowNull:false,
    },
    password:{
        type:DataTypes.TEXT,
        unique:true,
        allowNull:false
    },
    email:{
        type:DataTypes.TEXT,
        unique:true,
        allowNull:true
    },
    administrator:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    image:{
        type:DataTypes.TEXT,
        allowNull:true
    }
},{sequelize,modelName:'User'});


module.exports= {
    getUser: function getUser(username) {
        return User.findOne({where: {username: username}})
            .then(user => {
                if (user) {
                    return user;
                } else {
                    return false;
                }
            });
    },
    addUser: function addUser(username, password, email, name, age, image) {
        return User.create({
            username: username,
            password: password,
            email: email,
            name: name,
            age: age,
            image:image
        }).then(user => {
            console.log("User added : " + user);
            return true;
        }).catch(err => {
            console.log("User already exists " + err);
            return false;
        })

    },
    getID: async function getID(username) {
        return User.findOne({where: {username: username}, attributes: ["id"]}).then(mon => {
            if (mon) {
                return mon.dataValues.id
            } else {
                return false
            }
        }).catch(err => {
            return false
        })
    },
    getAge: async function getAge(username) {
        return User.findOne({where: {username: username}, attributes: ["age"]}).then(mon => {
            if (mon) {
                return mon.dataValues.age
            } else {
                return false
            }
        }).catch(err => {
            return false
        })
    },
    getName: async function getName(username) {
        return User.findOne({where: {username: username}, attributes: ["name"]}).then(mon => {
            if (mon) {
                return mon.dataValues.name
            } else {
                return false
            }
        }).catch(err => {
            return false
        })
    },
    getEmail: async function getEmail(username) {
        return User.findOne({where: {username: username}, attributes: ["email"]}).then(mon => {
            if (mon) {
                return mon.dataValues.email
            } else {
                return false
            }
        }).catch(err => {
            return false
        })
    },
    getImage: async function getImage(username) {
        return User.findOne({where: {username: username}, attributes: ["image"]}).then(mon => {
            if (mon) {
                return mon.dataValues.image
            } else {
                return false
            }
        }).catch(err => {
            return false
        })
    },
    checkKey:async function checkKey(iD,key) {
        const key2 = iD.toString()+"-"+key+".jpg";
        return Products.findOne({where: {image:key2}})
            .then(k => {
                if (k) {
                    return true;
                } else {
                    return false;
                }
            });
    }
    
}