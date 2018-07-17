import * as semver from 'semver';
import { getLogger } from 'log4js';

import {
  getTweets,
  tweetWithMedia,
  deleteTweet,
  uploadMedia,
  sendMessage,
  getMessages
} from '../api/twitter';

import { getChangelogAsImage } from './changelog';
import {
  getChangelogFileUrl,
  getChangelogFileUrlHash,
  getChangelogReleaseUrl
} from './url';

const logger = getLogger('Twitter Service');

export const tweetNewRelease = async (project, version) => {
  logger.info('Preparing tweet for new release:', project.name, version);
  const status = await buildTweetStatus(project, version);
  const imageBuffer = await getChangelogAsImage(project, version, 'default');
  logger.info('Uploading changelog image for new release');
  const { media_id_string } = (await uploadMedia(imageBuffer)) as any;
  logger.info('Posting tweet for a new release', project.name, version);
  await tweetWithMedia(status, media_id_string);
};

const buildTweetStatus = async (project, version) => {
  const { name, repo, type, hashtags } = project;
  const isGithub = type === 'github';
  let url = getChangelogReleaseUrl(repo, version);
  if (!isGithub) {
    const urlHash = await getChangelogFileUrlHash(repo, version);
    url = getChangelogFileUrl(repo) + urlHash;
  }
  return `
🔥 New ${name} Release 🚀
  
📦 ${version} 
${RELEASE_TYPES[getReleaseType(version)]}

🏷️ ${hashtags.map(h => `#${h}`).join(' ')} #release #changelog #releasebutler

🔗 ${url}
`;
};

const RELEASE_TYPES = {
  alpha: '🚧 ALPHA PRE-RELEASE',
  beta: '🚧 BETA PRE-RELEASE',
  canary: '🐤 CANARY PRE-RELEASE',
  rc: '🏗 RELEASE CANDIDATE',
  other: '🤷 OTHER RELEASE',
  patch: '🐛 FIX RELEASE 🎉',
  minor: '✨ FEATURE RELEASE 🎉🎉',
  major: '🏛 MAJOR RELEASE 🎉🎉🎉'
};

const getReleaseType = version =>
  version.includes('alpha')
    ? 'alpha'
    : version.includes('beta')
      ? 'beta'
      : version.includes('canary')
        ? 'canary'
        : version.includes('rc')
          ? 'rc'
          : version.includes('-')
            ? 'other'
            : semver.patch(version) !== 0
              ? 'patch'
              : semver.minor(version) !== 0
                ? 'minor'
                : 'major';
