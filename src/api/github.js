import fetch from 'node-fetch';
import { getLogger } from 'log4js';

const logger = getLogger('Github API');

const { GITHUB_URL, GITHUB_TOKEN } = process.env;

export const getRepoVersions = async repo => {
  const tags = await request(`/repos/${repo}/tags?per_page=30`);
  return tags
    .filter(tag => /^(v[0-9]|[0-9])/.test(tag.name))
    .map(tag => tag.name);
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
