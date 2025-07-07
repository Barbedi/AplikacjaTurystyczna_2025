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

router.patch("/:id/img", verifyUser, async function (req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id as string, 10);
    const { img: profileImage } = req.body;

    if (!parsedId || !profileImage) {
      res.status(400).json({ message: "ID i zdjęcie są wymagane." });
      return;
    }

    const { message } = await userService.updateImg(parsedId, profileImage);
    res.status(200).json({ message });
    return;
  } catch (err) {
    next(err);
    return;
  }
});





export default router;
