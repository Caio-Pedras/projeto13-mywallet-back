import db from "../db.js";
import joi from "joi";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { stripHtml } from "string-strip-html";
export async function postTransactions(req, res) {
  try {
    const userToken = res.locals.userToken;
    const { type } = req.body;
    const description = stripHtml(req.body.description).result.trim();
    const value = Number(stripHtml(req.body.value).result.trim());
    if (value <= 0)
      return res.status(400).send("Envie apenas valores positivos");
    const transactionSchema = joi.object({
      value: joi.number().required(),
      description: joi.string().required(),
      type: joi.string().valid("deposit", "withdraw").required(),
    });
    const validation = transactionSchema.validate(
      { value, type, description },
      { abortEarly: false }
    );
    if (validation.error) {
      res.status(422).send(validation.error);
      return;
    }

    const userId = userToken.userID;
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (type === "withdraw" && user.value < value) {
      return res.status(400).send("Falta saldo para essa operação");
    }

    if (type === "deposit") {
      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { value: user.value + value } }
        );
    } else {
      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { value: user.value - value } }
        );
    }
    const transaction = {
      value,
      type,
      userId,
      date: dayjs().format("DD/MM/YY"),
    };
    await db.collection("transactions").insertOne(transaction);
    res.status(201).send("Transação cadastrada com sucesso");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
export async function getTransactions(req, res) {
  try {
    const userToken = res.locals.userToken;

    const userTransactions = await db
      .collection("transactions")
      .find({ userId: userToken.userID })
      .toArray();
    const userId = userToken.userID;
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });
    const data = { userTransactions, value: user.value, name: user.name };
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function deleteTransaction(req, res) {
  const userToken = res.locals.userToken;

  const transactionId = req.params.TransactionId;
  try {
    const transaction = await db
      .collection("transactions")
      .findOne({ _id: new ObjectId(transactionId) });

    if (!transaction)
      return res.status(404).send("não foi possiver encontrar essa transação");
    const userId = userToken.userID.toString();
    const transactionUser = transaction.userId.toString();

    if (userId != transactionUser)
      return res.status(401).send("Operação não autorizada");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (transaction.type === "deposit" && user.value < transaction.value) {
      return res.status(400).send("Falta saldo para essa operação");
    }

    if (transaction.type === "deposit") {
      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { value: user.value - transaction.value } }
        );
    } else {
      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { value: user.value + transaction.value } }
        );
    }

    await db
      .collection("transactions")
      .deleteOne({ _id: new ObjectId(transactionId) });
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

export async function updateTransaction(req, res) {
  const userToken = res.locals.userToken;
  const transactionId = req.params.TransactionId;
  const { type } = req.body;
  const description = stripHtml(req.body.description).result.trim();

  const value = Number(stripHtml(req.body.value).result.trim());
  const transactionSchema = joi.object({
    value: joi.number().required(),
    type: joi.string().valid("deposit", "withdraw").required(),
    description: joi.string().required(),
  });
  const validation = transactionSchema.validate(
    { value, type },
    { abortEarly: false }
  );
  if (validation.error) {
    res.status(422).send(validation.error);
    return;
  }

  try {
    const transaction = await db
      .collection("transactions")
      .findOne({ _id: new ObjectId(transactionId) });
    if (!transaction)
      return res.status(404).send("não foi possiver encontrar essa transação");
    if (transaction.type !== type)
      return res.status(401).send("não autorizado");
    const userId = userToken.userID.toString();
    const transactionUser = transaction.userId.toString();
    if (userId !== transactionUser)
      return res.status(401).send("Operação não autorizada");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (type === "deposit") {
      if (transaction.value > value) {
        const difference = transaction.value - value;
        if (difference > user.value)
          return res.status(401).send("Falta saldo para concluir a operação");
        await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $set: { value: user.value - difference, description } }
          );
        await db
          .collection("transactions")
          .updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { value: value, description } }
          );
      } else {
        const difference = value - transaction.value;
        await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $set: { value: user.value + difference, description } }
          );
        await db
          .collection("transactions")
          .updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { value: value, description } }
          );
      }
    } else {
      if (transaction.value < value) {
        const difference = value - transaction.value;

        if (difference > user.value)
          return res.status(401).send("Falta saldo para concluir a operação");

        await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $set: { value: user.value - difference, description } }
          );
        await db
          .collection("transactions")
          .updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { value: value, description } }
          );
      } else {
        const difference = transaction.value - value;
        await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $set: { value: user.value + difference, description } }
          );
        await db
          .collection("transactions")
          .updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { value: value, description } }
          );
      }
    }
    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    res.satus(500).send(e);
  }
}
