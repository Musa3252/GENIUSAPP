const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Encode special characters in the password:
// Telkom800!1 → Telkom800%211
const uri = "mongodb+srv://triflux:Telkom800%211@cluster0.fafmvfb.mongodb.net/emailDB?retryWrites=true&w=majority&appName=Email";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let emailsCollection;

client.connect()
  .then(() => {
    const db = client.db("emailDB");
    emailsCollection = db.collection("emails");
    console.log("✅ Connected to MongoDB");

    app.listen(3000, () => {
      console.log("✅ Server running at http://localhost:3000");
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });

// ✅ Handle incoming signup requests
app.post('/signup', async (req, res) => {
  const { name, email, company } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    await emailsCollection.insertOne({
      name,
      email,
      company,
      createdAt: new Date()
    });

    res.json({ message: "Email saved successfully!" });
  } catch (err) {
    console.error("❌ MongoDB insert error:", err);
    res.status(500).json({ error: "Failed to save email." });
  }
});




