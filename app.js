import cors from "cors";
import express, { json } from "express";
import dotenv from "dotenv";
import authRouter from "./Routers/authRouter.js";
import transactionRouter from "./Routers/transactionsRouter.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.use(authRouter);

app.use(transactionRouter);

app.listen(process.env.PORT);
