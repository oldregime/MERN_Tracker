const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL || 'mongodb+srv://mernexptrack:Asdf!1234@cluster0.i7llnad.mongodb.net/finance-tracker?retryWrites=true&w=majority';
    
    const conn = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

