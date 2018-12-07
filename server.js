'use strict';

const http = require('http');
require('dotenv').config();
const app = require('./server/config/express');
const port = process.env.PORT || '4000';
const mongoose = require('mongoose');
const config = require('./server/config/mongodb');

mongoose.Promise = Promise;
app.set('port', port);

/*Conexión a mongo y luego puerto donde correrá la aplicación*/
mongoose.connect(config.uri, config.options)
  .then(() => {
    console.log(`Mongodb connection successful on: ${config.uri}`);
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`API running on localhost:${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
