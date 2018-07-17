import * as Confirm from 'prompt-confirm';
import { getLogger } from 'log4js';

import { initDb } from '../persistence/db';
import { findProjects, removeProject } from '../persistence/project';
import { getTweets, deleteTweet } from '../api/twitter';

const { TWITTER_USER_ID } = process.env;

export const command = 'remove <type>';
export const desc = 'DANGER - this command removes data from production, proceed with caution';
export const builder = yargs => yargs
  .positional('type', {
    describe: 'Type of data that will be removed',
    choices: ['tweets', 'database'],
    type: 'string'
  })
  .option('confirm-intent', {
    demandOption: false,
    default: false,
    describe: 'This command will not work without confirming your intent by setting this flag',
    type: 'boolean'
  });
export const handler = async ({ type, confirmIntent }) => {
  try {
    await initDb();
    if (!confirmIntent) {
      logger.warn('This command will not work without confirming your intent by setting --confirm-intent flag');
      process.exit(0);
    }
    const confirmCli = await new Confirm(`Are you really sure you want to remove ${type} data from production`).run();
    if(!confirmCli) {
      process.exit(0);
    }

    if (type === 'tweets') {
      logger.warn('Remove all Tweets from the timeline');
      const tweets: any = await getTweets(TWITTER_USER_ID);
      await Promise.all(tweets.map(tweet => deleteTweet(tweet.id_str)));
      logger.warn(`Removed ${tweets.length} tweets from timeline`);
    }

    if (type === 'database') {
      logger.warn('Remove all production data from database');

      const projects = await findProjects();
      for (let project of projects) {
        logger.warn('Removing project production data', project.name);
        await removeProject(project.repo);
      }
      logger.warn(`Removed all data of all ${projects.length} projects from production`);
    }
  } catch (err) {
    logger.error('Removing of production data failed', err);
  }
  process.exit(0);
};

const logger = getLogger(command);
