import { getLogger } from 'log4js';

import { initDb } from '../persistence/db';
import { insertProject } from '../persistence/project';
import { getRepoVersions } from '../api/github';

export const command = 'init <name> <repo> <type> <hashtags>';
export const desc = 'Add project and initial versions to the database';
export const builder = yargs => yargs
  .positional('name', {
    describe: 'Project name (eg: Angular)',
    type: 'string'
  })
  .positional('repo', {
    describe: 'Project Github repo path (eg: angular/angular)',
    type: 'string'
  })
  .positional('type', {
    describe: 'Project changelog type',
    choices: ['changelog', 'github'],
    type: 'string'
  })
  .positional('hashtags', {
    describe: 'Comma separated list of hashtags',
    type: 'string'
  })
  .option('skip', {
    demandOption: false,
    default: false,
    describe: 'Skip latest version to trigger first release',
    type: 'boolean'
  });
export const handler = async ({ name, repo, type, hashtags, skip }) => {
  try {
    await initDb();
    logger.info('Init project data', name, repo, type, hashtags);
    const versions = await getRepoVersions(repo);
    if (skip) {
      const skipped = versions.shift();
      logger.info('Skipping latest project version to trigger first release', skipped);
    }
    if (versions.length) {
      await insertProject(name, repo, type, hashtags, versions);
    } else {
      logger.warn('No versions found');
    }
    logger.info('Project data initialized', name, versions.length, 'versions');
  } catch (err) {
    logger.error('Project data initialization failed', err);
  }
  process.exit(0);
};

const logger = getLogger(command);
