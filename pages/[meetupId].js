import MeetupDetail from "../components/meetups/MeetupDetail";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

function MeetUpDetails(props) {
  return (
    <MeetupDetail
      title={props.meetupData.title}
      image={props.meetupData.image}
      detail={props.meetupData.description}
      address={props.meetupData.address}
    ></MeetupDetail>
  );
}

export async function getStaticPaths() {
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
    meetups = await meetupCollection.find({}, { _id: 1 }).toArray();
  } finally {
    client.close();
  }

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

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
  let meetup;
  try {
    await client.connect();
    await client.db("meetups").command({ ping: 1 });
    console.log("Connected successfully");
    const db = client.db();

    const meetupCollection = db.collection("meetups");
    meetup = await meetupCollection.findOne({ _id: new ObjectId(meetupId) });
  } finally {
    client.close();
  }
  //fetch data to a single meetup
  return {
    props: {
      meetupData: {
        id: meetup._id.toString(),
        title: meetup.title,
        address: meetup.address,
        description: meetup.description,
        image: meetup.image,
      },
    },
    revalidate: 10,
  };
}
export default MeetUpDetails;
