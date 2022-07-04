import joi from "joi";
import bcrypt from "bcrypt";
async function validateSignUp(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res.status(500).send("As senhas precisam ser iguais");

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
      value: 0,
    };
    res.locals.user = user;
    console.log(user);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export default validateSignUp;
