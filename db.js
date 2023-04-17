const mysql = require('mysql')
require('dotenv').config();


const pool = mysql.createPool({user: process.env.USER, password: process.env.PASS, database: process.env.DB, host: process.env.HOST});

let db = {};

db.createUser = function (nama, email, password) {
    return new Promise((resolve, rejected) => {
        pool.query("INSERT INTO user (nama,email,password) VALUES (?,?,?)", [
            nama, email, password
        ], function (error, result) {
            if (error) {
                return rejected(error);
            } else {
                return resolve(result);
            }
        })
    });
}
db.getUserByEmail = function(email){
    return new Promise((resolve,rejected)=>{
        pool.query("SELECT * FROM user WHERE email=?",[email], function(error,users){
            if(error){
                return rejected(error);
            } else {
                return resolve(users[0]);
            }
        });
    });
}
module.exports = db;
