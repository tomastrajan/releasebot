import schedule from 'node-schedule';
import { getLogger } from 'log4js';

import { initDb } from '../persistence/db';
import { findProjects, updateProjectVersions } from '../persistence/project';
import { getRepoVersions } from '../api/github';

import { tweetNewRelease } from './twitter';

const logger = getLogger('Release Service');

export const runReleaseWatcher = cronSchedule => {
  schedule.scheduleJob(cronSchedule, async executionDate => {
    try {
      await initDb();
      logger.info('Execution start', executionDate);
      const projects = await findProjects();
      logger.info('Projects:', projects.map(p => p.name).join(', '));
      for (let project of projects) {
        const currentVersions = await getRepoVersions(project.repo);
        const oldVersions = project.versions;
        const newVersions = resolveNewVersions(oldVersions, currentVersions);
        if (newVersions.length) {
          logger.info('New versions:', project.name, newVersions);
          for (let newVersion of newVersions) {
            await tweetNewRelease(project, newVersion);
          }
          await updateProjectVersions(project, currentVersions);
        } else {
          logger.info('No new versions:', project.name);
        }
      }
      logger.info('Execution end');
    } catch (err) {
      logger.error(err);
    }
  });
};

const resolveNewVersions = (oldVersions, currentVersions) =>
  currentVersions.filter(version => !oldVersions.includes(version));
