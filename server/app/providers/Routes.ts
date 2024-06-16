import { Application } from "express";

import adminRouter from "../routes/admin";
import userRouter from "../routes/user";

import errorHandlerRouter from "../routes/errorHandler";
import AccessController from "../middleware/AccessController";

class Routes {
  public mountAdmin(_express: Application): Application {
    return _express.use("/api", AccessController.authorizeAdmin, adminRouter);
  }
  public mountUser(_express: Application): Application {
    return _express.use("/api", userRouter);
  }

  public mountErrorHandler(_express: Application): Application {
    return _express.use(errorHandlerRouter);
  }
}

export default new Routes();
