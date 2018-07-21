import { scheduleJob } from 'node-schedule';
import { getLogger } from 'log4js';

import { initDb } from '../persistence/db';
import {
  findMessages,
  insertMessage,
  Message,
  removeMessageById
} from '../persistence/chat';
import {
  getLatestVersion,
  getNextVersion,
  isChangelogRepository
} from '../api/github';
import { getUser, getMessages, sendMessage, uploadMedia } from '../api/twitter';
import { getChangelogAsImage } from './changelog';

const logger = getLogger('Chat Service');
const loggerRemote = getLogger('remote');
const { TWITTER_USER_ID } = process.env;
const SCHEDULE = '*/2 * * * *'; // once every two minutes

let counterExec = 0;
let counterSkippedExec = 0;
let executionInProgress = false;

export const runChatWatcher = () => {
  logger.info('Setup scheduler with schedule', SCHEDULE);
  scheduleJob(SCHEDULE, async () => {
    if (executionInProgress) {
      logger.warn(
        `Chat execution #${++counterExec} skipped, skipped count: ${++counterSkippedExec}`
      );
      return;
    }
    executionInProgress = true;
    try {
      logger.info(`Chat execution #${++counterExec} starts`);
      await initDb();
      const storedMessages = await findMessages();
      const storedMessagesIds = storedMessages.map(m => m.id);
      const messages: Message[] = await getMessages();
      const newMessages = messages
        .filter(m => m.senderId !== TWITTER_USER_ID)
        .filter(m => !storedMessagesIds.includes(m.id));
      logger.info(
        `Chat execution #${counterExec}, found ${
          newMessages.length
        } new messages`
      );

      newMessages.forEach(async m => {
        try {
          const user = await getUser(m.senderId);
          logger.info(
            `Received new message from @${user.screen_name}: ${m.text}`
          );
          const { replyType, replyParams } = resolveReplyTypeAndParams(m.text);
          loggerRemote.info(
            {
              replyType,
              replyParams,
              message: m.text,
              sender: `@${user.screen_name}`
            },
            { tags: ['RB-chat', 'RB-stats'] }
          );
          const replyBuilder = REPLY_BUILDER[replyType];
          const { reply, mediaId } = await replyBuilder(replyParams, user.name);
          await sendMessage(m.senderId, reply, mediaId);
          logger.info(`Replied to @${user.screen_name}: ${replyType}`);
          await insertMessage(m);
          while (storedMessagesIds.length > 20) {
            await removeMessageById(storedMessagesIds.shift());
          }
        } catch (err) {
          logger.error(err);
        }
      });
    } catch (err) {
      logger.error(err);
    } finally {
      executionInProgress = false;
    }
  });
};

const getMediaId = async (repo: string, version: string): Promise<string> => {
  try {
    const type = (await isChangelogRepository(repo)) ? 'changelog' : 'github';
    const project = { type, repo };
    const imageBuffer = await getChangelogAsImage(project, version, 'default');
    const { media_id_string } = (await uploadMedia(imageBuffer)) as any;
    return media_id_string;
  } catch (err) {
    logger.error('Media upload failed', err);
  }
};

const buildLatestReply = async (params: string[], username: string) => {
  const [repo] = params;
  const version = await getLatestVersion(repo);
  const mediaId = await getMediaId(repo, version);
  const reply = version
    ? `The latest version of ${repo} repo is ${version}, enjoy! 😊`
    : `Sorry ${username}, I couldn't find next version for ${repo} repo, does it exists? 😥`;
  return { reply, mediaId };
};

const buildNextReply = async (params, username) => {
  const [repo] = params;
  const version = await getNextVersion(repo);
  const mediaId = await getMediaId(repo, version);
  const reply = version
    ? `Next version of ${repo} repo is ${version}, enjoy! 😊`
    : `Sorry ${username}, I couldn't find next version for ${repo} repo, does it exists? 😥`;
  return { reply, mediaId };
};

const buildReleaseReply = async (params, username) => {
  const [repo, version] = params;
  const mediaId = await getMediaId(repo, version);
  const reply = version
    ? `Here you go ${username}, the changelog of ${repo} repo for ${version} version! 😊`
    : `Sorry ${username}, I couldn't find ${version} version for ${repo} repo, does it exists? 😥`;
  return { reply, mediaId };
};

const buildHelpReply = async (params, username) => ({
  reply: `Hi ${username}! 

My name is Release Butler and I can give you info about releases of your favourite GitHub projects!
Write me a message which starts with one of the following:

/release <repo> <version>
/latest <repo>
/next <repo>
/help

🔍 Parameters description
 
repo - github repository (eg: angular/angular or facebook/react)

version - desired version (eg: 1.0.0 or v6.0.0-rc1)`
});

const buildUnknownReply = async (params, username) => ({
  reply: `Sorry ${username}, but I don't understand 🤔

Try writing /help ...`
});

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
