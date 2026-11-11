const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/calcada_livre';

async function conectar() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`MongoDB conectado em ${MONGODB_URI}`);
}

module.exports = { conectar, MONGODB_URI };
