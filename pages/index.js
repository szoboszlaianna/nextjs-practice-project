import MeetupList from "../components/meetups/MeetupList";
import { MongoClient, ServerApiVersion } from "mongodb";
import Head from "next/head";

function HomePage(props) {
  return (
    <>
      <Head>
        <title>React meetups</title>
        <meta name="description" content="This is a meetup page"></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

export async function getStaticProps() {
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
  let meetups;
  try {
    await client.connect();
    await client.db("meetups").command({ ping: 1 });
    console.log("Connected successfully");
    const db = client.db();

    const meetupCollection = db.collection("meetups");
    meetups = await meetupCollection.find().toArray();
  } finally {
    client.close();
  }

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        id: meetup._id.toString(),
        description: meetup.description,
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
