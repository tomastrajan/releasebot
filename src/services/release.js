import schedule from 'node-schedule';
import { getLogger } from 'log4js';

import { initDb } from '../persistence/db';
import { findProjects, updateProjectVersions } from '../persistence/project';
import { getRepoVersions } from '../api/github';

import { tweetNewRelease } from './twitter';

const logger = getLogger('Release Service');

export const runReleaseWatcher = cronSchedule => {
  logger.info('Setup scheduler with schedule', cronSchedule);
  schedule.scheduleJob(cronSchedule, async executionDate => {
    try {
      await initDb();
      logger.info('Execution start', executionDate);
      const projects = await findProjects();
      logger.info('Projects:', projects.length);
      for (let project of projects) {
        const currentVersions = await getRepoVersions(project.repo);
        const oldVersions = project.versions;
        const newVersions = resolveNewVersions(oldVersions, currentVersions);
        if (newVersions.length) {
          logger.info('New versions:', project.name, newVersions);
          for (let newVersion of newVersions) {
            await tweetNewRelease(project, newVersion);
          }
          await updateProjectVersions(project.name, currentVersions);
        } else {
          logger.info('No new versions:', project.name);
        }
      }
      logger.info('Execution ends\n');
    } catch (err) {
      logger.error(err);
    }
  });
};

const resolveNewVersions = (oldVersions, currentVersions) =>
  currentVersions.filter(version => !oldVersions.includes(version));
