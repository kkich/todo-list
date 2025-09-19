const express = require('express');
const router = express.Router();
// const fs = require('fs');
const path = require('path');
// const tasksFile = path.join(__dirname, '../data/tasks.json');
const pool = require('../db');
const { text } = require('stream/consumers');

router.get('/', async (req, res)=>{
  try{
    const result=await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  }catch(error){
    console.error('Ошибка при получении задач: ', error);
    res.status(500).json({error: 'Ошибка сервера'})
  }
});
//добавить
router.post('/', async (req, res)=>{
  try{
    const { text }= req.body;
    if(!text || text.trim()===''){
      return res.status(400).json({error:'Текст задачи обязателен'});
    }
    const result=await pool.query('INSERT INTO tasks (text, completed) VALUES ($1, $2) RETURNING*', [text, false]
    );
    res.status(201).json(result.rows[0]);
  }catch(error){
    console.error('Ошибка при добавлении задачи', error);
    res.status(500).json({error: 'Ошибка сервера'});
  }
});
//Удалить 
router.delete('/:id', async (req, res) => {
  try{
    const { id }= req.params;
    await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
    res.status(204).end();
  }catch(error){
    console.error('Ошибка при удалении задачи', error);
    res.status(500).json({error: 'Ошибка сервера'});
  }
});
//Обновить 
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET text = $1, completed = $2 WHERE id = $3 RETURNING *',
      [text || '', completed, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении задачи', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
module.exports = router;
