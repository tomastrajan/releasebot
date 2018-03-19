import 'now-env';
import schedule from 'node-schedule';
import yargs from 'yargs';

import { initDb } from './persistence/db';
import {
  findProjects,
  updateProjectVersions,
  insertProject
} from './persistence/project';
import { getRepoVersions } from './api/github';
import { resolveNewVersions, buildTweetStatus } from './release/release';
import { deleteAllTweets, tweet } from './api/twitter';

// node . init Angular angular/angular changelog https://www.github.com... angular,typescript
// node . delete-tweets
const argv = yargs.argv._;
const mode = argv.shift();

(async () => {
  try {
    console.log('App - START');
    await initDb();

    if (mode === 'init') {
      console.log('App - INIT MODE: ', ...argv);
      const versions = await getRepoVersions(argv[1]);
      if (versions.length > 0) {
        await insertProject(...argv, versions);
      } else {
        console.log('App - INIT MODE - SKIP - no versions found');
      }
      console.log('App - INIT MODE - DONE');
      process.exit(0);
    }

    if (mode === 'delete-tweets') {
      console.log('App - DELETE TWEETS MODE');
      await deleteAllTweets();
      console.log('App - DELETE TWEETS MODE - DONE');
      process.exit(0);
    }

    schedule.scheduleJob('*/30 * * * * *', async executionDate => {
      try {
        console.log('\nApp Scheduler - START -', executionDate);
        const projects = await findProjects();
        console.log(
          'App Scheduler - PROJECTS:',
          projects.map(p => p.name).join(', ')
        );
        for (let project of projects) {
          const versions = await getRepoVersions(project.repo);
          const newVersions = resolveNewVersions(project.versions, versions);
          if (newVersions.length) {
            console.log('App Scheduler - NEW VERSIONS:', newVersions);
            for (let version of newVersions) {
              await tweet(buildTweetStatus(project, version));
            }
            await updateProjectVersions(project, versions);
          } else {
            console.log('App Scheduler - SKIP:', project.name);
          }
        }
        console.log('App Scheduler - DONE');
      } catch (schedulerErr) {
        console.error('\nApp Scheduler - ERROR\n', schedulerErr, '\n');
      }
    });
  } catch (appErr) {
    console.error('\nAPP - ERROR\n', appErr, '\n');
  }
})();
