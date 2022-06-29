import cors from "cors";
import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import dayjs from "dayjs";
import db from "./db.js";
import { postTransactions } from "./controllers/transactionsControllers.js";
import { postLogin, postSignUp } from "./controllers/sessionControllers.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.post("/transactions", postTransactions);
app.post("/login", postLogin);
app.post("/signup", postSignUp);

app.listen(process.env.PORT);
