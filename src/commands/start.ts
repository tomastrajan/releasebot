import { getLogger } from 'log4js';

import { runServer } from '../core/server';
import { runReleaseWatcher } from '../services/release';
import { runChatWatcher } from '../services/chat';

export const command = 'start <schedule>';
export const desc = 'Run Release Butler app, check for and tweet about new releases of watched projects';
export const builder = yargs => yargs
  .positional('schedule', {
    describe: 'Cron style schedule',
    default: '*/30 * * * *',
    type: 'string'
  });
export const handler = async ({ schedule }) => {
  try {
    runReleaseWatcher(schedule);
    runChatWatcher();
    runServer();
  } catch (err) {
    logger.error('Starting of the application failed', err);
    process.exit(1);
  }
};

const logger = getLogger(command);