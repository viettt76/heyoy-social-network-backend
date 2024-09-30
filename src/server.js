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
const { createClient } = require('redis');
require('express-async-errors');

AppDataSource.initialize()
  .then(async () => {
    const port = process.env.PORT || 8080;
    const app = express();

    app.use(express.json());
    app.use(
      cors({
        credentials: true,
        origin: 'https://viettt76.github.io',
      })
    );
    app.use(cookieParser());

    const server = http.createServer(app);
    const io = socketIo(server, {
      cors: {
        credentials: true,
        origin: 'https:/viettt76.github.io',
      },
    });

    const client = createClient({
      url: 'redis://default:70DLXRMaerOwnWHxpOqISbgFbHw60Kcx@redis-10320.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com:10320',
    });

    client.on('connect', async () => {
      console.log('Redis client connected successfully');
    });

    client.on('error', (err) => {
      console.error('Redis client connection error:', err);
    });

    try {
      await client.connect();
    } catch (error) {
      console.error('Redis client connection failed', error);
    }

    app.use(authMiddleware);

    events(io, client);
    routes(app, io);

    app.use(errorHandler);

    server.listen(port, () => {
      console.log('Server running on port ' + port);
    });
  })
  .catch((error) => console.log(error));
