// db.js - Conexión MySQL con mysql2

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // cambia si usas otro usuario
  password: '',         // si le pusiste clave, escríbela aquí
  database: 'oceanic_db', // debe existir en phpMyAdmin
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
