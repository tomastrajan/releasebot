import * as mongoose from 'mongoose';

const Message = mongoose.model('Message', {
  id: String,
  type: String,
  created: String,
  recipientId: String,
  senderId: String,
  text: String,
  entities: Object,
  attachment: Object,
});

export const findMessages = (): Promise<Message[]> =>
  Message.find().sort('created').exec();

export const insertMessage = (message: Message) => Message.create(message);

export const removeMessageById = (id: string) => Message.remove({ id });

export interface Message {
  id: string;
  type: string;
  created: string;
  recipientId: string;
  senderId: string;
  text: string;
  entities: any;
  attachment: any;
}