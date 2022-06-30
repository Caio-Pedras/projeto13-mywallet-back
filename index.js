import cors from "cors";
import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import dayjs from "dayjs";
import db from "./db.js";
import {
  deleteTransaction,
  getTransactions,
  postTransactions,
  updateTransaction,
} from "./Controllers/transactionsControllers.js";
import { postLogin, postSignUp } from "./Controllers/sessionControllers.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.get("/transactions", getTransactions);
app.post("/transactions", postTransactions);
app.delete("/transactions/:TransactionId", deleteTransaction);
app.put("/transactions/:TransactionId", updateTransaction);
app.post("/login", postLogin);
app.post("/signup", postSignUp);

app.listen(process.env.PORT);
