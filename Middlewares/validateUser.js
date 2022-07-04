import db from "../db.js";
async function validateUser(req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).send("não autorizado");
    const userToken = await db.collection("sessions").findOne({ token });
    if (!userToken) return res.status(422).send("Usuário não econtrado");

    res.locals.userToken = userToken;

    next();
  } catch (error) {
    res.status(500).send(error);
  }
}
export default validateUser;
