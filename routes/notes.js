const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const notes = require("../models/Notes")

// Fetching notes for a particular User
router.get('/fetchNotes', fetchuser,async (req, res) =>{
    try {
        const note = await notes.find({user:req.users.id})
        res.json(note)
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
        // const{title,description} = req.body;
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        await notes.create({
            title: req.body.title,
            content: req.body.content,
            user:req.users.id
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
    let note = await notes.findById(req.params.id)
    if(!note){return res.status(404).send("Note not found")};
    if (note.user.toString() !== req.users.id) {return res.status(401).send("Unauthorized")}
    note = await notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
    res.json({note})
    }catch(error) {
      res.status(500).send({error: error.message});
    }
  })

  // Deleting the note after verification
  router.delete('/deleteNotes/:id', fetchuser,async (req, res) =>{
    try {
    let note = await notes.findById(req.params.id)
    if(!note){return res.status(404).send("Note not found")};
    if (note.user.toString() !== req.users.id) {return res.status(401).send("Unauthorized")}
    note = await notes.findByIdAndDelete(req.params.id)
    res.json({"Sucess!! Deleted the following note":notes})
    }catch(error) {
      res.status(500).send({error: error.message});
    }
  })
module.exports = router