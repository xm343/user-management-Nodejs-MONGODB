const userSchema = require('../model/userModel')
const bcrypt = require('bcrypt')
const saltround = 10

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        
        const user = await userSchema.findOne({ email });
        if (user) {
            
            return res.render('register', { message: 'User already exists!' });
        }
        const hashedPassword = await bcrypt.hash(password , saltround)

        
        
        const newUser = new userSchema({
            username,
            email,
            password:hashedPassword
        });
        await newUser.save();

        
        res.render('login', { message: 'User created successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Server Error');
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body; 
        const user = await userSchema.findOne({ email });
        
        if (!user) {
            return res.render('user/login', { message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('user/login', { message: 'Incorrect Password' });

        }
        req.session.user = true

        
        res.render('user/userHome', { message: 'Login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
        res.render('login', { message: 'Something went wrong' });
    }
};


const loadHome = (req, res) => {
    res.render('user/userHome')
};

const logout = (req, res)=>{
    req.session.user = null
    res.redirect('/user/login')
}

module.exports = { loadHome, registerUser, login, logout };

