import { NextFunction, Request, Response } from "express";
import { Err } from "../Types";
import jwt from "jsonwebtoken";
import { refreshToken } from "./refreshToken";

declare module "express-serve-static-core" {
  interface Request {
    user?:
      | {
          email: string;
          role?: string; // Dodaj pole role
        }
      | undefined;
  }
}

export function verifyUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies["jwt"];
    const authHeader = req.headers.authorization;

    console.log("🔐 verifyUser -> Token:", token);
    console.log("🔐 verifyUser -> Authorization header:", authHeader);

    if (!process.env["SECRET_TOKEN"]) {
      console.error("❌ SECRET_TOKEN is missing");
      return next(new Err("Missing SECRET_TOKEN in environment", 500));
    }

    if (!token && !authHeader) {
      console.warn("⚠️ No JWT or auth header, calling refreshToken()");
      return refreshToken(req, _res, next);
    }

    const handleVerification = (
      err: jwt.VerifyErrors | null,
      user: string | object | undefined,
    ) => {
      if (err) {
        console.error("❌ JWT verification error:", err);
        return next(new Err("Forbidden", 403));
      }

      console.log("✅ JWT verified, payload:", user);

      if (user && typeof user === "object" && "email" in user) {
        req.user = {
          email: (user as any).email,
          role: (user as any).role,
        };
        return next();
      } else {
        return next(new Err("Forbidden", 403));
      }
    };

    if (token) {
      jwt.verify(
        token,
        process.env["SECRET_TOKEN"] as string,
        handleVerification,
      );
    } else if (authHeader) {
      const token = authHeader.split(" ")[1] as string;
      jwt.verify(
        token,
        process.env["SECRET_TOKEN"] as string,
        handleVerification,
      );
    }
  } catch (error) {
    console.error("🔴 Catch block in verifyUser:", error);
    return next(new Err("Authentication error", 500));
  }
}

export function requireRole(userRole: string, requiredRole: string | string[]) {
  const role = requiredRole;

  if (!role) {
    return;
  }

  if (Array.isArray(role)) {
    if (!role.includes(userRole)) {
      throw new Err("Forbidden", 403);
    }
  } else {
    if (userRole !== role) {
      throw new Err("Forbidden", 403);
    }
  }
}
