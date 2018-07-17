import { getLogger } from 'log4js';

import { getMessages, sendMessage } from '../api/twitter';

export const command = 'messages [recipientId] [message]';
export const desc = 'Get own Twitter messages or send direct message to Twitter user';
export const builder = yargs => yargs
  .positional('recipientId', {
    describe: 'Twitter user id (eg: 1234567890)',
    type: 'string'
  })
  .positional('message', {
    describe: 'Message text',
    type: 'string'
  });
export const handler = async ({ recipientId, message }) => {
  try {
    if (recipientId && message) {
      logger.info('Send direct message to Twitter user', recipientId);
      await sendMessage(recipientId, message);
      logger.info(`Message "${message}" was sent to ${recipientId}`);
    } else {
      logger.info('Get own Twitter messages');
      const messages: any = await getMessages();
      logger.info(`Retrieved messages: ${messages.events.length}`);
      messages.events.forEach(event => {
        const { sender_id, message_data } = event[event.type];
        logger.info(`Message from ${sender_id}: ${message_data.text}`);
      });
    }
  } catch (err) {
    logger.error('Get or send Twitter messages failed', err);
  }
  process.exit(0);
};

const logger = getLogger(command);