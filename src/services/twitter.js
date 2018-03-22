import { getLogger } from 'log4js';
import webshot from 'webshot';

import {
  getTweets,
  tweetWithMedia,
  deleteTweet,
  uploadMedia
} from '../api/twitter';

const logger = getLogger('Twitter Service');

const { TWITTER_USER_ID } = process.env;

export const removeAllTweets = async () => {
  try {
    logger.info('Remove all tweets');
    const tweets = await getTweets(TWITTER_USER_ID);
    await Promise.all(tweets.map(tweet => deleteTweet(tweet.id_str)));
    logger.info(`Removed ${tweets.length} tweets`);
  } catch (err) {
    logger.error('Remove all tweets failed', err);
  }
  process.exit(0);
};

export const tweetNewRelease = async (project, version) => {
  try {
    logger.info('Posting new tweet for release:', project.name, version);
    const status = buildTweetStatus(project, version);
    const isGithub = project.urlType === 'github';
    const image = await getChangelogAsImageBuffer(
      isGithub ? `${project.url}/tag/${version}` : project.url,
      isGithub
        ? { captureSelector: '.release-body' }
        : {
            // captureSelector: '.markdown-body',
            shotOffset: {
              left: 40,
              right: 40,
              top: 670,
              bottom: 0
            }
          }
    );
    const { media_id_string: mediaId } = await uploadMedia(image);
    await tweetWithMedia(status, mediaId);
  } catch (err) {
    logger.error(err);
  }
};

const buildTweetStatus = (project, version) => {
  const { name, url, urlType, hashtags } = project;
  const finalUrl = urlType === 'github' ? `${url}/tag/${version}` : url;
  return `
🔥 New ${name} Release 🚀
  
📦 ${version} 
${RELEASE_TYPES[getReleaseType(version)]}

${hashtags.map(h => `#${h}`).join(' ')} #release #changelog

🔗 ${finalUrl}
`;
};

const getChangelogAsImageBuffer = (url, options) =>
  new Promise((resolve, reject) => {
    logger.info('Get changelog as image', url);
    const stream = webshot(url, {
      streamType: 'jpeg',
      ...options
    });
    const receivedDataChunks = [];
    stream.on('error', err => reject(err));
    stream.on('data', data => receivedDataChunks.push(data));
    stream.on('end', () => {
      logger.info('Get changelog as image finished');
      resolve(Buffer.concat(receivedDataChunks));
    });
  });

const RELEASE_TYPES = {
  alpha: '🚧 ALPHA PRE-RELEASE',
  beta: '🚧 BETA PRE-RELEASE',
  rc: '🏗 RELEASE CANDIDATE',
  other: '🤷 OTHER RELEASE',
  normal: ''
};

const getReleaseType = version =>
  version.includes('alpha')
    ? 'alpha'
    : version.includes('beta')
      ? 'beta'
      : version.includes('rc')
        ? 'rc'
        : version.includes('-') ? 'other' : 'normal';

/*
  TODO scrape info: bugfix count, feature count, breaking changes count
 */
