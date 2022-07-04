import cors from "cors";
import express, { json } from "express";
import dotenv from "dotenv";
import sessionRouter from "./Routers/SessionRouter.js";
import transactionRouter from "./Routers/TransactionsRouter.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.use(sessionRouter);
app.use(transactionRouter);

app.listen(process.env.PORT);
