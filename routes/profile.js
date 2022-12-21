// const express = require("express");
// const router = express.Router();
// // const bodyparser = require("body-parser");
// const loginInfo = require('./schema');


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

// router.get('/student', (req, res) => {
//     const params = { 
//         user: req.user.name, 
//         skill: req.user.skill, 
//         college: req.user.college
//     };
//     res.render('studentProfile.pug', params)
// });
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

var str1 ="",str2="";


// router.post('/profile/student/uploadfile',upload.single('myFile'),(req,res)=>{
//     // console.log(req.file);

//     // if( req.file.mimetype=='application/pdf' ){
//     //     const pdffile = fs.readFileSync(req.file.path);

//     //     pdfparse(pdffile).then(function(data){
//     //         console.log(data.text);
//     //     })
//     // }

//     if( req.file.mimetype=='application/pdf' ){

//         // const pdffile = fs.readFileSync(req.file.path);

//         fs.readFile(req.file.path,function(err,pdffile){
//             if (err) return console.error(err,'line 154');

//             pdfparse(pdffile).then(function(data){
//                 // console.log(data.text);
//                 fs.writeFile('uploads/first.txt',data.text,function(){
//                     // var file = fs.readFileSync('uploads/first.txt');
//                     fs.readFile('uploads/first.txt',function(err,file){
//                         if (err) return console.error(err,'line 161');

                        
//                         var encode_file = file.toString('base64');
        
//                         // define a json object for file
        
//                         var finalFile = {
        
//                             contentType:req.file.mimetype,
//                             path:req.file.path,
//                             image:new Buffer(encode_file,'base64')
                            
//                         };
        
//                         //insert the image to the database
        
//                         db.collection( 'File' ).insertOne(finalFile,(err,result)=>{
//                             // console.log(result);
        
//                             if(err) return console.log(err);
//                             console.log("saved to database1");
        
//                             // res.contentType(finalFile.contentType);
        
//                             res.send("Your file has been uploaded to DataBase");
//                         })
//                     })
    
//                     // ------------------------------------
    
                    
//                 });
//             },()=>{
//                 console.log('Promise rejection from line 196')
//                 res.send("PDF Parsing Error");
//             }) 

//         })
//     }else{
//         var file = fs.readFileSync(req.file.path);
//         // console.log(file);

//         var encode_file = file.toString('base64');

//         // define a json object for file

//         var finalFile = {

//             contentType:req.file.mimetype,
//             path:req.file.path,
//             image:new Buffer(encode_file,'base64')
            
//         };

//         //insert the image to the database

//         db.collection( 'File' ).insertOne(finalFile,(err,result)=>{
//             // console.log(result);

//             if(err) return console.log(err);

//             console.log("saved to database1");

//             // res.contentType(finalFile.contentType);

//             res.render('studentProfile.pug');
//         })
//     }
// })




module.exports = router;