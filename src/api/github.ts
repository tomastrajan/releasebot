import * as semver from 'semver';
import fetch from 'node-fetch';
import { getLogger } from 'log4js';

const logger = getLogger('Github API');

const { GITHUB_URL, GITHUB_TOKEN } = process.env;

export const getCommitDate = async (repo, sha) => {
  const commit = await request(`/repos/${repo}/commits/${sha}`);
  return commit.commit.committer.date;
};

export const getNextVersion = async repo =>
  (await getRepoVersions(repo)).filter(version => {
    try {
      return semver.prerelease(version);
    } catch (e) {
      return false;
    }
  })[0];

export const getLatestVersion = async repo =>
  (await getRepoVersions(repo)).filter(version => {
    try {
      return !semver.prerelease(version);
    } catch (e) {
      return false;
    }
  })[0];

export const getRepoVersions = async repo =>
  (await getRepoTags(repo))
    .filter(tag => /^(v[0-9]|[0-9])/.test(tag.name))
    .map(tag => tag.name)
    .sort((t1, t2) => {
      try {
        return semver.rcompare(t1, t2);
      } catch (e) {
        return semver.rcompare(semver.coerce(t1), semver.coerce(t2));
      }
    })
    .map(tag => {
      logger.debug(repo, tag);
      return tag;
    }).slice(0, 30);

export const getRepoTags = async repo => {
  try {
    const tags = await request(`/repos/${repo}/tags?per_page=30`);
    if (!tags.length) {
      logger.warn(`No tags found for repository: ${repo}, does it exists?`);
      return [];
    }
    return tags;
  } catch (err) {
    logger.error("Get tags for repo failed", repo, err);
    return [];
  }
};

export const isChangelogRepository = async repo => {
  try {
    const response = await request(`/repos/${repo}/contents/CHANGELOG.md`);
    return response.name === 'CHANGELOG.md';
  } catch (err) {
    logger.error("Is changelog repository failed", repo, err);
    return false;
  }
};

const request = url => {
  logger.debug('GET', url);
  return fetch(`${GITHUB_URL}${url}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  })
    .then(res => res.json())
    .then(data => {
      logger.debug(`OK ${JSON.stringify(data).slice(0, 60)} ...`);
      return data;
    })
    .catch(err => {
      logger.error(err);
      return Promise.reject(err);
    });
};
