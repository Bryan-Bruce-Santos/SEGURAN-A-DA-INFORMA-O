# Sistema de Busca de Passagens de Barco

**Desenvolvido por Bryan Lukas Bruce dos Santos**  
Projeto acadêmico para a disciplina de Segurança da Informação

## 🧭 Descrição do Projeto

Este sistema permite aos usuários autenticados buscar passagens de barco entre diferentes locais, em datas específicas. O foco principal está na **segurança** das operações realizadas.

## 🛠️ Tecnologias utilizadas

- **Front-end:** HTML, JavaScript, TailwindCSS
- **Back-end:** Node.js, Express.js, SQLite
- **Segurança:** JWT, Bcrypt, Helmet, Rate Limiting, CORS

---

## 📁 Estrutura do Projeto

```
sistema_passagens_barco/
│
├── frontend/
│   ├── index.html
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── documentacao/
│   └── documentacao_sistema_barco.md
│
└── README.md
```

---

## ▶️ Como Executar o Projeto

### Pré-requisitos

- Node.js e npm instalados
- Editor de texto (VS Code recomendado)
- Navegador atualizado (Google Chrome, Firefox...)

### 1. Instalação do Back-end

```bash
cd backend
npm install
```

### 2. Configuração do Ambiente

Crie um arquivo `.env` com o seguinte conteúdo (já incluído):

```
PORT=3000
JWT_SECRET=chave-muito-segura-e-complexa
```

### 3. Inicializar o Servidor

```bash
npm start
```

O back-end estará disponível em: `http://localhost:3000`

### 4. Inserir dados no banco (opcional)

Utilize qualquer ferramenta SQLite para adicionar registros à tabela `passagens` com campos:
- `origem`, `destino`, `data`

Ou insira diretamente no código modificando `server.js`.

### 5. Executar o Front-end

Abra o arquivo `frontend/index.html` no navegador.

### 6. Fluxo de uso

1. Acesse `POST /api/auth/register` com JSON:
```json
{ "nome": "Bryan", "email": "bryan@email.com", "senha": "123456" }
```
2. Depois, faça login em `POST /api/auth/login` para receber um token.
3. Cole esse token no prompt do navegador ao realizar buscas no front-end.

---

## ✅ Segurança Implementada

- Hash de senhas com **bcrypt**
- Autenticação com **JWT**
- Middleware de autenticação
- Proteção com **Helmet** (headers seguros)
- **CORS** para controle de origens
- Limite de requisições com **Rate Limiting**
- **Validação de entrada** com express-validator

---

## 📄 Licença e uso

Este projeto é acadêmico e foi desenvolvido exclusivamente para fins didáticos.

---

**Desenvolvido por Bryan Lukas Bruce dos Santos**
