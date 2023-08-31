import createApp from "./application";
import { MongoClient, Db } from "mongodb";
import dotenv from 'dotenv'

dotenv.config();

const port = 3000;
let app = createApp(null);
let db: Db;

const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?${process.env.MONGO_CLUSTER_OPTIONS}`;
const client = new MongoClient(mongoURI);

(async () => {
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME);

    console.log("Connected to db");

    app = createApp(db);

    app.listen(port, () => {
      console.log(`App listening on port http://127.0.0.1:${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err);
    process.exit(1);
  }
})();
