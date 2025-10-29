import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Err } from "../Types";

declare module "express-serve-static-core" {
  interface Request {
    response?: {
      auth: boolean;
      user: { id: number; email: string; role: string };
      message: string;
    };
  }
}

export function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("🔁 Próba odświeżenia tokena");
    console.log("📦 All Cookies:", JSON.stringify(req.cookies, null, 2));
    console.log("📦 Body:", JSON.stringify(req.body, null, 2));
    console.log("📦 Headers x-refresh-token:", req.headers["x-refresh-token"]);
    console.log("📦 Cookie header raw:", req.headers.cookie);
    console.log("📦 Origin:", req.headers.origin);

    // 🧠 Szukamy refresh tokena w 3 miejscach:
    const refreshJwt =
      req.cookies?.["refreshJwt"] ||
      req.body?.refreshToken ||
      req.headers["x-refresh-token"];

    console.log("refreshJwt:", refreshJwt ? `✅ znaleziony (${refreshJwt.substring(0, 20)}...)` : "❌ brak");

    if (!refreshJwt) {
      console.log("❌ Brak refresh tokena w żadnym z miejsc!");
      throw new Err("No refresh token provided", 401);
    }

    jwt.verify(
      refreshJwt as string,
      process.env["REFRESH_SECRET_TOKEN"] as string,
      (err, user) => {
        if (err) {
          console.log("❌ Invalid refresh token:", err.message);
          return next(new Err("Invalid refresh token", 403));
        }

        const tokenUser = user as { id: number; email: string; role: string };
        console.log("✅ Refresh token valid. User:", tokenUser);

        const newAccessToken = jwt.sign(
          { id: tokenUser.id, email: tokenUser.email, role: tokenUser.role },
          process.env["SECRET_TOKEN"] as string,
          { expiresIn: 86400 } // 24h
        );

        const isProd = process.env["NODE_ENV"] === "production";

        // 🍪 Odśwież cookie dla weba
        res.cookie("jwt", newAccessToken, {
          httpOnly: true,
          sameSite: isProd ? "none" : "lax",
          secure: isProd,
          expires: new Date(Date.now() + 86400 * 1000),
        });

        // 📱 Jeśli to mobilka – zwróć token w JSON-ie
        if (req.headers["user-agent"]?.includes("okhttp") || req.body?.mobile) {
          return res.status(200).json({
            auth: true,
            token: newAccessToken,
            message: "Token refreshed (mobile)",
          });
        }

        // 🌐 Web – ustaw dane w req
        req.response = {
          auth: true,
          user: tokenUser,
          message: "Token refreshed successfully",
        };

        req.user = tokenUser;
        console.log("🔁 Nowy access token wygenerowany");
        next();
      }
    );
  } catch (error) {
    console.error("Błąd w refreshToken:", error);
    next(error);
  }
}
