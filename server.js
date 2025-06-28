const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Use the fixed connection string with encoded password
const uri = "mongodb+srv://triflux:Telkom800%211%40email@cluster0.fafmvfb.mongodb.net/emailDB?retryWrites=true&w=majority";

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

    // Start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });

app.post('/signup', async (req, res) => {
  const { email, name, company } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    await emailsCollection.insertOne({
      email,
      name: name || null,
      company: company || null,
      createdAt: new Date()
    });

    res.json({ message: "Email saved successfully!" });
  } catch (err) {
    console.error("❌ MongoDB insert error:", err);
    res.status(500).json({ error: "Failed to save email." });
  }
});




