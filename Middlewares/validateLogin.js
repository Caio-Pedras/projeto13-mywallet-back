import db from "../db.js";
import bcrypt from "bcrypt";

async function validateLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await db.collection("users").findOne({ email });
    if (!user)
      return res.status(404).send("Informe os dados corretos para logar");
    const passwordHash = bcrypt.compareSync(password, user.password);
    if (!passwordHash)
      return res.status(404).send("Informe os dados corretos para logar");
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(500).send(error);
  }
}
export default validateLogin;
