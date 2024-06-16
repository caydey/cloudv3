import { Router } from "express";

import copyOrMoveRouter from "../api/admin/copyOrMove";
import deleteRouter from "../api/admin/delete";
import mkdirRouter from "../api/admin/mkdir";
import uploadRouter from "../api/admin/upload";

const router = Router();

router.use("/mkdir", mkdirRouter);
router.use("/delete", deleteRouter);
router.use("/upload", uploadRouter);
router.use(
  "/move",
  (req, res, next) => {
    res.locals.action = "MOVE";
    next();
  },
  copyOrMoveRouter
);
router.use(
  "/copy",
  (req, res, next) => {
    res.locals.action = "COPY";
    next();
  },
  copyOrMoveRouter
);

export default router;
