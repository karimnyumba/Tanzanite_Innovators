const mongoose = require('mongoose');
require('dotenv').config();
console.log(process.env.MONGO_DB_URL);
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((err) => {
  console.error("Error connecting to MongoDB Atlas", err);
});
