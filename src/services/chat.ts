import { scheduleJob } from 'node-schedule';
import { getLogger } from 'log4js';

import { initDb } from '../persistence/db';
import {
  findMessages,
  insertMessage,
  Message,
  removeMessageById
} from '../persistence/chat';
import { getUser, getMessages, sendMessage } from '../api/twitter';
import { getLatestVersion, getNextVersion } from '../api/github';

const logger = getLogger('Chat Service');
const { TWITTER_USER_ID } = process.env;
const SCHEDULE = '* * * * *'; // once a minute as per rate limit

let counterExec = 0;

export const runChatWatcher = () => {
  logger.info('Setup scheduler with schedule', SCHEDULE);
  scheduleJob(SCHEDULE, async () => {
    try {
      await initDb();
      const storedMessages = await findMessages();
      const storedMessagesIds = storedMessages.map(m => m.id);
      const messages: Message[] = await getMessages();
      const newMessages = messages
        .filter(m => m.senderId !== TWITTER_USER_ID)
        .filter(m => !storedMessagesIds.includes(m.id));

      logger.info(
        `Chat execution #${++counterExec} starts, found ${
          newMessages.length
        } new messages`
      );
      newMessages.forEach(async m => {
        try {
          const user = await getUser(m.senderId);
          logger.info(
            `Received new message from @${user.screen_name} ${m.id} ${
              user.name
            } - ${m.text}`
          );
          const { replyType, replyParams } = resolveReplyTypeAndParams(m.text);
          const replyBuilder = REPLY_BUILDER[replyType];
          const reply = await replyBuilder(replyParams, user.name);
          await sendMessage(m.senderId, reply);
          logger.info(`Replied to ${m.senderId}: ${replyType}`);
          await insertMessage(m);
          if (storedMessagesIds.length >= 20) {
            await removeMessageById(storedMessagesIds.shift());
          }
        } catch (err) {
          logger.error(err);
        }
      });
    } catch (err) {
      logger.error(err);
    }
  });
};

const buildLatestReply = async (params, username) => {
  const version = await getLatestVersion(params[0]);
  return version ? `The latest version of ${params[0]} repo is ${version}, enjoy! 😊`
    : `Sorry, I couldn't find next version for ${params[0]} repo, does it exists? 😥`;
};

const buildNextReply = async (params, username) => {
  const version = await getNextVersion(params[0]);
  return version ? `Next version of ${params[0]} repo is ${version}, enjoy! 😊`
    : `Oops, I couldn't find next version for ${params[0]} repo, does it exists? 😥`;
};

const buildReleaseReply = async (params, username) =>
  `/release is coming soon!`;

const buildHelpReply = async (params, username) =>
  `Hi ${username}! 

My name is Release Butler and I can give you info about releases of your favourite GitHub projects!
Write me a message which starts with one of the following:

/release <type> <repo> <version>
/latest <repo>
/next <repo>
/help

🔍 Details

type - release type (github or changelog)
 
repo - github repository (eg: angular/angular or facebook/react)

version - desired version (eg: 1.0.0, next or latest)
`;

const buildUnknownReply = async (params, username) =>
  `Sorry ${username}, but I don't understand 🤔

Try writing /help ...`;

const resolveReplyTypeAndParams = (
  text: string
): { replyType: string; replyParams: string[] } => {
  const [type, ...replyParams] = text.replace('/', '').split(' ');
  const replyType = REPLY_TYPES.includes(type) ? type : 'unknown';
  return { replyType, replyParams };
};

const REPLY_BUILDER = {
  release: buildReleaseReply,
  latest: buildLatestReply,
  next: buildNextReply,
  help: buildHelpReply,
  unknown: buildUnknownReply
};

const REPLY_TYPES = ['help', 'release', 'latest', 'next'];
