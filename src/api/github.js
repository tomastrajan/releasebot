import fetch from 'node-fetch';

const { GITHUB_URL, GITHUB_TOKEN } = process.env;

const requestOptions = {
  headers: { Authorization: `token ${GITHUB_TOKEN}` }
};

export const getRepoVersions = async repo => {
  const response = await fetch(
    `${GITHUB_URL}/repos/${repo}/tags?per_page=50`,
    requestOptions
  );
  const tags = await response.json();
  return tags
    .filter(tag => /^(v[0-9]|[0-9])/.test(tag.name))
    .map(tag => tag.name);
};
