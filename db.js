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
    password:{
        type:DataTypes.TEXT,
        unique:true,
        allowNull:false
    },
    email:{
        type:DataTypes.TEXT,
        unique:true,
        allowNull:false
    },
    administrator:{
        type:DataTypes.FLOAT,
        defaultValue:false
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
    addUser: function addUser(username, password, email) {
        return User.create({
            username: username,
            password: password,
            email: email
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
            console.log("Unable to rretrive money of " + username + ": " + err)
            return false
        })
    }
    
}