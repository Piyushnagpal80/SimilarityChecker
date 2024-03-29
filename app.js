const express = require("express");
const path = require("path");
const passport = require('passport');
const app = express();
const multer = require('multer');
const pdfparse= require('pdf-parse');
const fs = require('fs');
var session = require('express-session');
var flash = require('connect-flash');
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 5000;
const { ensureAuthenticated, forwardAuthenticated } = require('./routes/auth');
require('./routes/passport')(passport);

//EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//PUG SPECIFIC STUFF
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', forwardAuthenticated, (req, res) => res.render('welcome.pug'));
app.use('/users', require('./routes/users'));
app.use('/profile', ensureAuthenticated, require('./routes/profile'));

app.listen(PORT, console.log(`Server started on port ${PORT}`));
app.listen(3000,()=>{
    console.log("Mongodb server is listening at 3000");
})


var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads')
    },
    filename:function(req,file,cb){
        // cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
        cb(null,file.fieldname+'-'+path.basename(file.originalname));
    }
})

var upload = multer({
    storage:storage
})


app.get('/profile/student', (req, res) => {
    const params = { 
        user: req.user.name, 
        skill: req.user.skill, 
        college: req.user.college
    };
    global.name = req.user.name;
    // if(global.name=="Student1"){
    //     global.collection = "myFile";
    // }
    
    // global.type= global.name==="Student1"?upload.single('Student1'):upload.single('Student2');
    // global.type= global.name==="Student1"?fun():fun2();

    // function fun(){
    //     console.log("fun");
    // }
    // function fun2(){
    //     console.log("fun2");
    // }

    // global.check=true;
    // console.log( global.name," ", global.collection);
    res.render('studentProfile.pug', params)
});



// console.log(global.name," hello");

// if(global.check==false){
//     global.type=upload.single('Student3');
// }




// global.type= global.name=="Student1"? upload.single('Student1'): global.name=="Student2"?upload.single('Student2') : global.name=="Student3"?upload.single('Student3'):upload.single('Student4');
// global.type= global.name=="Student1"? upload.single('Student1'): upload.single('Student2') ;
// global.type= global.name==="Student1"? app.use(fun1): upload.single('Student2');


// global.type = global.name==="Student1"?upload.single('Student1'):upload.single('Student2');
// console.log(global.name," Hello");
// var type = global.name==="Student1"? upload.single('Student1'):upload.single('Student2');

// if(global.name=="Student1"){
    // app.post('/uploadfile',upload.single('myFile'),(req,res)=>{
    // app.post('/uploadfile',global.type,(req,res)=>{
    app.post('/uploadfile',upload.single('Student1'),(req,res)=>{
    // app.post('/uploadfile',upload.single(`${global.name}`),(req,res)=>{
        // console.log( global.name," ", global.type);
        // console.log(req.file);
    
        // if( req.file.mimetype=='application/pdf' ){
        //     const pdffile = fs.readFileSync(req.file.path);
    
        //     pdfparse(pdffile).then(function(data){
        //         console.log(data.text);
        //     })
        // }
    
        if( req.file.mimetype=='application/pdf' ){
    
            // const pdffile = fs.readFileSync(req.file.path);
    
            fs.readFile(req.file.path,function(err,pdffile){
                if (err) return console.error(err,'line 154');
    
                pdfparse(pdffile).then(function(data){
                    // console.log(data.text);
                    fs.writeFile('uploads/first.txt',data.text,function(){
                        // var file = fs.readFileSync('uploads/first.txt');
                        fs.readFile('uploads/first.txt',function(err,file){
                            if (err) return console.error(err,'line 161');
    
                            
                            var encode_file = file.toString('base64');
            
                            // define a json object for file
            
                            var finalFile = {
            
                                contentType:req.file.mimetype,
                                path:req.file.path,
                                image:new Buffer(encode_file,'base64'),
                                key: `${global.name}`
                            };
            
                            //insert the image to the database
            
                            db.collection( 'Student1' ).insertOne(finalFile,(err,result)=>{
                                // console.log(result);
            
                                if(err) return console.log(err);
                                console.log("saved to database1");
            
                                // res.contentType(finalFile.contentType);
            
                                res.send("Your file has been uploaded to DataBase");
                            })
                        })
        
                        // ------------------------------------
        
                        
                    });
                },()=>{
                    console.log('Promise rejection from line 196')
                    res.send("PDF Parsing Error");
                }) 
    
            })
        }else{
            var file = fs.readFileSync(req.file.path);
            // console.log(file);
    
            var encode_file = file.toString('base64');
    
            // define a json object for file
    
            var finalFile = {
    
                contentType:req.file.mimetype,
                path:req.file.path,
                image:new Buffer(encode_file,'base64'),
                key: `${global.name}`
                
            };
    
            //insert the image to the database
    
            db.collection( 'Student1' ).insertOne(finalFile,(err,result)=>{
                // console.log(result);
    
                if(err) return console.log(err);
    
                console.log("saved to database1");
    
                // res.contentType(finalFile.contentType);
    
                res.send("Your file has been uploaded to DataBase");
            })
        }
    })
// }



// fetching and processing starts


var str1 ="",str2="";

// plag checker algo starts

function levenshtein(s1,s2){
    let distance = getDistance(s1, s2);
    return (1-(distance / longer(s1, s2).length)) * 100;
}

function getDistance(s1,s2) {
    let m = s1.length;
    let n = s2.length;
    let matrix = {}

for (let i = 0; i <= m; i++) {
    matrix[i] = [];
}
    for (let i=0; i<=m; i++)
    {
        for (let j=0; j<=n; j++)
        {
            if (i == 0) {
                matrix[i][j] = j;
            }
            else if (j == 0) {
                matrix[i][j] = i;
            }
            else {
                matrix[i][j] = min(matrix[i - 1][j - 1]
                                + costOfSubstitution(s1.charAt(i - 1),
                        s2.charAt(j - 1)),
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1);
            }
        }
    }
    return matrix[m][n];
}



function min(... numbers)
    {
        if(numbers.length>0){
            return Math.min(...numbers)
        }else{
            return Number.MAX_VALUE;
        }
    }

function costOfSubstitution( first,second) {
    return first == second ? 0 : 1;
}

 function longer(s1, s2) {
    return s1.length >= s2.length ? s1 : s2;
}



// plag checker algo ends


// fetching from database and processing of documents starts

app.get('/getPlagDropDown',(req,res,next)=>{

    var user1 = req.query.selectpicker;
    var user2 = req.query.selectpicker2;

    // console.log(user1);

    // console.log(db.collection("Student1").find({key:`${user1}`}));
    db.collection("Student1").find({key:`${user1}`}).toArray( function(err, result) {  
                if(err){
                    console.log(err);
                }else{
                    // console.log(result);
                    str1 =  result[result.length-1].image.toString();
                    // console.log(str1);
                    // console.log(result[result.length-1].image.toString());
                    // res.send(str1);
                }
                
            })

            db.collection("Student1").find({key:`${user2}`}).toArray( function(err, result) {  
                if(err){
                    console.log(err);
                }else{
                    // console.log(result);
                    str2 =  result[result.length-1].image.toString();
                }
                
            })
    next();
}, (req,res) =>{
    setTimeout(()=>{
            
        // console.log(str1,'@@@@@@@',str2);
        res.send("Similarity is:"+levenshtein(str1,str2));
    },1000)
})



// N X N starts
let arr = new Array();
let values = new Array('Student1','Student2','Student3','Student4');
let student;
let index;

app.get('/getPlagAll',(req,res,next)=>{

    student = req.query.selectpicker;
    // storing last file uploaded by every student in arr array
    var i;

    for(i=0;i<values.length;i++){
        // db.collection("Student1").find({key:'Student1'}).toArray( function(err, result) {  
        db.collection("Student1").find({key:values[i]}).toArray( function(err, result) {  
            if(err){
                console.log(err);
            }else{
                arr.push(result[result.length-1].image.toString());
                // console.log(result); // we getting all the files related to Student1 ever submitted in result array
            }
            
        })
    }
    
    index = values.indexOf(student);
    // console.log(index);
    next();
},(req,res) =>{
    setTimeout(()=>{


        // finding similarity between all students
        let ans = new Array();
        var i,j;
        for(i=0;i<values.length;i++){
            if(i==index){
                continue;
            }else{
                ans.push(`Similarity Between ${values[index]} and ${values[i]} is: `+levenshtein(arr[i],arr[index]));
            }
        }


        // let output = '';
        // ans.forEach(element => {
        //     output += element + '<br>'; // add line break after each element
        // });

        // res.send(output);


        // Use the map function to create a new array of HTML elements
        const listItems = ans.map((item) => {
            return `<li>${item}</li>`;
        });

        // Use the join function to concatenate the array into a string
        const listItemsHtml = listItems.join('\n');

        // displaying report on new webpage
        // res.send(`
        //         <!doctype html>
        //         <html>
        //         <head>
        //             <title>Plagirism Report</title>
        //             <style>
        //             /* Add some styles to the list items */
        //             li {
        //                 font-size: 20px;
        //                 line-height: 1.5;
        //                 color: #333;
        //             }
        //             </style>
        //         </head>
        //         <body>
        //             <ul>
        //             ${listItemsHtml}
        //             </ul>
        //         </body>
        //         </html>
        //     `);
        res.send(`
        <!doctype html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Plagirism Report</title>
            <style>
              /* Add some styles to the list items */
              li {
                font-size: 16px;
                line-height: 1.5;
                color: #333;
                margin-bottom: 10px;
              }
              /* Add some styles to the headings */
              h1, h2 {
                color: #333;
                font-weight: 600;
                margin-top: 0;
              }
              /* Add some styles to the container */
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>PlagBuster</h1>
              <p>Dear CourseStaff,</p>
              <p>Here is your requested plagiarized report:</p>
              <ul>
                ${listItemsHtml}
              </ul>
            </div>
          </body>
        </html>
        
            `);


            // sending report to email (using nodemailer)
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: 'piyushnagpal14@gmail.com', 
                  pass: 'bytbwbfdbmpsnkdf'
                },
                tls: {
                  rejectUnauthorized: false
                }
              });
              
              const mailOptions = {
                from: 'piyushnagpal14@gmail.com', // replace with your email
                to: req.query.email, // replace with the email entered by the user
                subject: 'Plagiarism Report',

                // text: ans.join('\n') // replace with the data to be sent in the email, displaying each element of array in new line in email

                // sending data in html format (because good practice and displaying each element in new line with pointers as dots in front of each line)
                html: `<!doctype html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Plagirism Report</title>
                    <style>
                      /* Add some styles to the list items */
                      li,p{
                        font-size: 15px;
                        line-height: 1.5;
                        color: #333;
                      }
                      /* Add some styles to the headings */
                      h1{
                        color: #333;
                        font-weight: 600;
                        margin-top: 0;
                      }
                      /* Add some styles to the container */
                      .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                        background-color: #f2f2f2;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1>PlagBuster</h1>
                      <p>Dear CourseStaff,</p>
                      <p>Here is your requested plagiarized report:</p>
                      <ul style="white-space: pre-wrap;">
                        ${listItemsHtml}
                      </ul>
                    </div>
                  </body>
                </html>
                
            `
                // text: ans.map((item, index) => `${index+1}. ${item}`).join('\n') // displaying each element of array in new line with pointers in front of each line in email
              };
              
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  res.send('Error Occurred!');
                } else {
                  console.log('Email sent: ' + info.response);
                  res.send('Email Sent!');
                }
              });
    },1000)
})