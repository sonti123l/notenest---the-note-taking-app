const express = require('express');
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ✅ Get All Notes (Protected)
router.get('/', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ✅ Create a Note (Protected)
router.post(
  '/',
  [
    fetchuser,
    body('title', 'Title is required').notEmpty(),
    body('content', 'Content is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content } = req.body;
      const note = new Note({ title, content, user: req.user.id });
      await note.save();
      res.json(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// ✅ Update a Note (Protected)
router.put('/:id', fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, content } = req.body;
    if (title) note.title = title;
    if (content) note.content = content;

    await note.save();
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ✅ Delete a Note (Protected)
router.delete('/:id', fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
