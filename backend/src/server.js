const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.on('connectRoom', box => {
    socket.join(box);
  })
});

mongoose.connect('mongodb+srv://loxt:loxt@cluster0-yfwep.mongodb.net/omnistack?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }).then(null);

app.use((req, res, next) => {
  req.io = io;

  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes'));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

server.listen(process.env.PORT || 3333);
