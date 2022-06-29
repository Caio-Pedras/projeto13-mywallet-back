import db from "./../db.js";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { ObjectId } from "mongodb";
export async function postSignUp(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res.status(500).send("As senhas precisam ser iguals");
    const createUserSchema = joi.object({
      name: joi.string().required(),
      email: joi
        .string()
        .pattern(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        )
        .required(),
      password: joi.string().required(),
    });
    const validation = createUserSchema.validate(
      { name, email, password },
      { abortEarly: false }
    );
    if (validation.error) {
      res.status(422).send(validation.error);
      return;
    }
    const user = {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    };
    await db.collection("users").insertOne(user);
    res.status(201).send("Usuário criado com sucesso");
  } catch (e) {
    res.status(500).send("Houve um erro na criaçãod o usuário");
  }
}

export async function postLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await db.collection("users").findOne({ email });
    if (!user)
      return res.status(404).send("Informe os dados corretos para logar");
    const passwordHash = bcrypt.compareSync(password, user.password);
    if (!passwordHash)
      return res.status(404).send("Informe os dados corretos para logar");
    console.log(user);
    const checkSession = await db
      .collection("sessions")
      .findOne({ userID: user._id });
    console.log(checkSession);

    if (checkSession) return res.status(200).send(checkSession.token);
    const token = uuid();
    await db
      .collection("sessions")
      .insertOne({ userID: user._id, token, date: Date.now() });
    res.status(201).send(token);
  } catch (e) {
    console.log(e);
    res.status(500).send("houve um erro no login");
  }
}
