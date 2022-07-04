import db from "../db.js";
import { v4 as uuid } from "uuid";

export async function postSignUp(req, res) {
  try {
    const user = res.locals.user;
    await db.collection("users").insertOne(user);
    res.status(201).send("Usuário criado com sucesso");
  } catch (e) {
    res.status(500).send("Houve um erro na criaçãod o usuário");
  }
}

export async function postLogin(req, res) {
  try {
    const user = res.locals.user;
    const checkSession = await db
      .collection("sessions")
      .findOne({ userID: user._id });
    console.log(checkSession);

    if (checkSession) return res.status(200).send(checkSession.token);
    const token = uuid();
    await db.collection("sessions").insertOne({
      userID: user._id,
      token,
      date: Date.now(),
    });
    res.status(201).send(token);
  } catch (e) {
    console.log(e);
    res.status(500).send("houve um erro no login");
  }
}

export async function logout(req, res) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.satus(404).send("não autorizado");
    await db.collection("sessions").deleteOne({ token });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
}
