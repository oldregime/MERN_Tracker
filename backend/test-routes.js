const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/finance-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    return false;
  }
};

// Test routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Test MongoDB connection
app.get('/test-db', async (req, res) => {
  const isConnected = await connectDB();
  if (isConnected) {
    res.json({ success: true, message: 'MongoDB connection successful' });
  } else {
    res.status(500).json({ success: false, message: 'MongoDB connection failed' });
  }
});

// Test user creation
app.post('/test-user', async (req, res) => {
  try {
    await connectDB();
    
    // Check if User model exists
    let User;
    try {
      User = mongoose.model('User');
    } catch (error) {
      // Define User model if it doesn't exist
      const UserSchema = new mongoose.Schema({
        name: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, default: 'user' },
        isEmailVerified: { type: Boolean, default: true },
        currency: { type: String, default: 'USD' },
        createdAt: { type: Date, default: Date.now }
      });
      
      // Add methods
      UserSchema.methods.comparePassword = async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
      };
      
      UserSchema.methods.getProfile = function() {
        return {
          id: this._id,
          name: this.name,
          email: this.email,
          role: this.role,
          isEmailVerified: this.isEmailVerified,
          currency: this.currency,
          createdAt: this.createdAt
        };
      };
      
      User = mongoose.model('User', UserSchema);
    }
    
    // Create a test user
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: true,
      role: 'user',
      currency: 'USD'
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '1d'
    });
    
    res.status(201).json({
      success: true,
      message: 'Test user created successfully',
      data: {
        token,
        user: user.getProfile ? user.getProfile() : {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          currency: user.currency,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Test user creation error:', error);
    res.status(500).json({ success: false, message: 'Error creating test user', error: error.message });
  }
});

// Test login
app.post('/test-login', async (req, res) => {
  try {
    await connectDB();
    
    const { email, password } = req.body;
    
    // Get User model
    const User = mongoose.model('User');
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '1d'
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: user.getProfile ? user.getProfile() : {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          currency: user.currency,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ success: false, message: 'Error during login', error: error.message });
  }
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/test-db to test MongoDB connection`);
  console.log(`Use POST http://localhost:${PORT}/test-user to create a test user`);
  console.log(`Use POST http://localhost:${PORT}/test-login to test login`);
});
