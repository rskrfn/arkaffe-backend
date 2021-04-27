require('dotenv').config();

const express = require('express');
const logger = require('morgan');

const Router = require('./src/routers/router');

const app = express();

app.listen(process.env.PORT, () => {
  console.log('Server Running at Port', process.env.PORT);
});

const jsonParser = express.json();
const urlEncodedParser = express.urlencoded();

app.use(logger('dev'));
app.use(jsonParser);
app.use(urlEncodedParser);
app.use(express.static('public'));

app.use(Router);
