import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Note } from '../models/note.model';
import { Db } from 'mongodb';

// Assuming you have already established the 'db' connection variable

export const createNote = (db: Db) => async (req: Request, res: Response) => {
  const folder = req.params.folder;
  const newNote: Note = {
    _id: new ObjectId(),
    folder,
    title: req.body.title,
    content: req.body.content,
  };

  try {
    await db.collection('notes').insertOne(newNote);
    res.json(newNote);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).send('Error creating note');
  }
};

export const getAllNotesInFolder = (db: Db) => async (req: Request, res: Response) => {
  const folder = req.params.folder;

  try {
    const notes = await db.collection('notes').find({ folder: folder }).toArray();
    res.json(notes);
  } catch (err) {
    console.error('Error reading notes:', err);
    res.status(500).send('Error reading notes');
  }
};

export const updateNote = (db: Db) => async (req: Request, res: Response) => {
  const folder = req.params.folder;
  const noteId = new ObjectId(req.params.noteId);

  const updatedNote: Note = {
    _id: new ObjectId(noteId),
    folder,
    title: req.body.title,
    content: req.body.content,
  };

  try {
    const result = await db.collection('notes').updateOne({ _id: noteId, folder: folder }, { $set: updatedNote });

    if (result.modifiedCount > 0) {
      res.json(updatedNote);
    } else {
      res.status(404).send('Note not found');
    }
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).send('Error updating note');
  }
};

export const deleteNote = (db: Db) => async (req: Request, res: Response) => {
  const folder = req.params.folder;
  const noteId = new ObjectId(req.params.noteId);

  try {
    const result = await db.collection('notes').deleteOne({ _id: noteId, folder: folder });

    if (result.deletedCount === 1) {
      res.send('Note deleted successfully');
    } else {
      res.status(404).send('Note not found');
    }
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).send('Error deleting note');
  }
};
