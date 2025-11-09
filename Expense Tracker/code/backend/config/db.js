const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Base64-encoded version of your MongoDB URI( Store encodedUrl in .env and import it using process.env.encodedUrl )

    const encodedUrl =
      "bW9uZ29kYitzcnY6Ly9tZXJuZXhwdHJhY2s6QXNkZiExMjM0QGNsdXN0ZXIwLmk3bGxuYWQubW9uZ29kYi5uZXQvZmluYW5jZS10cmFja2VyP3JldHJ5V3JpdGVzPXRydWUmdz1tYWpvcml0eQ==";

    const dbUrl =
      process.env.DATABASE_URL ||
      Buffer.from(encodedUrl, "base64").toString("utf8");

    console.log(dbUrl);

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
