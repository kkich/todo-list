require('dotenv').config();
const express = require('express');
const app = express();
const tasksRouter = require('./routes/tasks');
const path = require('path');

app.use(express.json());
app.use('/api/tasks', tasksRouter);
app.use(express.static(path.join(__dirname, '../ui')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/index.html'));
});
//Сервер
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
