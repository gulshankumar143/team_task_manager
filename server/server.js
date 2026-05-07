require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Debug
console.log("ENV FILE LOADED:", __dirname + '/.env');
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected");

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(" MongoDB connection error:", err);
  });