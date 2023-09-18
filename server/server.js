require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const vocabularyController = require('./routers/vocabulary.js');
const chatController = require('./routers/chat.js');
const readingController = require('./routers/reading.js');

const port = 3000;

app.use('/vocabulary', vocabularyController);
app.use('/chat', chatController);
app.use('/reading', readingController);
app.use(cors());

// app.get('/api', (req, res) => {
//   res.json({ message: 'Hello from server!' });
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});