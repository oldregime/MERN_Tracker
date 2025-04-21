// Simple in-memory user store
const users = [];

// Add a demo user if needed
const addDemoUser = () => {
  // Only add if no users exist
  if (users.length === 0) {
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('password123', salt);

    users.push({
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
      isEmailVerified: true,
      role: 'user',
      currency: 'USD',
      createdAt: new Date().toISOString()
    });

    console.log('Demo user created: demo@example.com / password123');
  }
};

// Initialize with demo user
addDemoUser();

const userStore = {
  createUser: (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      isEmailVerified: true,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    console.log(`New user created: ${newUser.email}`);
    return newUser;
  },

  findUserByEmail: (email) => {
    return users.find(user => user.email === email);
  },

  findUserById: (id) => {
    return users.find(user => user.id === id);
  },

  updateUser: (id, updates) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return users[index];
    }
    return null;
  },

  getAllUsers: () => {
    return users.map(({ password, ...user }) => user); // Return users without passwords
  },

  // For debugging
  _getUsers: () => users
};

module.exports = userStore;