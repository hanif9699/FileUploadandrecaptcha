const express=require('express');
const bodyparser=require('body-parser');
const request=require('request');

const app=express();

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.post('/send',(req,res)=>{
    console.log(req.body.captcha)
    if(req.body['captcha'] === undefined || req.body['captcha'] === '' || req.body['captcha'] === null)
  {
    return res.json({"responseError" : "Please select captcha first"});
  }
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

app.listen(4000,()=>{
    console.log('server is runing')
})