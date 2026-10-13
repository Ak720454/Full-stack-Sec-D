const express = require('express');
const app = express();
app.use(express.json());

let students = [];
let nextId = 1; // never decremented -> deleted IDs are not reused

const isValid = ({ name, email, age } = {}) =>
  typeof name === 'string' && name.trim() !== '' &&
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
  Number.isInteger(age) && age > 0;

// Create
app.post('/students', (req, res) => {
  if (!isValid(req.body)) return res.status(400).json({ error: 'Invalid input' });
  const { name, email, age } = req.body;
  if (students.some(s => s.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ error: 'Email already exists' });
  const student = { id: nextId++, name, email, age };
  students.push(student);
  res.status(201).json(student);
});

// List (optional ?minAge=)
app.get('/students', (req, res) => {
  const { minAge } = req.query;
  if (minAge !== undefined && minAge !== '' && !isNaN(Number(minAge)))
    return res.status(200).json(students.filter(s => s.age >= Number(minAge)));
  res.status(200).json(students);
});

// Fetch one
app.get('/students/:id', (req, res) => {
  const s = students.find(x => x.id === Number(req.params.id));
  if (!s) return res.status(404).json({ error: 'Student not found' });
  res.status(200).json(s);
});

// Delete
app.delete('/students/:id', (req, res) => {
  const i = students.findIndex(x => x.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: 'Student not found' });
  students.splice(i, 1);
  res.status(204).send();
});

// Malformed JSON body -> 400
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed')
    return res.status(400).json({ error: 'Invalid input' });
  next(err);
});

const PORT = process.env.PORT || 3000;
if (require.main === module) app.listen(PORT, () => console.log(`Running on ${PORT}`));
module.exports = app;
