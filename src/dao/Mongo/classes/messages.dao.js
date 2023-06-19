import { messagesModel } from "../models/messages.model.js";

export default class MessageDao {
    async getMessages() {
      try {
        const messages = await messagesModel.find();
        return messages;
      } catch (err) {
        throw err;
      }
    }
    async getMessageId(id) {
      try {
        const message = await messagesModel.find({ _id: id });
        return message;
      } catch (err) {
        throw err;
      }
    }
    async addMessage(newMessage) {
      try {
        const message = await messagesModel.create(newMessage);
        return message;
      } catch (err) {
        throw err;
      }
    }
    async updateMessage(id, body) {
      try {
        const message = await messagesModel.findOneAndUpdate({ _id: id }, body, {
          new: true,
          upsert: true,
        });
        return message;
      } catch (err) {
        throw err;
      }
    }
  
    async deleteMessage(id) {
      try {
        await messagesModel.findByIdAndDelete(id);
        return;
      } catch (err) {
        throw err;
      }
    }
  }
  