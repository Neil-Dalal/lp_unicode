const bcrypt = require('bcrypt');
const User = require('../models/User');
const login = async (req, res, next) => {
    try {
        // Fix: Use destructuring to pull specific fields out of req.body
        const { email, password } = req.body; 
        const checkUser = await(User.findOne({email}));
       
        if(!checkUser){
           return res.status(400).json({ message: "Invalid username" });
        }
         const checkPass = await(bcrypt.compare(password,checkUser.password));
        if(!checkPass){
            return res.status(400).json({ message: "Invalid password" });
        }
        res.json("Login succesful");
    } catch (error) {
        next(error); // Sends the error to your central handler
    }
};

const register = async (req, res, next) => { // Added next
    try {
        const { name, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword 
        });
      
res.status(201).json({ 
    message: "User successfully registered!",
    user: newUser 
});
    } catch (error) {
        next(error); 
    }
};

module.exports = { login, register };