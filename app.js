const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

app.use(bodyParser.json());

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/muber');
}

routes(app);

app.use((err, req, res, next) => {
  res.status(422).send({error: err.message});
});

module.exports = app;
