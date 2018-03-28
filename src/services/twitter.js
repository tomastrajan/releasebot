import { getLogger } from 'log4js';

import {
  getTweets,
  tweetWithMedia,
  deleteTweet,
  uploadMedia
} from '../api/twitter';

import { getChangelogAsImage } from './changelog';
import {
  getChangelogFileUrl,
  getChangelogFileUrlHash,
  getChangelogReleaseUrl
} from './url';

const { TWITTER_USER_ID } = process.env;

const logger = getLogger('Twitter Service');

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
  logger.info('Preparing tweet for new release:', project.name, version);
  const status = buildTweetStatus(project, version);
  const imageBuffer = await getChangelogAsImage(project, version);
  logger.info('Uploading changelog image for new release');
  const { media_id_string } = await uploadMedia(imageBuffer);
  logger.info('Posting tweet for a new release', project.name, version);
  await tweetWithMedia(status, media_id_string);
};

// TODO: scrape and show counts of bugfix, feature & breaking changes
const buildTweetStatus = (project, version) => {
  const { name, repo, type, hashtags } = project;
  const url =
    type === 'github'
      ? getChangelogReleaseUrl(repo, version)
      : getChangelogFileUrl(repo) + getChangelogFileUrlHash(repo);
  return `
🔥 New ${name} Release 🚀
  
📦 ${version} 
${RELEASE_TYPES[getReleaseType(version)]}

${hashtags.map(h => `#${h}`).join(' ')} #release #changelog

🔗 ${url}
`;
};

const RELEASE_TYPES = {
  alpha: '🚧 ALPHA PRE-RELEASE',
  beta: '🚧 BETA PRE-RELEASE',
  rc: '🏗 RELEASE CANDIDATE',
  other: '🤷 OTHER RELEASE',
  stable: '🏛 STABLE RELEASE 🎉🎉🎉'
};

const getReleaseType = version =>
  version.includes('alpha')
    ? 'alpha'
    : version.includes('beta')
      ? 'beta'
      : version.includes('rc')
        ? 'rc'
        : version.includes('-') ? 'other' : 'stable';
