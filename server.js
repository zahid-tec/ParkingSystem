const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let slots = [];
for (let i = 1; i <= 20; i++) {
  slots.push({ id: 'A-' + i, name: '', car: '', booked: false });
}

app.get('/api/slots', (req, res) => {
  res.json(slots);
});

app.post('/api/book', (req, res) => {
  const { id, name, car } = req.body;
  let s = slots.find(x => x.id === id);
  if (s) { s.name = name; s.car = car; s.booked = true; }
  res.json({ message: 'Book Ho Gaya!' });
});

app.post('/api/free', (req, res) => {
  const { id } = req.body;
  let s = slots.find(x => x.id === id);
  if (s) { s.name = ''; s.car = ''; s.booked = false; }
  res.json({ message: 'Slot Khali Ho Gaya!' });
});

module.exports = app;
