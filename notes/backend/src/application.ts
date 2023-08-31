import express from "express";
import helmet from "helmet";
import cors from "cors";
import {
  createFolder,
  getAllFolders,
  updateFolderName,
  deleteFolder,
} from "./controllers/folderController";
import {
  createNote,
  getAllNotesInFolder,
  updateNote,
  deleteNote,
} from "./controllers/notesController";

const createApp = (db: any) => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  // Folder
  app.post("/", createFolder(db));
  app.get('/', getAllFolders(db));
  app.put('/:folderId', updateFolderName(db))
  app.delete('/:folderId', deleteFolder(db))

  // Note
  app.post('/:folder/notes', createNote(db))
  app.get('/:folder/notes', getAllNotesInFolder(db))
  app.put('/:folder/notes/:noteId', updateNote(db))
  app.delete('/:folder/notes/:noteId', deleteNote(db))

  return app;
};

export default createApp;
