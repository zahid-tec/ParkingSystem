const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new Database('parking.db');

// Table banana
db.exec("CREATE TABLE IF NOT EXISTS slots (id TEXT PRIMARY KEY, name TEXT, car TEXT, booked INTEGER)");

let count = db.prepare("SELECT COUNT(*) as c FROM slots").get().c;
if (count === 0) {
  const insert = db.prepare("INSERT INTO slots VALUES (?,?,?,?)");
  for (let i = 1; i <= 20; i++) {
    insert.run('A-' + i, '', '', 0);
  }
  console.log('20 Slots Ban Gaye - Database me');
}

app.get('/api/slots', (req, res) => {
  const rows = db.prepare("SELECT * FROM slots ORDER BY CAST(SUBSTR(id, 3) AS INTEGER)").all();
  res.json(rows.map(r => ({ id: r.id, name: r.name, car: r.car, booked: r.booked === 1 })));
});

app.post('/api/book', (req, res) => {
  const { id, name, car } = req.body;
  db.prepare("UPDATE slots SET name=?, car=?, booked=1 WHERE id=?").run(name, car, id);
  res.json({ message: 'Book Ho Gaya!' });
});

app.post('/api/free', (req, res) => {
  const { id } = req.body;
  db.prepare("UPDATE slots SET name='', car='', booked=0 WHERE id=?").run(id);
  res.json({ message: 'Slot Khali Ho Gaya!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server chal raha hai ' + PORT + ' par - Database Connected!'));