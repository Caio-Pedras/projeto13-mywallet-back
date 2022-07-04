import { Router } from "express";
import {
  deleteTransaction,
  getTransactions,
  postTransactions,
  updateTransaction,
} from "../Controllers/transactionsControllers.js";
import validateUser from "./../Middlewares/validateUser.js";

const transactionRouter = Router();
transactionRouter.use(validateUser);

transactionRouter.get("/transactions", getTransactions);
transactionRouter.post("/transactions", postTransactions);
transactionRouter.delete("/transactions/:TransactionId", deleteTransaction);
transactionRouter.put("/transactions/:TransactionId", updateTransaction);

export default transactionRouter;
