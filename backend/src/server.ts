import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger";
import register from "./routes/register";
import login from "./routes/login";
import authenticate from "./routes/authenticate";
import logout from "./routes/logout";
import routeTrailRouter from "./routes/routeTrail";
import user from "./routes/user";
import file from "./routes/file";
import shelters from "./routes/shelters";
import peaks from "./routes/peaks";
import trails from "./routes/trails";
import trailsPoint from "./routes/trailsPoint";
import favouriteTrails from "./routes/favouriteTrails";
import communityTrailsRouter from "./routes/communitytrails";

const app = express();

const corsOptions = {
  credentials: true,
  origin: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Witaj na HikeUP" });
});
app.use("/register", register);
app.use("/login", login);
app.use("/authenticate", authenticate);
app.use("/logout", logout);
app.use("/routeTrail", routeTrailRouter);
app.use("/users", user);
app.use("/files", file);
app.use("/shelters", shelters);
app.use("/peaks", peaks);
app.use("/trails", trails);
app.use("/trailsPoint", trailsPoint);
app.use("/favourite-trails", favouriteTrails);
app.use("/community-trails", communityTrailsRouter);
// Obsługa nieznalezionych endpointów
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Obsługa błędów serwera
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ message });
});

export default app;
