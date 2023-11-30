require('dotenv/config');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = process.env.JWT_SECRET;
// Create a user
router.post('/createUser',[
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a proper email id').isEmail(),
    body('password','Password should be minimum 8 characters').isLength({ min: 8 })
  ],async(req, res) =>{
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
            res.status(500).send({error: error.message});
        }
    });
// Autheticate a user
    router.post('/login',[
        body('email','Enter a proper email id').isEmail(), 
        body('password','Enter the password').exists(), 
      ],async(req, res) =>{
        const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      const {email,password} = req.body
      try {
       let userFound = await users.findOne({email: req.body.email})
       if (!userFound){
            return res.status(400).json({ errors: 'Please enter valid credentials' });  
          }
        const passwordCompare = await bcrypt.compare(password,userFound.password);
        if (!passwordCompare){
            return res.status(400).json({ errors: 'Please enter valid credentials' });  
          }
          const data = {
            'user':{
                id: userFound.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({success:true,authToken:authToken});
      } catch (error) {
        res.status(500).send({error: error.message});
      }
    })
// Get logged in user details
router.post('/getUser',fetchuser,async(req, res) =>{
  try {
    userId = req.user.id
    let userFound = await users.findById(userId)
    res.send({userFound})
  } catch (error) {
    res.status(500).send({error: error.message,location: "post"});
  }
})
module.exports = router