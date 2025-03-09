const adminModel = require('../model/adminModel')
const bcrypt= require('bcrypt')
const userModel = require('../model/userModel')

const loadLogin = async (req, res) => {
    res.render('admin/login'); 
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.render('admin/login', { message: 'Invalid credentials' }); 
        }

        
        const isMatch = await bcrypt.compare(password, admin.password); 
        if (!isMatch) {
            return res.render('admin/login', { message: 'Invalid credentials' }); 
        }

        
        req.session.admin = true;
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error during admin login:', error);
        res.render('admin/login', { message: 'Something went wrong, please try again.' });
    }
};

const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin; // Ensure admin session exists
        if (!admin) return res.redirect('/admin/login');

        // Fetch all users from the database
        const users = await userModel.find({});

        // Render the dashboard and pass the users to the view
        res.render('admin/dashboard', { users }); // Pass users to the view
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.redirect('/admin/login');
    }
};


const editUser = async (req, res) => {
    try {
        const { id, username } = req.body;

        // Update the user's username
        await userModel.findByIdAndUpdate(id, { username });

        // Redirect back to dashboard
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error editing user:', error);
        res.redirect('/admin/dashboard?message=Something went wrong');
    }
};

const addUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.redirect('/admin/dashboard?message=User already exists');
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new userModel({
            email,
            username,
            password: hashedPassword
        });
        await newUser.save();

        // Redirect back to dashboard
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error adding user:', error);
        res.redirect('/admin/dashboard?message=Something went wrong');
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Extract user ID from the request URL

        // Find and delete the user by ID
        const user = await userModel.findByIdAndDelete(id);

        // If no user is found, send an error response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Redirect back to the dashboard after deletion
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const logout = async (req, res) => {
    try {
        // Clear the admin session
        req.session.admin = null;

        // Redirect to the admin login page
        res.redirect('/admin/login');
    } catch (error) {
        console.error('Error during admin logout:', error);
        res.status(500).send('Something went wrong during logout');
    }
};




module.exports = {loadLogin , login , loadDashboard, editUser ,addUser, deleteUser, logout}