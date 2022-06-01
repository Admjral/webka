const express=require('express')
const app=express()
const mongoose=require('mongoose')
const authroute = require('./routes/authroute')
const articleRouter = require('./routes/articles')
const cookieparser=require('cookie-parser')
const methodOverride = require('method-override')
const path=require('path')
const port=4000
const ejs=require('ejs')

app.set('view engine', 'ejs')
app.set('views')
app.use(cookieparser())
app.use(express.urlencoded({ extended: false }))
app.use(authroute)
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use('/articles', articleRouter)
async function start(){
    try{
        await mongoose.connect('mongodb+srv://web:web@web.yi2gq.mongodb.net/user' ,{
            useNewUrlParser: true
        })
        app.listen(port, () => {
            console.log(`Example app listening on port`)
        })
    }
    catch (e){
        console.log(e)
    }
}
start()
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('email');
    res.clearCookie('name');
    res.clearCookie('country');
    res.clearCookie('time');
    res.redirect('/');
});
app.get('/profile', function (req,res){
    res.render('Profile',{email:req.cookies.email,name:req.cookies.name,country:req.cookies.country});
});
app.post('/profile', function (req,res){
    res.cookie('email', `${req.body.email}`);
    res.cookie('name', `${req.body.name}`);
    res.cookie('country', `${req.body.country}`);
    res.redirect('/profile');
});
app.get('/enneagram', function (req,res){
    res.render('enneagram');
})
app.get('/enneagraminfo', function (req,res){
    res.render('enneagraminfo')
})
app.get('/about', function (req,res){
    res.render('about')
})
app.get('/mbti', function (req,res){
    res.render('mbti')
})
app.listen((process.env.PORT || 8000), () => {console.log(`${port}`);});
