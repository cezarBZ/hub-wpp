import { IMessage } from "../../interfaces/message.types";
import { MessageModel } from "./message.model";

export const MessageRepository = {
  async save(msg: IMessage) {
    return await MessageModel.create(msg);
  },

  async getByChat(chatId: string, limit = 20) {
    return await MessageModel.find({ chatId })
      .sort({ timestamp: -1 })
      .limit(limit);
  },

  async findLastMessage(chatId: string) {
    return await MessageModel.findOne({ chatId }).sort({ timestamp: -1 });
  },
};
