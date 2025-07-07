import express from "express";
const router = express.Router();

/**
 * @openapi
 * /logout:
 *  get:
 *   tags:
 *    - Authentication
 *   summary: Log out the user
 *   description: Logs out the user by clearing the JWT cookie
 *   responses:
 *    200:
 *     description: Logged out successfully
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Internal Server Error
 */
router.get("/", async (_req, res, next) => {
  try {
    // Clear the JWT cookie by setting it to an empty value and expiring it
    res.clearCookie("jwt");
    res.clearCookie("refreshJwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
