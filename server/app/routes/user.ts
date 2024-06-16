import { Router } from "express";

import lsRouter from "../api/user/ls";

const router = Router();

router.use("/api/ls", lsRouter);

export default router;
