const Users = require('../models/userModel');
const bcrypt  =require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail')


const {CLIENT_URL} = process.env

const userCtrl = {
    register: async(req, res) => {
        try{
           const {name, email, password} = req.body;
           //check for empty fields
           if(!name || !email || !password)
                return res.status(400).json({msg: "Please fill in all the fields"});
           //validate email
           if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid Email"}); 
            //find if user with the email exist
            const user = await Users.findOne({email});
            if(user) 
                return res.status(400).json({msg: "This email already exist"});
            if(password.length < 6)
                 return res.status(400).json({msg: "Password must be atleast 6 characters"});  
            //hashing password
            const passwordHash = await bcrypt.hash(password, 12)
            //new user
            const newUser = {
                name, email, password: passwordHash
            }
            //activation token
            const activation_token = createActivationToken(newUser)
            const url = `${CLIENT_URL}/user/activate/${activation_token}`
            sendMail(email, url);

            res.json({msg: "Register Success! Please activate your email to start"}); 
            
            // res.json({msg: "Register Test"}) 
        } catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body;
            const user = jwt.verify( activation_token, process.env.ACTIVATION_TOKEN_SECRET )
            console.log(user);
            const {name, email, password} = user
            const check = await Users.findOne({email})
            if(check) return res.status(400).json({msg:"This email already exist"});

            const newUser = new Users({
                name, email, password
        });
            await newUser.save();

            res.json({msg: "Account has been activated!"});


        } catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body;
            const user = await Users.findOne({email});
            if(!user) return res.status(400).json({msg: "This email does not exist."});


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}


 //Custom Functions
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn:'5m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'15m'})
  }

  const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'7m'})
  }



module.exports = userCtrl


































