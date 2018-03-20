import 'now-env';
import yargs from 'yargs';
import { configure } from 'log4js';

import { removeAllTweets } from './services/twitter';
import { runReleaseWatcher } from './services/release';
import { initProjectData, removeAllProjectData } from './services/project';

const configureLogger = debug =>
  configure({
    appenders: { out: { type: 'stdout' } },
    categories: {
      default: { appenders: ['out'], level: debug ? 'debug' : 'info' }
    }
  });

const argv = yargs
  .command(
    'remove',
    'Removes application data',
    {
      twitter: {
        type: 'boolean',
        description: 'Removes all tweets from user timeline'
      },
      database: {
        type: 'boolean',
        description: 'Removes all project data from database'
      }
    },
    async ({ twitter, database, debug }) => {
      configureLogger(debug);
      if (twitter) {
        await removeAllTweets();
      }
      if (database) {
        await removeAllProjectData();
      }
    }
  )
  .command(
    'init',
    'Adds project and initial versions to the database',
    {
      name: {
        alias: 'n',
        type: 'string',
        description: 'Project name, eg: Angular',
        demandOption: true
      },
      repo: {
        alias: 'p',
        type: 'string',
        description: 'Project Github repo path, eg: angular/angular',
        demandOption: true
      },
      url: {
        alias: 'u',
        type: 'string',
        description: 'Project Github changelog url',
        demandOption: true
      },
      urlType: {
        alias: 'ut',
        type: 'string',
        description:
          'Project Github changelog url type, eg: changelog or github',
        demandOption: true
      },
      hashtags: {
        alias: 'h',
        type: 'string',
        description: 'Comma separated list of hashtags',
        demandOption: true
      }
    },
    async ({ name, repo, urlType, url, hashtags, debug }) => {
      configureLogger(debug);
      await initProjectData(name, repo, urlType, url, hashtags);
    }
  )
  .command(
    ['start'],
    'Run releasebot app, check for and tweet about new releases of projects',
    {
      schedule: {
        alias: 's',
        type: 'string',
        description: 'Cron style schedule',
        default: '0 * * * * *'
      },
    },
    ({ debug, schedule }) => {
      configureLogger(debug);
      runReleaseWatcher(schedule)
    }
  )
  .option('debug', { type: 'boolean', description: 'Set debug log level' })
  .help().argv;
