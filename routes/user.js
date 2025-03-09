const express = require('express')
const router = express.Router()
const userController = require('../controller/userController');
const auth = require('../middleware/auth')


router.get('/home',userController.loadHome)


router.get('/login', auth.isLogin, (req, res) => {
    res.render('user/login'); 
});


router.get('/register',auth.isLogin,(req, res)=>{
    res.render('register')
})
router.get('/userHome',auth.checkSession,(req,res)=>{
    res.render('home')
})
router.post('/login', userController.login);
router.get(`/logout`,auth.checkSession,userController.logout)



router.post('/register',userController.registerUser)

module.exports = router