import { getLogger } from 'log4js';

import { initDb } from '../persistence/db';
import { findProject, updateProjectVersions } from '../persistence/project';
import { getRepoVersions } from '../api/github';

export const command = 'versions <repo>';
export const desc = 'Get latest versions of a project';
export const builder = yargs => yargs
  .positional('repo', {
    describe: 'Project repo (eg: angular/angular)',
    type: 'string'
  })
  .option('remove-last', {
    demandOption: false,
    default: false,
    describe: 'Remove last version from DB to trigger release',
    type: 'boolean'
  });
export const handler = async ({ repo, removeLast }) => {
  try {
    await initDb();
    if (removeLast) {
      logger.warn(`Remove last version of a project ${repo} from DB`);
      const project = await findProject(repo);
      const [removedVersion, ...versions] = project.versions;
      await updateProjectVersions(repo, versions);
      logger.warn(`Removed version ${removedVersion} of a ${repo} repo from DB`);
    } else {
      logger.info('Get latest versions of a projec', repo);
      const versions = await getRepoVersions(repo);
      logger.info('Project versions', versions.length, versions.join(', '));
    }
  } catch (err) {
    logger.error('Get project versions failed', err);
  }
  process.exit(0);
};

const logger = getLogger(command);