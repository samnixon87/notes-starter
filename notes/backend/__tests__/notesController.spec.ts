import request from "supertest";
import createApp from "../src/application"; // Import createApp instead of app
import { describe, expect, it, beforeEach, beforeAll, afterAll } from "@jest/globals";
import { MongoClient, ObjectId, Db } from "mongodb";
import dotenv from 'dotenv';
dotenv.config()

describe("Note Controller Tests", () => {
  let app: any; // To store the app instance
  let db: Db;
  let client: MongoClient;
  let testFolderId: ObjectId; // To store the folder ID for the notes
  let server: any;

  beforeAll(async () => {
    // Start the server and store the instance
    // Connect to the test database
    const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?${process.env.MONGO_CLUSTER_OPTIONS}`;
    client = new MongoClient(mongoURI);
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME);
    app = createApp(db); // Initialize the app with null db
    server = app.listen(3000);
    await db.collection("notes").deleteMany({});
  }, 20000);

  afterAll(async () => {
    // Clear existing notes and folders
    await db.collection("notes").deleteMany({});
    await db.collection("folders").deleteMany({});

    // Create folders
    const folderNames = ['Pizza', 'Politics', 'Dogs', 'Cats', 'Job ideas'];

    for (const folderName of folderNames) {
        const response = await request(app).post("/").send({ name: folderName });
        const folderId = response.body._id;

        if (folderName === 'Job ideas') {
            const noteData = {
                title: 'Beach',
                content: 'Just: beach',
            };
            await request(app)
                .post(`/${folderId}/notes`)
                .send(noteData);
        }
    }

    // Close the server and database connection
    if (server) {
        await server.close();
    }
    if (client) {
        await client.close();
    }
});

  beforeEach(async () => {
    // Delete existing notes and create a test folder to use in the notes
    await db.collection("notes").deleteMany({});
    const folderNames = ['Pizza', 'Politics', 'Dogs', 'Cats', 'Job ideas'];

    for (const folderName of folderNames) {
        const response = await request(app).post("/").send({ name: folderName });
        testFolderId = response.body._id;
    }
});

  it("should create a new note", async () => {
    const noteData = {
      title: "Test Note",
      content: "This is a test note.",
    };
    const response = await request(app)
      .post(`/${testFolderId}/notes`)
      .send(noteData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe(noteData.title);
    expect(response.body.content).toBe(noteData.content);

    // Check if the note is stored in the database
    const notes = await db.collection("notes").find({}).toArray();
    expect(notes).toHaveLength(1);
    expect(notes[0].title).toBe(noteData.title);
    expect(notes[0].content).toBe(noteData.content);
  });

  it("should get all notes in a folder", async () => {
    // Add test notes to the database
    const note1 = { _id: new ObjectId(), folder: testFolderId, title: "Note 1", content: "Content 1" };
    const note2 = { _id: new ObjectId(), folder: testFolderId, title: "Note 2", content: "Content 2" };
    await db.collection("notes").insertMany([note1, note2]);

    const response = await request(app).get(`/${testFolderId}/notes`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe(note1.title);
    expect(response.body[1].title).toBe(note2.title);
  });

  it("should update the note", async () => {
    // Add a test note to the database
    const note = { _id: new ObjectId(), folder: testFolderId, title: "Original Title", content: "Original Content" };
    await db.collection("notes").insertOne(note);

    const updatedNoteData = {
      title: "Updated Title",
      content: "Updated Content",
    };
    const response = await request(app)
      .put(`/${testFolderId}/notes/${note._id}`)
      .send(updatedNoteData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedNoteData.title);
    expect(response.body.content).toBe(updatedNoteData.content);

    // Check if the note is updated in the database
    const updatedNote = await db.collection("notes").findOne({ _id: note._id });
    expect(updatedNote).toBeDefined(); // Check if the note exists
    expect(updatedNote!.title).toBe(updatedNoteData.title);
    expect(updatedNote!.content).toBe(updatedNoteData.content);
  });

  it("should delete a note", async () => {
    // Add a test note to the database
    const note = { _id: new ObjectId(), folder: testFolderId, title: "Note to Delete", content: "Note content" };
    await db.collection("notes").insertOne(note);

    const response = await request(app).delete(`/${testFolderId}/notes/${note._id}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Note deleted successfully");

    // Check if the note is deleted from the database
    const notes = await db.collection("notes").find({}).toArray();
    expect(notes).toHaveLength(0);
  });

  it("should return an error when deleting a non-existing note", async () => {
    const noteId = new ObjectId();
    const response = await request(app).delete(`/${testFolderId}/notes/${noteId}`);

    expect(response.status).toBe(404);
    expect(response.text).toBe("Note not found");
  });
});
