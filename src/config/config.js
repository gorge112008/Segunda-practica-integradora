import dotenv from "dotenv";
import {Command} from "commander";

const program = new Command();

program.option("--mode <mode>", "Execution mode", "development");

program.parse();

const enviroment = program.opts().mode.toUpperCase();

dotenv.config({
  path: enviroment === "PRODUCTION" ? ".env.prod" : ".env.dev",
});

const { USER_MONGO, PASS_MONGO, DB_MONGO, PORT } = process.env;

export default {
  mongo: {
    port: PORT || 8080,
    DB_USER: USER_MONGO,
    DB_PASS: PASS_MONGO,
    DB_NAME: DB_MONGO,
    CONNECTION_URL: `mongodb+srv://${USER_MONGO}:${PASS_MONGO}@codercluster.xq93twh.mongodb.net/${DB_MONGO}?retryWrites=true&w=majority`,
  },
};

//MODELO DE PERSISTENCIA EN MONGO
export const PERSISTENCE = "MONGO";

/*PRUEBA DE MODELO DE PERSISTENCIA EN MEMORIA
SOLO GET PRODUCTS 
export const PERSISTENCE = "MEMORY";*/