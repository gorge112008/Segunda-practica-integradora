import AppRouter from "../router.js";
import { MessageFM } from "../../dao/Mongo/classes/DBmanager.js";

export default class ChatRouter extends AppRouter {
  constructor() {
    super();
    this.init();
  }
  init() {
    this.getData("/messages", ["PUBLIC"], async (req, res) => {
      try {
        let messages = await MessageFM.getMessages();
        const limit = req.query.limit;
        if (limit && !isNaN(Number(limit))) {
          messages = messages.slice(0, limit);
        }
        res.sendSuccess(200, messages);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    this.getData("/messages/:mid", ["PUBLIC"], async (req, res) => {
      try {
        const mid = req.params.mid;
        let message = await MessageFM.getMessageId(mid);
        res.sendSuccess(200, message);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    /*****************************************************************POST*************************************************************/
    this.postData("/messages", ["PUBLIC"], async (req, res) => {
      try {
        const newMessage = req.body;
        const response = await MessageFM.addMessage(newMessage);
        res.sendSuccess(200, response);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    /*****************************************************************DELETE*************************************************************/
    this.deleteData("/messages/:mid", ["PUBLIC"], async (req, res) => {
      try {
        const mid = req.params.mid;
        await MessageFM.deleteMessage(mid);
        res.sendSuccess(200, mid);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
  }
}
