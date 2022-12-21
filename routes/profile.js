const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongodb= require('mongodb');
const fs = require('fs');
const pdfparse= require('pdf-parse');
//
const router = express.Router();
const loginInfo = require('./schema');


router.get('/teacher', (req, res) => {
    const params = { 
        user: req.user.name,
        skill: req.user.skill,
        college: req.user.college, 
        phone: req.user.phone,
        email: req.user.email,
        expressMessage: req.flash('success') }
    res.render('teacherProfile.pug', params);
});


router.use(bodyParser.urlencoded({extended:false}))



const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';

MongoClient.connect(url,{
    useUnifiedTopology:true, useNewUrlParser:true   
},(err,client)=>{
    if(err) return console.log(err);

    db = client.db('Files');
})


module.exports = router;