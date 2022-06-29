import db from "./../db.js";
import joi from "joi";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
export async function postTransactions(req, res) {
  const { type, userId } = req.body;
  const value = Number(stripHtml(req.body.value).result.trim());
  const transactionSchema = joi.object({
    value: joi.number().required(),
    type: joi.string().valid("deposit", "withdraw").required(),
  });
  const validation = transactionSchema.validate(
    { value, type, date: dayjs().format("DD/MM/YY") },
    { abortEarly: false }
  );
  if (validation.error) {
    res.status(422).send(validation.error);
    return;
  }
  try {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });
    if (!user) {
      res.status(422).send("Usuário não econtrado");
    }
    const transaction = {
      value,
      type,
      userId,
    };
    await db.collection("transactions").insertOne(transaction);
    res.status(201).send("Transação cadastrada com sucesso");
  } catch (e) {
    res.status(500).send(err);
  }
}
