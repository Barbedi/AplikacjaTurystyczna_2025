import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger.js"; 

const app = express();

const corsOptions = {
  credentials: true,
  origin: process.env["CLIENT_ORIGIN"] || "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Witaj na HikeUP" });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
