import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Folder } from "../models/folder.model";
import { Db } from "mongodb";

export const createFolder = (db: Db) => async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(500).json({ error: "Error creating folder" });
    }

    const newFolder: Folder = {
      _id: new ObjectId(),
      name,
    };
    await db.collection("folders").insertOne(newFolder);
    console.log("Folder created successfully");

    return res.json(newFolder);
  } catch (err) {
    console.error("Error creating folder:", err);
    return res.status(500).send("Error creating folder");
  }
};

export const getAllFolders = (db: Db) => async (_: Request, res: Response) => {
  try {
    const folders = await db.collection("folders").find({}).toArray();
    console.log("Folders read successfully");
    res.json(folders);
  } catch (err) {
    console.error("Error reading folders:", err);
    res.status(500).send("Error reading folders");
  }
};

export const updateFolderName =
  (db: Db) => async (req: Request, res: Response) => {
    const folderId = new ObjectId(req.params.folderId);
    const newName = req.body.name;

    try {
      const result = await db
        .collection("folders")
        .updateOne({ _id: folderId }, { $set: { name: newName } });

      if (result.modifiedCount > 0) {
        res.send("Folder name updated successfully");
      } else {
        res.status(404).send("Folder not found");
      }
    } catch (err) {
      console.error("Error updating folder name:", err);
      res.status(500).send("Error updating folder name");
    }
  };

export const deleteFolder = (db: Db) => async (req: Request, res: Response) => {
  const folderId = new ObjectId(req.params.folderId);

  try {
    const deleteFolderResult = await db
      .collection("folders")
      .deleteOne({ _id: folderId });
    const deleteNotesResult = await db
      .collection("notes")
      .deleteMany({ folderId });

    if (
      deleteFolderResult.deletedCount === 1 ||
      deleteNotesResult.deletedCount > 0
    ) {
      res.send("Folder and associated notes deleted successfully");
    } else {
      res.status(404).send("Folder not found");
    }
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.status(500).send("Error deleting folder");
  }
};
