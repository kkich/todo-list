const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const tasksFile = path.join(__dirname, '../data/tasks.json');

//Чтение и запись задач, обработка ошибок
const readTasks = () => {
    try {
      const data = fs.readFileSync(tasksFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Ошибка при чтении задач:', error);
      return []; 
    }
  };
  const writeTasks = (tasks) => {
    try {
      fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
    } catch (error) {
      console.error('Ошибка при записи задач:', error);
    }
  };
//Получить
router.get('/', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});
//Добавить
router.post('/', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    text: req.body.text || '',
    completed: false,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});
//Удалить 
router.delete('/:id', (req, res) => {
  const tasks = readTasks();
  const filteredTasks = tasks.filter(task => task.id !== req.params.id);
  writeTasks(filteredTasks);
  res.status(204).end();
});
//Обновить 
router.put('/:id', (req, res) => {
  const tasks = readTasks();
  const updatedTasks = tasks.map(task => {
    if (task.id === req.params.id) {
      return { ...task, ...req.body };
    }
    return task;
  });
  writeTasks(updatedTasks);
  const updatedTask = updatedTasks.find(t => t.id === req.params.id);
  res.json(updatedTask);
});
module.exports = router;
