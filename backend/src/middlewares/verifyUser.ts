import { NextFunction, Request, Response } from "express";
import { Err } from "../Types";
import jwt from "jsonwebtoken";
import { refreshToken } from "./refreshToken";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | object | undefined;
  }
}

/**
 * Middleware sprawdzający autoryzację użytkownika.
 * Obsługuje:
 *  - cookie (dla web)
 *  - Authorization header (dla mobile)
 *  - automatyczne odświeżenie tokena, jeśli brak ważnego access tokena
 */
export async function verifyUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.["jwt"];
  const authHeader = req.headers?.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  console.log("🔐 verifyUser()");
  console.log("Token (cookie):", token ? "✅ obecny" : "❌ brak");
  console.log("Authorization Header:", bearerToken ? "✅ obecny" : "❌ brak");

  // 🔄 Brak tokena -> próbujemy odświeżyć (np. po wygaśnięciu access tokena)
  if (!token && !bearerToken) {
    console.log("Brak tokena – próba odświeżenia przez refreshToken()");
    return refreshToken(req, res, next);
  }

  const accessToken = token || bearerToken;
  if (!accessToken) {
    return next(new Err("No access token provided", 401));
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env["SECRET_TOKEN"] as string
    ) as { id: number; email: string; role: string };

    console.log("✅ Token verified:", decoded);
    req.user = decoded;
    return next();
  } catch (err: any) {
    console.warn("❌ Token invalid:", err.message);

    // Jeśli token wygasł → spróbuj automatycznie odświeżyć
    if (err.name === "TokenExpiredError") {
      console.log("⏳ Token expired – odświeżam...");
      return refreshToken(req, res, next);
    }

    return next(new Err("Forbidden", 403));
  }
}

/**
 * Sprawdza, czy użytkownik ma odpowiednią rolę.
 */
export function requireRole(userRole: string, requiredRole: string | string[]) {
  if (!requiredRole) return;

  if (Array.isArray(requiredRole)) {
    if (!requiredRole.includes(userRole)) {
      throw new Err("Forbidden", 403);
    }
  } else {
    if (userRole !== requiredRole) {
      throw new Err("Forbidden", 403);
    }
  }
}
