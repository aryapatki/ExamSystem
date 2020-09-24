var express=require('express');
var app=express();
var db=require('./db.json');
var bodyParser=require('body-parser');
var session=require('express-session');
app.set('view engine', 'ejs');
var path=require('path');
app.set('views', path.join(__dirname, 'views'));
//var auth=require('./routes/auth');
/////////////////////////
///////////////////////////////////////////////////
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config');
const { waitForDebugger } = require('inspector');
//////////////////////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
    }));
app.use(session({
        secret:'secret',
        saveUninitialized:false,
        resave:false
      }));
 
//app.use('/auth',auth);

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
  
  app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
  })
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/start',
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
 
app.get('/start',checkAuthenticated,(req,res)=>{
    res.render('qp',{'qs':db.QuestionSet[0]});
    req.session.count=0;
    console.log(req.session.count);
});

///////////////////////////////////////////////////////////////////

app.get('/pageChange',(req,res)=>{
    redir="";
    if(req.session.count===6){
        console.log('inside if');

         redir="http://localhost:3000/result";

    }
    // else{
        if(req.session.count===undefined){
            req.session.count=0;
        }
        console.log(req.session.count);
        res.setHeader('Content-Type','application/json');
        res.send(JSON.stringify({c:db.QuestionSet[req.session.count++],url:redir}));
        
    // }
    
});


app.get('/result',(req,res)=>{
  console.log('inside result');
   res.render('result');
});

app.listen(3000,()=>{
    console.log("app running on port 3000");
});
