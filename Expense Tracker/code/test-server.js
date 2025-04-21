const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Simple test server is running' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Simple test server running on port ${PORT}`);
});
