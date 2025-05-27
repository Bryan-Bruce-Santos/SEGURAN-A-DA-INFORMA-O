require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Banco de dados
const db = new sqlite3.Database('./backend/database.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Conectado ao banco SQLite.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS passagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origem TEXT,
    destino TEXT,
    data TEXT
  )`);
});

// Registro de usuário
app.post('/api/auth/register', [
  body('nome').notEmpty(),
  body('email').isEmail(),
  body('senha').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { nome, email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);
  db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao registrar usuário' });
    res.json({ mensagem: 'Usuário registrado com sucesso!' });
  });
});

// Login
app.post('/api/auth/login', [
  body('email').isEmail(),
  body('senha').notEmpty()
], (req, res) => {
  const { email, senha } = req.body;
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ erro: 'Credenciais inválidas' });
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ erro: 'Senha incorreta' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Middleware de autenticação
function autenticarToken(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Buscar passagens
app.post('/api/passagens/buscar', autenticarToken, [
  body('origem').notEmpty(),
  body('destino').notEmpty(),
  body('data').notEmpty()
], (req, res) => {
  const { origem, destino, data } = req.body;
  db.all('SELECT * FROM passagens WHERE origem = ? AND destino = ? AND data = ?', [origem, destino, data], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar passagens' });
    res.json({ resultados: rows });
  });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));