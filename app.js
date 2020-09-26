var express=require('express');
var app=express();
var db=require('./db.json');
var bodyParser=require('body-parser');
var session=require('express-session');
app.set('view engine', 'ejs');
var path=require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
/////////////////////////
///////////////////////////////////////////////////
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config');
const { waitForDebugger } = require('inspector');
var cookieParser = require('cookie-parser');
//////////////////////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
    }));
app.use(session({
        secret:'secret',
        saveUninitialized:true,
        resave:false
      }));
 
app.use(cookieParser());

/////////////////////////////////////////////////////////////////////////

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  const users = []
  
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  app.get('/',(req, res) => {
    res.render('register.ejs');
  })
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/homepage',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  ////////////////////////////////////////////////////////////
 
app.get('/homepage',checkAuthenticated,(req,res)=>{
  scoreOS=0;
  scoreCN=0;
  count=0;
  res.render('homepage.ejs');

})

///////////////////////OS test////////////////////////////////////////////


app.get('/startOS',checkAuthenticated,(req,res)=>{
    res.render('OS',{'qs':db.OS[0]});
    console.log('inside start');
    //req.session.count=0;
    console.log(count);
    count++;
});


app.get('/pageChangeOS',checkAuthenticated,(req,res)=>{
    redir="";
    if(count===6){
        console.log('inside if');

         redir="http://localhost:3000/resultOS";

    }
      console.log('inside pagechange');
        // if(req.session.count===undefined){
        //     req.session.count=1;
        // }
        console.log(count);
        res.setHeader('Content-Type','application/json');
        res.send(JSON.stringify({c:db.OS[count++],url:redir}));
    
});

app.post('/scorecounterOS',checkAuthenticated,(req,res)=>{
  console.log(req.body.a);
  for(i=0;i<6;i++){
    if(req.body.a[i]===db.OS[i].ans){
      scoreOS++;
    }
  }
})


app.get('/resultOS',checkAuthenticated,(req,res)=>{
  console.log('inside result');
  console.log(scoreOS);
   res.render('result',{score:scoreOS});
  //scoreOS=0;
});
//////////////////////////////CN test////////////////////////////////////////


app.get('/startCN',checkAuthenticated,(req,res)=>{
  res.render('CN',{'qs':db.OS[0]});
  console.log('inside start');
  //req.session.count=0;
  console.log(count);
  count++;
});


app.get('/pageChangeCN',checkAuthenticated,(req,res)=>{
  redir="";
  if(count===6){
      console.log('inside if');

       redir="http://localhost:3000/resultCN";

  }
    console.log('inside pagechange');
      // if(req.session.count===undefined){
      //     req.session.count=1;
      // }
      console.log(count);
      res.setHeader('Content-Type','application/json');
      res.send(JSON.stringify({c:db.CN[count++],url:redir}));
  
});

app.post('/scorecounterCN',checkAuthenticated,(req,res)=>{
console.log(req.body.a);
for(i=0;i<6;i++){
  if(req.body.a[i]===db.CN[i].ans){
    scoreCN++;
  }
}
})

app.get('/resultCN',checkAuthenticated,(req,res)=>{
console.log('inside result');
console.log(scoreCN);
 res.render('result',{score:scoreCN});
 //scoreCN=0;
});

/////////////////////////////////////////////////////////////////////////

app.listen(3000,()=>{
    console.log("app running on port 3000");
});
