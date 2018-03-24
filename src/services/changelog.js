import { getLogger } from 'log4js';
import webshot from 'webshot';

import { getCommitDate, getRepoTags } from '../api/github';

import {
  changelogReleaseOffsetOption,
  changelogReleaseStyles,
  githubReleaseStyles
} from './changelog-styles';
import { getChangelogFileUrl, getChangelogReleaseUrl } from './url';

const logger = getLogger('Changelog Service');

export const getChangelogAsImage = async (project, version, asFile) =>
  await (project.type === 'github'
    ? getChangelogFromGithubRelease(project, version, asFile)
    : getChangelogFromChangelogMd(project, version, asFile));

const getChangelogFromChangelogMd = async (project, version, asFile) =>
  getUrlAsImageBuffer(
    getChangelogFileUrl(project.repo),
    {
      renderDelay: 1000,
      customCSS: changelogReleaseStyles,
      ...changelogReleaseOffsetOption
    },
    asFile
  );

const getChangelogFromGithubRelease = (project, version, asFile) =>
  getUrlAsImageBuffer(
    getChangelogReleaseUrl(project.repo, version),
    {
      captureSelector: '.release',
      customCSS: githubReleaseStyles
    },
    asFile
  );

const getUrlAsImageBuffer = (url, options, asFile) =>
  new Promise((resolve, reject) => {
    if (asFile) {
      logger.info('Get url as image file', url, options);
      webshot(url, 'test.png', options, err => {
        err
          ? logger.error('Get url as image file failed', err)
          : logger.info('Get url as image file successful');
        process.exit(0);
      });
      return;
    }
    logger.info('Get url as image buffer', url, options);
    const stream = webshot(url, { streamType: 'jpeg', ...options });
    const receivedDataChunks = [];
    stream.on('error', err => {
      logger.error('Get url as image buffer failed', err);
      reject(err);
    });
    stream.on('data', data => receivedDataChunks.push(data));
    stream.on('end', () => {
      logger.info('Get url as image buffer finished');
      resolve(Buffer.concat(receivedDataChunks));
    });
  });

const resolveChangelogReleaseAnchorLink = async repo => {
  const tags = await getRepoTags(repo);
  const sha = tags.filter(t => t.name === version)[0].commit.sha;
  const date = await getCommitDate(repo, sha);
  return `${version.replace(/\./gi, '')}-${date.split('T')[0]}`;
};
