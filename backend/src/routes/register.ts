import express from "express";
const router = express.Router();
import registerService from "../services/register";
import { Users } from "../Types";

router.post("/", async function (req, res, next) {
  try {
    const user: Users = req.body;
    const message = await registerService.registerClient(user);
    res.status(201).json({ message });
  } catch (err: any) {
    // Sprawdź czy to błąd z kodem statusu (np. 409 dla istniejącego użytkownika)
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

export default router;