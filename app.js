var express=require('express');
var app=express();
var db=require('./db.json');
var bodyParser=require('body-parser');
var session=require('express-session');
var path=require('path')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//var auth=require('./routes/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
    }));
app.use(session({
        secret:'secret',
        saveUninitialized:false,
        resave:false
      }));

 
app.get('/',(req,res)=>{
    res.render('qp',{'qs':db.QuestionSet[0]})
});

app.get('/result',(req,res)=>{
    res.render('result');
});
count=1;
app.get('/pageChange',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.send(JSON.stringify({c:db.QuestionSet[count++]}));
    console.log('one');
    console.log(count);
});

app.listen(3000,()=>{
    console.log("app running on port 3000");
});
