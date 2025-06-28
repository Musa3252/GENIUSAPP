const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://triflux:Telkom800!1@email.fafmvfb.mongodb.net/?retryWrites=true&w=majority&appName=Email";

// Create the MongoClient ONCE (outside the route)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let emailsCollection;

// Connect to MongoDB ONCE when the server starts
client.connect()
  .then(() => {
    const db = client.db("emailDB");
    emailsCollection = db.collection("emails");
    console.log("✅ Connected to MongoDB");

    // Start server only after DB is connected
    app.listen(3000, () => {
      console.log("✅ Server running at http://localhost:3000");
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });

// Handle form submission
app.post('/signup', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    await emailsCollection.insertOne({
      email,
      createdAt: new Date()
    });

    res.json({ message: "Email saved successfully!" });
  } catch (err) {
    console.error("❌ MongoDB insert error:", err);
    res.status(500).json({ error: "Failed to save email." });
  }
});




