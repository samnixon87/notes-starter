import { useState } from "react";
import { IFolder, INote } from "../interfaces";
import axios from "axios";

export function useApi() {
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [notes, setNotes] = useState<INote[]>([]);

  const api = import.meta.env.VITE_API;

  // Folders
  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${api}/`);
      setFolders(response.data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const createFolder = async (folderData: IFolder) => {
    try {
      const response = await axios.post(`${api}/`, folderData);
      setFolders((prevFolders) => [...prevFolders, response.data]);
    } catch (error) {
      console.error("Error creating folders:", error);
    }
  };

  const updateFolderName = async (folderData: IFolder) => {
    try {
      await axios.put(`${api}/${folderData._id}`, folderData);
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder._id === folderData._id ? folderData : folder
        )
      );
    } catch (error) {
      console.error("Error updating folders:", error);
    }
  };

  const deleteFolder = async (folderName: string) => {
    try {
      await axios.delete(`${api}/${folderName}`);
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder.name !== folderName)
      );
    } catch (error) {
      console.error("Error deleting folders:", error);
    }
  };

  // Notes
  const fetchNotes = async (folderId: any) => {
    try {
      const response = await axios.get(`${api}/${folderId}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const createNote = async (folderId: string, noteData: INote) => {
    try {
      const response = await axios.post(`${api}/${folderId}/notes`, noteData);
      setNotes((prevNotes) => [...prevNotes, response.data]);
    } catch (error) {
      console.error("Error creating notes:", error);
    }
  };

  const updateNote = async (
    folderId: string,
    noteId: string,
    noteData: INote
  ) => {
    try {
      await axios.put(`${api}/${folderId}/notes/${noteId}`, noteData);
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? noteData : note
        )
      );
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  const deleteNote = async (folderName: string, noteId:string) => {
    try {
      await axios.delete(`${api}/${folderName}/notes/${noteId}`);
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== noteId)
      );
    } catch (error) {
      console.error("Error deleting notes:", error);
    }
  };

  return {
    folders,
    notes,
    fetchFolders,
    createFolder,
    updateFolderName,
    deleteFolder,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote
  };
}
