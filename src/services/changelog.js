import { getLogger } from 'log4js';
import webshot from 'webshot';

import { getCommitDate, getRepoTags } from '../api/github';

const logger = getLogger('Changelog Service');

export const getChangelogAsImage = async (project, version, asFile) =>
  await (project.urlType === 'github'
    ? getChangelogFromGithubRelease(project, version, asFile)
    : getChangelogFromChangelogMd(project, version, asFile));

const getChangelogFromChangelogMd = async (project, version, asFile) => {
  const { repo, url } = project;
  const tags = await getRepoTags(repo);
  const sha = tags.filter(t => t.name === version)[0].commit.sha;
  const date = await getCommitDate(repo, sha);
  const anchor = `${version.replace(/\./gi, '')}-${date.split('T')[0]}`;
  return getUrlAsImageBuffer(
    `${url}#${anchor}`,
    {
      renderDelay: 1000,
      customCSS: '.markdown-body h1 { padding-top: 1000px }',
      shotOffset: {
        left: 40,
        right: 40,
        top: 1680,
        bottom: 0
      }
    },
    asFile
  );
};

const getChangelogFromGithubRelease = (project, version, asFile) =>
  getUrlAsImageBuffer(
    `${project.url}/tag/${version}`,
    {
      captureSelector: '.release',
      customCSS: `
        .release-meta { display: none; } 
        .release-body { 
          width: 93% !important;
          border: 0 !important; 
          margin: 40px 30px; 
          box-shadow: rgba(0, 0, 0, 0.55) 0px 20px 68px; 
          border-radius: 5px; 
          background-color: #322931;
          color: #e4eaeb;
        }
        .release-body li strong, .release-body h1 a {
          color: #ffde24;
        }
        .release-body li a, .release-header p a {
          color: #c4932d;
        }
      `
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
