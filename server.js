const express  = require ("express")
const app = express()
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const path = require('path')
const connectDB = require("./db/connectDB")
const session = require('express-session')
const nocache = require('nocache')
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(nocache())
app.use(session({secret:`mysecretkey`,
   resave:false,
   saveUninitialized : true
}))



app.set('views', [
   path.join(__dirname, 'views/admin'),
   path.join(__dirname, 'views/user'),
   path.join(__dirname, 'views')
 ]);
 
app.set('view engine' , 'hbs')
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());




app.use('/user',userRoutes)
app.use('/admin',adminRoutes)


connectDB()

 app.listen(3003, ()=>{
    console.log("listening in port 3003")
 })