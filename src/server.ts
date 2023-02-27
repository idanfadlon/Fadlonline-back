import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => {
  console.log("connected to mongo DB");
});

const app = express();
import http from 'http'
const server = http.createServer(app)
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyParser.json());

import authRouter from "./routes/auth_routes";
app.use("/auth", authRouter);

import postRouter from "./routes/post_routes";
app.use("/post", postRouter);

export = server;
