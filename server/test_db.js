const pool = require('./db');

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Текущая дата/время:', result.rows[0]);
  } catch (error){
    console.error('Ошибка подключения к базе:', error.message);
  } finally {
    pool.end();
  }
}

testConnection();
