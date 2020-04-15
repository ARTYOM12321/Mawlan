const mongoose = require('mongoose');
let secureEnv = require('secure-env');
const dotenv = require('dotenv');
const app = require('./app');
//
//
process.on('uncaughtException', err => {
  console.log((err.name, err.message));
  console.log('uncaughtException: SHUTTING DOWN...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('CONNECTED to the DATABASE');
  });
//........CALLING UPON THE SERVER...........
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`website Running on Port ${port}...`);
});

//for error Promises in Server.js
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION: SHUTTING DOWN...');
  server.close(() => {
    process.exit(1);
  });
});
