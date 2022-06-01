const {Router} = require('express')
const router = Router()

const User = require('../models/User')
const Article = require('../models/article')

var Validator = require('password-validator')
var validatorSchema = new Validator()
validatorSchema.is().min(7).is().max(20).has().uppercase().has().lowercase().has().symbols().has().not().spaces()

const Cookies=require('cookies')
var keys = ['Adil']
let cookies = new Cookies((req,res)=>{keys:keys})
router.get('/video', (req,res)=>{
    res.render('video')
})
router.get('/articles/index', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})

router.get('/', (req,res)=>{
    res.render('signin')
})
router.post('/', async(req,res)=>{
    if(validatorSchema.validate(req.body.password)==true){const user = new User({name:req.body.firstname,
        lastname:req.body.lastname,
        login:req.body.username,
        password:req.body.password,
        email:req.body.mail
    })
        await user.save()
        res.redirect('/login')}
    else
        res.redirect('/')
})
router.get('/login', (req,res)=>{
    res.render('login')
})
router.post('/login', async (req,res)=>{
    const login = req.body.username
    const pass = req.body.password
    let cookies=new Cookies(req,res,{keys:keys})
    cookies.set('login', `${req.body.username}`)
    if(await User.findOne({$and:[{login:login},{password:pass},{role:'admin'}]})){
        res.redirect('/adminpanel')
    }
    else if(await User.findOne({$and:[{login:login},{password:pass},{role:'User'}]})){res.redirect('/enneagraminfo')}
    else res.redirect('/login')
})
router.get('/adminpanel', async (req,res)=>{
    let cookies=new Cookies(req,res,{keys:keys})
    let login = cookies.get('login')
    let user = await User.findOne({login:login})
    let username = user.login
    User.find({}, function(err, users) {
        res.render('adminpanel',{
            usersinfo:users, username
        })
    })
})
router.post('/sort_names', async (req,res)=>{
    let cookies=new Cookies(req,res,{keys:keys})
    let login=cookies.get('login')
    let user = await User.findOne({login:login})
    let username = user.login
    User.find({}, function(err, users) {
        res.render('adminpanel',{
            usersinfo:users, username
        })
    }).sort({name:1})
})
router.post('/sort_login', async (req,res)=>{
    let cookies=new Cookies(req,res,{keys:keys})
    let login=cookies.get('login')
    let user = await User.findOne({login:login})
    let username = user.login
    User.find({}, function(err, users) {
        res.render('adminpanel',{
            usersinfo:users, username
        })
    }).sort({login:1})
})
router.post('/delete', async (req,res)=>{
    const login = req.body.username
    await User.deleteOne({login:login})
    res.redirect('/adminpanel')
})
router.post('/update', async (req,res)=>{
    const login = req.body.username
    const name = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    await User.updateOne({login:login},{name:name, surname:lastname,email:email})
    res.redirect('/adminpanel')
})
router.post('/insert', async (req,res)=>{
    if(schema.validate(req.body.password)==true){const user = new User({name:req.body.firstname,
        surname:req.body.lastname,
        login:req.body.username,
        password:req.body.password  ,
        email:req.body.mail
    })
        await user.save()
        res.redirect('/adminpanel')
    }})
module.exports = router
