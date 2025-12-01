const mongoose = require('mongoose');
async function connectDB(uri){
  mongoose.set('strictQuery', false);
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('MongoDB connected'))
    .catch(err => { console.error('MongoDB connection error', err); throw err; });
}
module.exports = connectDB;
