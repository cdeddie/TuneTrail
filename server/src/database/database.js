import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tunetrail_dev'
}).promise()

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

export default db;