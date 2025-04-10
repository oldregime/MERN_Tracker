const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userStore = require('./utils/userStore');

const app = express();
app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Simple Auth Server' });
});

// Get all users
app.get('/users', (req, res) => {
  res.json({ users: userStore.getAllUsers() });
});

// Register route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (userStore.findUserByEmail(email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = userStore.createUser({
      name,
      email,
      password: hashedPassword,
      currency: 'USD'
    });

    const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '1d' });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
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
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = userStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route middleware
const protect = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    const user = userStore.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { id: user.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

// Get current user
app.get('/me', protect, (req, res) => {
  try {
    const user = userStore.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        currency: user.currency,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`Simple Auth Server running on port ${PORT}`);
  console.log('Demo user available:', userStore.findUserByEmail('demo@example.com') ? 'Yes' : 'No');
  if (userStore.findUserByEmail('demo@example.com')) {
    console.log('Demo credentials: demo@example.com / password123');
  }
});

// Log any server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});
