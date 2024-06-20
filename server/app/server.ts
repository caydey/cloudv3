import express from "express";
import bodyParser from "body-parser";

import Routes from "./providers/Routes";
import Logger from "./middleware/Logger";

import cors from "cors";
import Socket from "./socket/Socket";
import helmet from "helmet";
import { DATA_ROOT, IS_DEV } from "./config";

// server setup
const app = express();

const port = 3000;

// parsing json and form data
app.use(express.json()); // parsing json
app.use(bodyParser.urlencoded({ extended: true })); // parsing forms

// development
if (IS_DEV) {
  // serve static files
  app.use("/static", cors(), express.static(DATA_ROOT));
  // Cross Origin Resource Sharing
  app.use(cors());

  // my custom logger middleware
  Logger.mount(app);
} else {
  // production header security
  app.use(helmet());
  app.disable("x-powered-by");
}

// configure api routes
Routes.mountAdmin(app);

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Server listening at http://localhost:%s", port);
});

Socket.mountServer(server);
