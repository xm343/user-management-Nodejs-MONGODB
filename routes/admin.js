const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/adminAuth')



router.get('/login',adminAuth.isLogin, adminController.loadLogin);

router.post('/login',adminController.login)

router.get('/dashboard',adminAuth.checkSession,adminController.loadDashboard)

router.post('/add-user', adminAuth.checkSession, adminController.addUser); 

router.post('/edit-user', adminAuth.checkSession, adminController.editUser);

router.get('/delete-user/:id',adminAuth.checkSession,adminController.deleteUser)

router.get('/logout', adminAuth.checkSession, adminController.logout);






module.exports = router