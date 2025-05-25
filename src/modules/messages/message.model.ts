import { Document, model, Schema } from "mongoose";
import { IMessage } from "../../interfaces/message.types";

export interface IMessageDocument extends IMessage, Document {}

const MessageSchema = new Schema<IMessageDocument>(
  {
    chatId: { type: String, required: true },
    from: { type: String, required: true },
    text: { type: String },
    type: { type: String },
    timestamp: { type: Date, required: true },
    fromMe: { type: Boolean, required: true },
    repliedByLLM: { type: Boolean },
    llmResponse: { type: String },
    mediaUrl: { type: String, required: false },
    mimeType: { type: String, required: false },
    fileName: { type: String, required: false },
    duration: { type: Number, required: false },
    stickerEmoji: { type: String, required: false },
    quotedMessage: {
      text: { type: String, required: false },
      type: { type: String, required: false },
      fromMe: { type: Boolean, require: false },
      from: { type: String, require: false },
    },
  },
  { timestamps: true }
);

export const MessageModel = model<IMessageDocument>("Message", MessageSchema);
