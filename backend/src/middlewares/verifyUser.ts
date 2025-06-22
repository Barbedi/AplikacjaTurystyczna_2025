import { NextFunction, Request, Response } from "express";
import { Err } from "../Types";
import jwt from "jsonwebtoken";
import { refreshToken } from "./refreshToken";

declare module "express-serve-static-core" {
  interface Request {
   user?:string | object | undefined
  }
}

export function verifyUser(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies["jwt"];
  const authHeader = req.headers.authorization;

  console.log("🔐 verifyUser()");
  console.log("Token (cookie):", token);
  console.log("Authorization Header:", authHeader);

  if (!token && !authHeader) {
    console.log("Brak tokena – próba odświeżenia");
    refreshToken(req, _res, next);
  }

  if (token) {
    jwt.verify(
      token,
      process.env["SECRET_TOKEN"] as string,
      (err: jwt.VerifyErrors | null, user: string | object | undefined) => {
        if (err) {
          console.log("❌ Token invalid:", err.message);
          const error = new Err("Forbidden", 403);
          return next(error);
        }
        console.log("✅ Token verified:", user);
        req.user = user;
        return next();
      }
    );
  } else if (authHeader) {
    const token = authHeader.split(" ")[1] as string;
    jwt.verify(
      token,
      process.env["SECRET_TOKEN"] as string,
      (err: jwt.VerifyErrors | null, user: string | object | undefined) => {
        if (err) {
          const error = new Err("Forbidden", 403);
          return next(error);
        }

        req.user = user;
        return next();
      }
    );
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
