import AppRouter from "../router.js";
import { UserFM } from "../../dao/Mongo/classes/DBmanager.js";

export default class UsersRouter extends AppRouter {
  constructor() {
    super();
    this.init();
  }
  init() {
    this.getData("/users", ["PUBLIC"], async (req, res) => {
      try {
        const limit = req.query.limit;
        const query = req.query;
        let users =
          Object.keys(query).length > 0
            ? await UserFM.getUserUnique(query)
            : await UserFM.getUsers();
        if (limit && !isNaN(Number(limit))) {
          users = users.slice(0, limit);
        }
        res.sendSuccess(200, users);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    this.getData("/users/:iud", ["PUBLIC"], async (req, res) => {
      try {
        const iud = req.params.iud;
        let user = await UserFM.getUserId(iud);
        res.sendSuccess(200, user);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    /*****************************************************************POST*************************************************************/
    this.postData("/users", ["PUBLIC"], async (req, res) => {
      try {
        const newUser = req.body;
        const response = await UserFM.addUser(newUser);
        res.sendSuccess(200, response);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    /*****************************************************************DELETE*************************************************************/
    this.deleteData("/users/:iud", ["PUBLIC"], async (req, res) => {
      try {
        const iud = req.params.iud;
        await UserFM.deleteUser(iud);
        res.sendSuccess(200, iud);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
  }
}
