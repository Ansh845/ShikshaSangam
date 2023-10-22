const mongoose = require("mongoose");
const express = require("express");
const Review = require('./models/reviews');
const Campground = require("./models/campground");
const FEEDBACKS = require("./models/feedback");
const app = express();
const User = require('./models/user')
const ejsMate= require("ejs-mate");
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const path = require('path');
const inst = require('./models/institute')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const flash= require('connect-flash');
const passport = require('passport');
const LocalStrategy= require('passport-local');






const sessionOptions ={secret: 'thisisnotagoodsecret', 
                       resave: false, 
                       saveUninitialized: false,
                       cookie:{
                        httpOnly: true, //this is for extended security, if there is XSS flaw, the cookie won't be revealed to the third party
                        expires: Date.now()+1000*60*60*24*7,
                        maxAge: 1000*60*60*24*7
                       }
                    }













app.use(session(sessionOptions))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static('imports/images'));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(cookieParser());
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose.connect("mongodb://127.0.0.1:27017/newCamping",{
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true/
});
const db= mongoose.connection;
db.on("error",()=>{
    console.log("failed to connect");
})
db.once("open",()=>{
    console.log("mongo connected");
})


app.get('/fakeUser', async (req,res)=>{
    const user= new User({
        email: "nash@gmail.com",
        username: "aNsh"
    });
    const newUSer = await User.register(user, 'chicken')
    res.send(newUSer);
})


app.get('/pagecount', (req,res)=>{
    if(req.session.count){
        req.session.count+=1;
    }else{
        req.session.count=1;
    }

    res.send(`you have viewed this page ${req.session.count} times !!`)
})





app.get('/cookie',(req,res)=>{
    res.cookie('name', "Ansh");
    res.send("sent you a cookie, go and have a look !");
})

app.get('/instituteReg',(req,res)=>{
    res.render('campgrounds/institute_reg');
    console.log(req.cookies);
})

app.post('/institutePost',async(req,res)=>{
    const {username,email,password,Institute_name,contact_number} = req.body;
    const exist = await inst.findOne({email});
    if(!exist){
        const hash= await bcrypt.hash(password,12);
        const institute = new inst({
             username,
             email,
             password: hash,
             Institute_name,
             contact_number
        })
        await institute.save();        
        req.session.user_id=institute._id;
        res.redirect(`/dashboard/${institute._id}`);
    }
    else{
        res.send("user already exists !");
    }
   
})

app.get('/',(req,res)=>{
    res.render("home");
})
app.get('/campground/index2',async (req,res)=>{
    if(!req.session.user_id){
        res.render('campgrounds/please_login_page');
    }
    else{
        const camps = await Campground.find();
        res.render("campgrounds/index2", {camps});
    }
})


app.get('/campground/books',async (req,res)=>{
    // const camps = await Campground.find();
    res.render("campgrounds/books");
})



app.get('/campground/signup',(req,res)=>{
    res.render("campgrounds/signup");
})

app.get('/campground/feedback',(req,res)=>{
    res.render("campgrounds/feedback");
})

app.get('/campground/view_feedback',(req,res)=>{
    res.render("campgrounds/view_feedback");
})

app.get('/campground/about',(req,res)=>{
    res.render("campgrounds/about_us");
})

app.get('/campground/title',(req,res)=>{
    res.render("campgrounds/title");
})

app.post('/logout',(req,res)=>{
    req.session.user_id=null;
    res.redirect('/');
})

app.get('/campground/login',(req,res)=>{
    res.render("campgrounds/login");
})

app.get('/campground/new', (req,res)=>{
    // const camps = await Campground.find();
    res.render("campgrounds/new"); 
})
app.get('/campground/next', (req,res)=>{
    // const camps = await Campground.find();
    res.render("campgrounds/next"); 
})
app.get('/campground/upload', (req,res)=>{
    // const camps = await Campground.find();
    res.render("campgrounds/uploadContent"); 
})
app.post('/campgrounds', async(req,res)=>{
    const newCamp = new Campground(req.body.campground);
    // res.render("campgrounds/show", {newCamp});
    // console.log(req.body);
    await newCamp.save();
    res.redirect(`campgrounds/${newCamp._id}`);
})


app.post('/camps', async(req,res)=>{
    const feedback = new FEEDBACKS(req.body.feedback);
    // res.render("campgrounds/show", {newCamp});
    console.log(req.body);
    if(!req.isAuthenticated()){
        res.send("please login first !");
    }
    else{
        
    await feedback.save()
    .then(()=>{
        res.redirect(`campground2`);
    })
    }
})

app.get('/campground',async (req,res)=>{
    const camps = await Campground.find();
    res.render("campgrounds/index", {camps}); 
})
app.get('/campground/campground',async (req,res)=>{
    const camps = await Campground.find();
    res.render("campgrounds/index", {camps}); 
})
app.get('/campground2',async (req,res)=>{
    const backs = await FEEDBACKS.find();
    res.render("campgrounds/view_feedback", {backs}); 
})

app.get('/campgrounds/:id/edit',async (req,res)=>{
    const camp=await Campground.findById(req.params.id)
    res.render("campgrounds/edit",{camp}); 
})


app.get('/campgrounds/:id',async (req,res)=>{
    const camp=await Campground.findById(req.params.id)
    res.render("campgrounds/show",{camp}); 
})


app.get('/campground2/:id',async (req,res)=>{
    const camp=await FEEDBACKS.findById(req.params.id)
    res.render("campground/dashboard",{camp}); 
})






app.put('/campground/:id', async(req,res) =>{
    const { id }= req.params;
    const campg = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campg._id}`)
})

app.delete('/campground/:id',async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
})

app.post('/campgrounds/:id/reviews', async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review= new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/signup',(req,res)=>{
    res.render('campgrounds/learnAuth');
})

app.use((req,res,next)=>{
    res.locals.messages = req.flash('success');
    next();
})

app.post('/register', async(req,res)=>{
    const {username, email, password}= req.body;
    const user = new User({email, username});
    const exist= await User.findOne({username});
    if(exist){
        res.send("username already taken, please try another username");
    }
    else{
        const registeredUser= await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', "succefully registered")
        res.redirect(`/dashboard/${user._id}`) 
    }  
})

app.get('/dashboard/:id', async (req,res)=>{

        const page = await User.findById(req.params.id)
        res.render('campgrounds/dashboard',{page});
    
})

app.post('/mongologin', passport.authenticate('User.authenticate()',{failureFlash: true, failureRedirect: '/mongologin', successRedirect: '/',successFlash: true}));


app.get('/mongoLogin',(req,res)=>{
    res.render('campgrounds/mongoLogin');
})

app.get('*',(req,res)=>{
    res.send("BAD REQUEST!");
})

app.listen(3000,()=>{
    console.log("connected to port 3000 !");
})