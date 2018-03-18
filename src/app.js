import 'now-env';
import schedule from 'node-schedule';
import http from 'http-debug';

import { init } from './persistence/db';
import { findProjects, updateProjectVersions } from './persistence/project';
import { getRepoVersions } from './api/github';
import { getTimeline, getPlaceId, tweet, deleteAllTweets } from './api/twitter';

// http.https.debug = 1;

(async () => {
  try {
    console.log(await getPlaceId('San Francisco'));
    // await deleteAllTweets();
//     await tweet(`
// 🚨🚨🚨NEW ANGULAR RELEASE🚨🚨🚨
// ${Date.now()}
//
// #angular #release #releasebot #changelog
// https://github.com/angular/angular/blob/master/CHANGELOG.md
//     `);
  } catch (err) {
    console.log(err);
  }

  // await init();
  // const projects = await findProjects();
  // console.log(
  //   'Projects: ',
  //   projects
  //     .map(p => `${p.name} - ${p.versions.length} - ${p.versions[0]}`)
  //     .join('\n')
  // );

  // schedule.scheduleJob('*/10 * * * * *', () =>
  //   projects.forEach(async project => {
  //     const versions = await getRepoVersions(project.repo);
  //     console.log(versions.length, ' - ', versions.join(', '));
  //     if (project.versions.length < versions.length) {
  //       await updateProjectVersions(project.name, versions);
  //     }
  //   })
  // );

  // schedule.scheduleJob('*/10 * * * * *', async () => {
  //   try {
  //     console.log('TWEET');
  //     console.log(await deleteAllTweets());
  //     // console.log((await tweet('It works ' + Date.now())));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });
})();
