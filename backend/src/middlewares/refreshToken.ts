import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Err } from "../Types";

declare module "express-serve-static-core" {
  interface Request {
    response?: {
      auth: boolean;
      user: { email: string };
      message: string;
    };
    user?: { email: string; role?: string } | undefined;
  }
}

export function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshJwt } = req.cookies;
    if (!refreshJwt) {
      throw new Err("No refresh token provided", 401);
    }

    jwt.verify(
      refreshJwt,
      process.env["REFRESH_SECRET_TOKEN"] as string,
      (err: jwt.VerifyErrors | null, user: string | object | undefined) => {
        if (err) {
          return next(new Err("Invalid refresh token", 403));
        }
        const tokenUser = user as { email: string; role: string };
        if (!tokenUser?.email || !tokenUser?.role) {
          return next(new Err("Invalid token payload", 403));
        }

        const accessToken = jwt.sign(
          { email: tokenUser.email, role: tokenUser.role }, // dodaj role
          process.env["SECRET_TOKEN"] as string,
          {
            expiresIn: 60000,
          },
        );

        const cookieOptions = {
          httpOnly: true,
          expires: new Date(Date.now() + 60000),
        };

        res.cookie("jwt", accessToken, cookieOptions);

        req.response = {
          auth: true,
          user: tokenUser,
          message: "Token refreshed successfully",
        };
        req.user = tokenUser;
        return next();
      },
    );
  } catch (error) {
    next(error);
  }
}
