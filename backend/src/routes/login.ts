import express from "express";
const router = express.Router();
import loginService from "../services/login";


router.post("/", async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const { email: id } = await loginService.fetchClient(email, password);

    res.status(200).json({
      auth: true,
      user: {
        email: id,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
