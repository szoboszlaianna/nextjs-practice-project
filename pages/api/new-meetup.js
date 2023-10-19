// api/new-meetup
import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://anna123:3LTQmTOhQzgmg6iK@cluster0.5wr5cde.mongodb.net/meetups?retryWrites=true&w=majority",
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    try {
      await client.connect();
      await client.db("meetups").command({ ping: 1 });
      console.log("Connected successfully");
      const db = client.db();

      const meetupCollection = db.collection("meetups");
      const result = await meetupCollection.insertOne(data);
      console.log(result);
    } finally {
      client.close();
    }

    res.status(201).json({ message: "Meetup inserted" });
  }
}

export default handler;
