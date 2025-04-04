require('dotenv/config');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const timeout = require('connect-timeout'); // <--- ADD THIS LINE

// Apply a timeout middleware (e.g., 5 seconds) to routes
const TIMEOUT_DURATION = '5s'; // Set your desired timeout here

const JWT_SECRET = process.env.JWT_SECRET;
// Create a user
router.post('/createUser',
  timeout(TIMEOUT_DURATION),[
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a proper email id').isEmail(),
    body('password','Password should be minimum 8 characters').isLength({ min: 8 })
  ],async(req, res) =>{
    if (req.timedout) return;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try{
      let userFound = await users.findOne({email: req.body.email})
       if (userFound){
            return res.status(400).json({ errors: 'This email id is already in use. Please use a different email id' });  
          }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt)
      let user = await users.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            'user':{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({success:true,authToken:authToken});
    }
        catch(error){
          if(!req.timedout) res.status(500).send({error: error.message});
        }
    });
// Autheticate a user
    router.post('/login',
      timeout(TIMEOUT_DURATION),[
        body('email','Enter a proper email id').isEmail(), 
        body('password','Enter the password').exists(), 
      ],async(req, res) =>{
        if (req.timedout) return;
        const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      const {email,password} = req.body
      try {
       let userFound = await users.findOne({ email: email })
       if (!userFound){
            return res.status(400).json({ errors: 'Email id not found' });  
          }
        const passwordCompare = await bcrypt.compare(password,userFound.password);
        if (!passwordCompare){
            return res.status(400).json({ errors: 'Please enter valid Password' });  
          }
          const data = {
            'user':{
                id: userFound.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({success:true,authToken:authToken});
      } catch (error) {
        if(!req.timedout) res.status(500).send({error: error.message});
      }
    })
// Get logged in user details
router.post('/getUser',fetchuser,async(req, res) =>{
  try {
    const userId = req.user.id
    let userFound = await users.findById(userId)
    res.send({userFound})
  } catch (error) {
    res.status(500).send({error: error.message,location: "post"});
  }
})

router.get('/info', [], async(req, res)=>{
try{
  res.json({success:true, isWorking: true});
} catch(error) {
    res.status(500).send({error: error.message});
}
});
module.exports = router