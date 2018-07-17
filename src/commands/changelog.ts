import { getLogger } from 'log4js';

import { getChangelogAsImage } from '../services/changelog';

export const command = 'changelog <type> <repo> <release> <theme>';
export const desc = 'Retrieve changelog of a release';
export const builder = yargs => yargs
  .positional('type', {
    describe: 'Project changelog type',
    choices: ['changelog', 'github'],
    type: 'string'
  })
  .positional('repo', {
    describe: 'Project Github repo path (eg: angular/angular)',
    type: 'string'
  })
  .positional('release', {
    describe: 'Project release version (eg: 6.0.0-rc.0)',
    type: 'string'
  })
  .positional('theme', {
    describe: 'Theme of the changelog (eg: material)',
    type: 'string'
  })
  .option('branding', {
    demandOption: false,
    default: true,
    describe: 'Include Release Butler branding',
    type: 'boolean'
  });
export const handler = async ({ repo, type, theme, release, branding }) => {
  try {
    logger.info('Retrieve changelog of a release', repo);
    const project = { repo, type };
    await getChangelogAsImage(project, release, theme, true, false, !branding);
    console.log('exit');
  } catch (err) {
    logger.error('Retrieve changelog of a release failed', err);
  }
  process.exit(0);
};

const logger = getLogger(command);
