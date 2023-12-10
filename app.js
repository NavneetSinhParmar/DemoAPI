// app.js

const express = require('express');
const mongoose = require('mongoose');
const routes = require("./routes");
const cors = require('cors');

const app = express();

// Replace the connection string below with your actual MongoDB Atlas connection string
const USERNAME = 'weberlabsinfo'; 
const PASSWORD = 'Neel1234';
const DB_NAME = 'neel'; // Replace with your actual database name

// Construct the connection string with the username, password, and database name
const MONGODB_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.sxpngpr.mongodb.net/${DB_NAME}`;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.use(express.json());
    app.use(cors());
    let db = mongoose.connection;

        routes(
          app,
          db
        );

  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// ... Rest of your code remains the same

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
