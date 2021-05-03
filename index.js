require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const Router = require('./src/routers/router');

const app = express();

app.listen(process.env.PORT, () => {
  console.log('Server Running at Port', process.env.PORT);
});

// Test Connection
app.get('/', (req, res) => {
  res.json({
    succes: true,
    message: 'Backend is Running now!!!',
  });
});

const jsonParser = express.json();

app.use(logger('dev'));
app.use(jsonParser);
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cors());

app.use(Router);
