import request from "supertest";
import { Db } from "mongodb";
import createApp from "../src/application"; // Import the 'app' instance from index.ts
import { describe, expect, it, beforeEach, beforeAll, afterAll } from "@jest/globals";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';
dotenv.config()

describe("Folder Controller Tests", () => {
  let app: any; // To store the app instance
  let db: Db;
  let client: MongoClient;
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
    await db.collection("folders").deleteMany({});
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
    // Delete existing folders
    await db.collection("folders").deleteMany({});
  });

  it("should create new folders", async () => {
    const folderNames = ['Pizza', 'Pasta', 'Dogs', 'Cats', 'Job ideas'];

    for (const folderName of folderNames) {
        const response = await request(app).post("/").send({ _id: new ObjectId(), name: folderName });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("_id");
        expect(response.body.name).toBe(folderName);
    }

    // Check if the folders are stored in the database
    const folders = await db.collection("folders").find({}).toArray();
    expect(folders).toHaveLength(folderNames.length);
    for (let i = 0; i < folderNames.length; i++) {
        expect(folders[i].name).toBe(folderNames[i]);
    }
});

  it("should return an error when creating a folder with invalid data", async () => {
    const response = await request(app)
      .post("/")
      .send({ invalidProperty: "Invalid Data" });

    expect(response.status).toBe(500);
    expect(JSON.parse(response.text)).toEqual({ error: "Error creating folder" });

    // Check if the folder was not stored in the database
    const folders = await db.collection("folders").find({}).toArray();
    expect(folders).toHaveLength(0);
  });

  it("should get all folders", async () => {
    // Add test folders to the database
    const folder1 = { _id: new ObjectId(), name: "Folder 1" };
    const folder2 = { _id: new ObjectId(), name: "Folder 2" };
    await db.collection("folders").insertMany([folder1, folder2]);

    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe(folder1.name);
    expect(response.body[1].name).toBe(folder2.name);
  });

  it("should update the folder name", async () => {
    // Add a test folder to the database
    const folder = { _id: new ObjectId(), name: "Original Folder Name" };
    await db.collection("folders").insertOne(folder);

    const newFolderName = "Updated Folder Name";
    const response = await request(app)
      .put(`/${folder._id}`)
      .send({ name: newFolderName });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Folder name updated successfully");

    // Check if the folder name is updated in the database
    const updatedFolder = await db.collection("folders").findOne({ _id: folder._id });
    expect(updatedFolder).toBeDefined(); // Check if the folder exists
    expect(updatedFolder!.name).toBe(newFolderName);
  });

  it("should return an error when updating a non-existing folder", async () => {
    const folderId = new ObjectId();
    const response = await request(app)
      .put(`/${folderId}`)
      .send({ name: "Updated Folder Name" });

    expect(response.status).toBe(404);
    expect(response.text).toBe("Folder not found");
  });

  it("should delete a folder", async () => {
    // Add a test folder to the database
    const folder = { _id: new ObjectId(), name: "Folder to Delete" };
    await db.collection("folders").insertOne(folder);

    const response = await request(app).delete(`/${folder._id}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Folder and associated notes deleted successfully");

    // Check if the folder is deleted from the database
    const folders = await db.collection("folders").find({}).toArray();
    expect(folders).toHaveLength(0);
  });

  it("should return an error when deleting a non-existing folder", async () => {
    const folderId = new ObjectId();
    const response = await request(app).delete(`/${folderId}`);

    expect(response.status).toBe(404);
    expect(response.text).toBe("Folder not found");
  });
});
