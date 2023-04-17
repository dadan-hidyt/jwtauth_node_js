const express = require('express');
const db = require('./db');
const expresRouter = express.Router();
const {compareSync, hashSync, genSaltSync} = require('bcrypt')

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
expresRouter.use(cookieParser())
expresRouter.post('/daftar', async function (req, res) {
    const nama = req.body.nama;
    const email = req.body.email;
    const salt = genSaltSync(10);
    const password = hashSync(req.body.password, salt);
    db.createUser(nama, email, password).then(function (success) {
        res.status(200).json({error: false, status: "OK"})
    }).catch(function (error) {
        res.status(500).json({error: true, errors: error})
    });


});

expresRouter.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.getUserByEmail(email).then((user) => {
        if (user) {
            const passwordCheck = compareSync(password, user.password);

            if (passwordCheck) {
                let jsonToken = jwt.sign({
                    user: user
                }, process.env.SECRET)
                res.status(200).json({
                    token: jsonToken,
                    user: {
                        email: user.email,
                        nama: user.nama
                    }
                })
            } else {
                res.status(200).json({
                    error: true,
                    errors: {
                        email: "Email tidak di temukan atau password salah!"
                    }
                })
            }

        } else {
            res.status(200).json({
                error: true,
                errors: {
                    email: "Email tidak di temukan!"
                }
            })
        }
    }).catch((error) => {
        res.status(500).json({error: true, errors: error})
    })

})

expresRouter.get('/profile', function(req,res){
    const token = req.query.token;
    jwt.verify(token,process.env.SECRET, function(err,data){
        if(err){
            res.status(500).json({error: true, errors: "Akses Denied! Anda belum login"}) 
        } else {
            res.status(200).json({
                status : "Logedin",
                user : data,
            })
        }
    })
})

module.exports = expresRouter;
