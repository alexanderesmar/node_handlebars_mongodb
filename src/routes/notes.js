const express = require('express');
const router = express.Router();

//cargo el modelo
const Note = require('../models/Notes');

//cargo helpers
const {isAuthenticated} = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {

    //res.send('notes from db');

    res.render('notes/new-note');
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {

    const note = await Note.findById(req.params.id).lean();

    res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {

    const {title, description}=req.body;

    const note = await Note.findByIdAndUpdate(req.params.id, {title, description});

    req.flash('success_msg', 'Note edited successfully');

    res.redirect('/notes');
});

router.post('/notes/new-note', isAuthenticated,  async (req, res) => {
    console.log(req.body);
    const { title, description } = req.body;
    const errors = [];

    if (!title) {
        errors.push({ text: 'please insert a title' });
    }

    if (!description) {
        errors.push({ text: 'please insert a description' });
    }

    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {

        const newNote = new Note({title, description});
        newNote.user = req.user.id;        
        await newNote.save();
        req.flash('success_msg', 'Note added successfully');
        //res.send('ok');
        res.redirect('/notes');
    }

    //res.send('ok');

    //res.render('notes/new-note');
});

router.delete('/notes/delete/:id', isAuthenticated,  async (req, res) => {

    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note deleted successfully');

    res.redirect('/notes');

});

router.get('/notes', isAuthenticated, async (req, res) => {
//lean cambia el resultado a json
    const notes = await Note.find({user:req.user.id}).lean().sort({date: 'desc'});
    res.render('notes/all-notes', {notes});
    //res.send('notes from db');
});

module.exports = router;