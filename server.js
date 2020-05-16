const express=require('express');
const bodyparser=require('body-parser');
const request=require('request');
const fs=require('fs')
const path=require('path')

const app=express();
var port = process.env.PORT || 4000;

app.use(bodyparser.urlencoded({extended:false,limit: '50mb'}));
app.use(bodyparser.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname,'public')), { maxAge: 86400000 })

const public=path.join(__dirname,'public')

app.get('/',(req,res)=>{
    res.sendFile(path.join(public,'index.html'));
})

app.post('/send',(req,res)=>{
    console.log(req)
    if(req.body['captcha'] === undefined || req.body['captcha'] === '' || req.body['captcha'] === null)
  {
    return res.json({"responseError" : "Please select captcha first"});
  }
  console.log(req.body['userfile'])
  const file=req.body['file'];
  const filedata=file.data;
  const filename=file.name;
  fs.writeFile(__dirname+"/uploaded_doc/"+filename, filedata, 'base64', (err) => {
    console.log(err);
});
  const secretKey = "6LeaWcoUAAAAALOXkpzsJQEvyR3VR79UoxNPpO4a";
  // console.log(req.connection.remoteAddress)
  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['captcha'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationURL,function(error,response,body) {
      // console.log(body)
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      return res.json({"responseError" : "Failed captcha verification"});
    }
    
    res.json({"responseSuccess" : "Sucess"});
    // console.log(res)
  });

})

app.listen(port,()=>{
    console.log('server is runing')
})