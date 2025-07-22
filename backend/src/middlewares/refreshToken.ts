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
    const { refreshJwt } = req.cookies;
    console.log("refreshJwt:", refreshJwt);
    if (!refreshJwt) {
      throw new Err("No refresh token provided", 401);
    }

    jwt.verify(
      refreshJwt,
      process.env["REFRESH_SECRET_TOKEN"] as string,
      (err: jwt.VerifyErrors | null, user: string | object | undefined) => {
        if (err) {
          console.log("❌ Invalid refresh token:", err.message);
          return next(new Err("Invalid refresh token", 403));
        }
        const tokenUser = user as { id: number; email: string; role: string };
        console.log("✅ Refresh token valid. User:", tokenUser);

        const accessToken = jwt.sign(
          { id: tokenUser.id, email: tokenUser.email, role: tokenUser.role }, // dodaj role
          process.env["SECRET_TOKEN"] as string,
          {
            expiresIn: 86400, // 24 godziny (jak w login.ts)
          },
        );

        const cookieOptions = {
          httpOnly: true,
          expires: new Date(Date.now() + 86400 * 1000), // 24 godziny w milisekundach
        };

        res.cookie("jwt", accessToken, cookieOptions);

        req.response = {
          auth: true,
          user: tokenUser,
          message: "Token refreshed successfully",
        };
        req.user = tokenUser;
        console.log("🔁 Nowy access token wygenerowany");
        return next();
      },
    );
  } catch (error) {
    console.error("Błąd w refreshToken:", error);
    next(error);
  }
}
