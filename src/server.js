require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const socketIo = require('socket.io');
const http = require('http');
const { AppDataSource } = require('./data-source');
const routes = require('./routes');
const { errorHandler } = require('./utils/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');
const events = require('./events');
require('events').EventEmitter.prototype._maxListeners = 100;

AppDataSource.initialize()
  .then(async () => {
    const port = process.env.PORT || 8080;
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(
      cors({
        credentials: true,
        origin: 'http://localhost:3000',
      })
    );
    const server = http.createServer(app);
    const io = socketIo(server, {
      cors: {
        credentials: true,
        origin: 'http://localhost:3000',
      },
    });

    app.use(authMiddleware);

    events(io);
    routes(app, io);

    app.use(errorHandler);

    server.listen(port, () => {
      console.log('Server running on port ' + port);
    });
  })
  .catch((error) => console.log(error));
