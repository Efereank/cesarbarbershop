const express = require('express');
const cors = require('cors');

const app = express();

// Permitir todos los orígenes
app.use(cors());

// O permitir específicamente tu dominio
app.use(cors({
  origin: 'https://cesarbarbershopmcbo.sao.dom.my.id'
}));

// O configurar manualmente los headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://cesarbarbershopmcbo.sao.dom.my.id');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});