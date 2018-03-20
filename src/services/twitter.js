import { getLogger } from 'log4js';

import { getTweets, deleteTweet, tweet } from '../api/twitter';
import { getReleaseByTagName } from '../api/github';

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
  logger.info('Posting new tweet for release:', project.name, version);
  return tweet(buildTweetStatus(project, version))
};

const buildTweetStatus = (project, version) => {
  const { name, url, urlType, hashtags } = project;
  const isPrerelease = version.includes('alpha') || version.includes('beta');
  const finalUrl = urlType === 'github' ? `${url}/tag/${version}` : url;
  return `
🔥📦 New ${name} Release 🚀🔥
  
📦 ${version} 
${isPrerelease ? '🚧 PRE-RELEASE 🚧' : ''}

${hashtags.map(h => `#${h}`).join(' ')} #release #changelog
${finalUrl}
`;
};

const getRandomElement = array => array[getRandomInt(0, array.length - 1)];
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
