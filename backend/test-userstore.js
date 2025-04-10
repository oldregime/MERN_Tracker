const userStore = require('./utils/userStore');
const bcrypt = require('bcryptjs');

// Test the userStore functionality
console.log('Testing userStore...');

// Get all users
console.log('All users:', userStore.getAllUsers());

// Create a test user
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: bcrypt.hashSync('password123', 10),
  currency: 'USD'
};

// Add the user
const createdUser = userStore.createUser(testUser);
console.log('Created user:', createdUser);

// Find by email
const foundByEmail = userStore.findUserByEmail('test@example.com');
console.log('Found by email:', foundByEmail ? 'Yes' : 'No');

// Find by ID
const foundById = userStore.findUserById(createdUser.id);
console.log('Found by ID:', foundById ? 'Yes' : 'No');

// Update user
const updatedUser = userStore.updateUser(createdUser.id, { name: 'Updated Name' });
console.log('Updated user:', updatedUser);

// Get all users again
console.log('All users after update:', userStore.getAllUsers());

console.log('Test completed!');
