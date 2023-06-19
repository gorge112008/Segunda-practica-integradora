import mongoose from "mongoose";

export default class MongoSingleton {
  static #instance;

  async connect(CONNECTION_URL) {
    mongoose
      .connect(CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Conexión a la base de datos exitosa");
      })
      .catch((error) => {
        console.log(
          `Error en la conexión a la base de datos: ${error.message}`
        );
      });
  }

  static async getInstance(CONNECTION_URL) {
    if (this.#instance) {
      console.log("The connection is already established");
      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    await this.#instance.connect(CONNECTION_URL);
    return this.#instance;
  }
}
