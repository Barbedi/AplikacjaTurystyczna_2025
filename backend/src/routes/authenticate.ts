import express from "express";
import { requireRole, verifyUser } from "../middlewares/verifyUser";
import { refreshToken } from "../middlewares/refreshToken";
import { Err } from "../Types";

const router = express.Router();

/**
 * @openapi
 * /authenticate:
 *  get:
 *   tags:
 *    - Authentication
 *   summary: Check if user is authenticated
 *   description: Verifies user authentication status and optionally checks role permissions
 *   parameters:
 *    - name: requiredRole
 *      in: query
 *      required: false
 *      description: Required user role for access
 *      schema:
 *        type: string
 *        enum: [admin, user, moderator]
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: User is authenticated
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         auth:
 *          type: boolean
 *          example: true
 *          description: Authentication status
 *         user:
 *          type: object
 *          description: Authenticated user data
 *          properties:
 *           id:
 *            type: string
 *            description: User ID
 *           email:
 *            type: string
 *            format: email
 *            description: User email address
 *           role:
 *            type: string
 *            description: User role
 *            enum: [admin, user, moderator]
 *    401:
 *     description: User not authenticated or invalid token
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          example: "User not authenticated"
 *    403:
 *     description: User authenticated but lacks required role
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          example: "Insufficient permissions"
 *    500:
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          example: "Internal server error"
 */
router.get("/", verifyUser, (req, res, next) => {
  try {
    console.log("📥 /authenticate hit");
    console.log("req.user:", req.user);

    const userRole = (req.user as { email: string; role: string }).role;
    console.log("User role:", userRole);
    console.log("Required role (query):", req.query["requiredRole"]);
    requireRole(userRole, req.query["requiredRole"] as string);

    res.status(200).json({ auth: true, user: req.user });
  } catch (error) {
    console.error("Błąd w /authenticate:", error);
    next(error);
  }
});

/**
 * @openapi
 * /authenticate/refresh:
 *  post:
 *   tags:
 *    - Authentication
 *   summary: Refresh access token
 *   description: Refreshes the access token using a valid refresh token from cookies
 *   security:
 *    - cookieAuth: []
 *   responses:
 *    200:
 *     description: Access token successfully refreshed
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         auth:
 *          type: boolean
 *          example: true
 *          description: Authentication status
 *         user:
 *          type: object
 *          description: User data
 *          properties:
 *           id:
 *            type: string
 *            description: User ID
 *           email:
 *            type: string
 *            format: email
 *            description: User email address
 *           role:
 *            type: string
 *            description: User role
 *            enum: [admin, user, moderator]
 *         message:
 *          type: string
 *          example: "Token refreshed successfully"
 *          description: Success message
 *     headers:
 *      Set-Cookie:
 *       description: New access token cookie
 *       schema:
 *        type: string
 *    401:
 *     description: Invalid or expired refresh token
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          example: "Invalid refresh token"
 *    403:
 *     description: Refresh token not provided
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          example: "No refresh token provided"
 *    500:
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          example: "Internal server error"
 */
router.post("/refresh", refreshToken, (req, res, next) => {
  try {
    console.log("📥 /authenticate/refresh hit"); // Log to check if endpoint is reached
    const response = req.response;

    if (!response) {
      console.error("No response provided"); // Log error if response is missing
      throw new Err("No response provided", 500);
    }

    console.log("Response:", response); // Log the response object
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in refresh token endpoint:", error); // Log any caught errors
    next(error);
  }
});

export default router;
