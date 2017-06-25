const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./services/config.js');
const socketIo = require('socket.io');
const sockets = require('./middlewares/sockets.js');
const bodyParser = require('body-parser');

const app = express();
const server = new http.Server(app);
const io = socketIo(server);
sockets(io);

app.use(cors());
app.options('*', cors());

function listen() {
  server.listen(config.get('port'));
  console.log(`Server listening on port ${config.get('port')}`);
}

// Database connection
function connect() {
  return mongoose.connect(config.get('mongodb:uri')).connection;
}
app.use(bodyParser.json({ type: ['json', 'application/vnd.api+json'] }));
app.use(bodyParser.urlencoded({ extended: false }));

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

// ROUTES
app.use('/api/rooms', require('./routes/rooms.js'));
app.use('/api/authenticate', require('./routes/authenticate.js'));
app.use('/api/register', require('./routes/register.js'));
app.use('/api/contacts', require('./routes/contacts.js'));
app.use('/api/settings', require('./routes/user.js'));
