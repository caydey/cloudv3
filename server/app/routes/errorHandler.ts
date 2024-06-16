import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
  res.status(404).send({
    error: "Not found",
    location: req.originalUrl,
    method: req.method,
  });
});

export default router;
