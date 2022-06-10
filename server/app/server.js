const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const errors = require('./errors');
const socket = require('./socket/socket')

const logger = require('./logger')

// server setup
const app = express();

const port = 3000;

// parsing json and form data
app.use(express.json()); // parsing json
app.use(bodyParser.urlencoded({ extended: true })); // parsing forms


// development
if (process.env.NODE_ENV === 'development') {
  const cors = require('cors');
  // serve static files
  app.use("/static", cors(), express.static(process.env.DATA_ROOT));
  // Cross Origin Resource Sharing
  app.use(cors());

  // my custom logger middleware
  app.use(logger)
}

// configure api routes
routes(app);

// handle errors
errors(app);

// begin server
const server = app.listen(port, () => {
  console.log('Server listening at http://localhost:%s', port);
});

// handle websockets
socket(server)
