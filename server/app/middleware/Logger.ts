import { Application } from "express";

class Logger {
  public static mount(_express: Application): Application {
    return _express.use((req, _res, next) => {
      const now = new Date();
      const time = now.toLocaleTimeString();
      const { method } = req;
      const { path } = req;
      const json = JSON.stringify(req.body, null, 2);

      // eslint-disable-next-line no-console
      console.log(time, method, path, json);

      next();
    });
  }
}

export default Logger;
