import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors()); // allow cross‑origin requests during development
app.use(bodyParser.json());

// open (or create) database file
const db = await open({ filename: './data.db', driver: sqlite3.Database });
await db.exec(`
  CREATE TABLE IF NOT EXISTS pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    fecha_nacimiento TEXT,
    genero TEXT,
    direccion TEXT,
    telefono TEXT,
    email TEXT
  );
  CREATE TABLE IF NOT EXISTS citas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER,
    fecha TEXT,
    hora TEXT,
    medico TEXT,
    motivo TEXT,
    FOREIGN KEY(paciente_id) REFERENCES pacientes(id)
  );
`);

// seed sample patients if empty
const countPac = await db.get('SELECT COUNT(*) as n FROM pacientes');
if (countPac.n === 0) {
  await db.run(`INSERT INTO pacientes (nombre,fecha_nacimiento,genero,direccion,telefono,email)
                VALUES (?,?,?,?,?,?)`,
               'Juan Pérez','1980-05-12','Masculino','Calle 123','3101234567','juan@example.com');
}

app.get('/api/pacientes', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM pacientes');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/pacientes', async (req, res) => {
  try {
    const { nombre, fecha_nacimiento, genero, direccion, telefono, email } = req.body;
    const result = await db.run(
      `INSERT INTO pacientes (nombre,fecha_nacimiento,genero,direccion,telefono,email)
       VALUES (?,?,?,?,?,?)`,
      nombre, fecha_nacimiento, genero, direccion, telefono, email
    );
    const pat = await db.get('SELECT * FROM pacientes WHERE id=?', result.lastID);
    res.status(201).json(pat);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/citas', async (req, res) => {
  try {
    // join to include patient name
    const rows = await db.all(`
      SELECT c.*, p.nombre
      FROM citas c
      LEFT JOIN pacientes p ON p.id = c.paciente_id
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/citas', async (req, res) => {
  try {
    const { paciente_id, fecha, hora, medico, motivo } = req.body;
    const result = await db.run(
      `INSERT INTO citas (paciente_id,fecha,hora,medico,motivo)
       VALUES (?,?,?,?,?)`,
      paciente_id, fecha, hora, medico, motivo
    );
    const cit = await db.get('SELECT * FROM citas WHERE id=?', result.lastID);
    res.status(201).json(cit);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend listening at http://localhost:${port}`));
