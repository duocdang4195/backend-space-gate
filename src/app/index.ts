import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import httpStatus from 'http-status';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

import 'dotenv/config';

import routes from '../routes';
import { ErrorFromResponse } from '../utils';
import { Coin98PaymentEvent } from '../services/Web3/services';
import { CHAIN_TYPE, LIST_CHAIN_SUPPORT } from '../constant';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const port = process.env.PORT;

// init middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(cors());

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

function initEvent() {
  const service = new Coin98PaymentEvent(
    CHAIN_TYPE['17000'] as LIST_CHAIN_SUPPORT
  );
  service.initEventListen();
  console.log('init event success, ...');
}

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  initEvent();
});

// v1 api routes
app.use((req, res, next) => {
  //@ts-ignore
  res.io = io;
  next();
});
app.use('', routes);

// handle not found API
app.use((req, res, next) => {
  console.log('apu not found call');
  next(
    new ErrorFromResponse({
      message: 'Api not found',
      statusCode: httpStatus.NOT_FOUND,
    })
  );
});

// init DB
mongoose
  .connect(process.env.DB_RUL || '')
  .then(() => {
    console.log(`Connect DB Success ${process.env.NODE_ENV}`);
  })
  .catch((err) => {
    console.log(`Connect DB fail ${err.message}`);
  });

module.exports = app;
