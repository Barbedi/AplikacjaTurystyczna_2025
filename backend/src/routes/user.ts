import express from "express";
import userService from "../services/user";
import { verifyUser } from "../middlewares/verifyUser"; 
import { Err } from "../Types";

const router = express.Router();

router.get("/", verifyUser, async (req, res) => {
  const page = parseInt(req.query["page"] as string) || 1;
  const limit = parseInt(req.query["limit"] as string) || 10;
  const filter = req.query["filter"] as string | undefined;
  const sort = req.query["sort"] as string | undefined;

  try {
    const result = await userService.get(page, limit, filter, sort);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Err) {
      res.status(err.statusCode || 500).json({ message: err.message });
    } else {
      console.error("Unknown error in GET /users:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.get("/:email", verifyUser, async (req, res) => {
  const email = req.params["email"]as string;

  try {
    const result = await userService.getByEmail(email);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Err) {
      res.status(err.statusCode || 500).json({ message: err.message });
    } else {
      console.error("Unknown error in GET /users/:email:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
);



export default router;
