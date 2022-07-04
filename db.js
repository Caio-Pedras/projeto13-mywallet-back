import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);
try {
  await mongoClient.connect();
  db = mongoClient.db(process.env.BANCO);
  console.log("Conexão com o banco de dados MongoDB estabelecida");
} catch (e) {
  console.log("Erro ao se conectar ao banco de dados", e);
}
export default db;
