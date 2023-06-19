//import { MessageDAO } from "../dao/Mongo/classes/DBmanager.js";
import { MessageDAO } from "../dao/index.js";

const chatController = {
  getMessages: async (req, res) => {
    try {
      let messages = await MessageDAO.getMessages();
      const limit = req.query.limit;
      if (limit && !isNaN(Number(limit))) {
        messages = messages.slice(0, limit);
      }
      res.sendSuccess(200, messages);
    } catch (err) {
      res.sendServerError({ error: err });
    }
  },
  getMessageId: async (req, res) => {
    try {
      const mid = req.params.mid;
      let message = await MessageDAO.getMessageId(mid);
      res.sendSuccess(200, message);
    } catch (err) {
      res.sendServerError({ error: err });
    }
  },
  addMessage: async (req, res) => {
    try {
      const newMessage = req.body;
      const response = await MessageDAO.addMessage(newMessage);
      res.sendSuccess(200, response);
    } catch (err) {
      res.sendServerError({ error: err });
    }
  },
  deleteMessage: async (req, res) => {
    try {
      const mid = req.params.mid;
      await MessageDAO.deleteMessage(mid);
      res.sendSuccess(200, mid);
    } catch (err) {
      res.sendServerError({ error: err });
    }
  },
};
export default chatController;
