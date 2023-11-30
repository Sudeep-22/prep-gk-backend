const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const Note = require("../models/Notes")

// Fetching notes for a particular User
router.get('/fetchNotes', fetchuser,async (req, res) =>{
    try {
        userId = req.user.id
        const notes = await Note.find({user:req.user.id})
        res.json(notes)
      } catch (error) {
        res.status(500).send({error: error.message});
      }
} )
// Add a new note
router.post('/addNotes', fetchuser,[
    body('title','Enter a valid Title').isLength({ min: 3 }),
    body('content','Content should be minimum 8 characters').isLength({ min: 8 })
  ],async (req, res) =>{
      try {
        const{title,description} = req.body;
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const note= await Note.create({
            title: req.body.title,
            content: req.body.content,
            user:req.user.id
        })
        res.send("Notes created successfully")
      } catch (error) {
        res.status(500).send({error: error.message});
      }
} )
// Updating the note after verification
router.put('/updateNotes/:id', fetchuser,async (req, res) =>{
    const{title, content} = req.body;
    try{
    const newNote = {};
    if (title){newNote.title = title}
    if (content){newNote.content = content}
    let notes = await Note.findById(req.params.id)
    if(!notes){return res.status(404).send("Note not found")};
    if (notes.user.toString() !== req.user.id) {return res.status(401).send("Unauthorized")}
    notes = await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
    res.json({notes})
    }catch(error) {
      res.status(500).send({error: error.message});
    }
  })

  // Deleting the note after verification
  router.delete('/deleteNotes/:id', fetchuser,async (req, res) =>{
    try {
    let notes = await Note.findById(req.params.id)
    if(!notes){return res.status(404).send("Note not found")};
    if (notes.user.toString() !== req.user.id) {return res.status(401).send("Unauthorized")}
    notes = await Note.findByIdAndDelete(req.params.id)
    res.json({"Sucess!! Deleted the following note":notes})
    }catch(error) {
      res.status(500).send({error: error.message});
    }
  })
module.exports = router