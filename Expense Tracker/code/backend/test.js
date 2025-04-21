const express = require('express');
const cors = require('cors');
const userStore = require('./utils/userStore');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Test server is running' });
});

app.get('/users', (req, res) => {
  res.json({ users: userStore.getAllUsers() });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Demo user available:', userStore.findUserByEmail('demo@example.com') ? 'Yes' : 'No');
});
