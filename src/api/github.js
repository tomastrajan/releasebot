import fetch from 'node-fetch';

const { GITHUB_URL, GITHUB_TOKEN } = process.env;

export const getRepoVersions = async repo => {
  const tags = await request(`/repos/${repo}/tags?per_page=30`);
  return tags
    .filter(tag => /^(v[0-9]|[0-9])/.test(tag.name))
    .map(tag => tag.name);
};

const request = url => {
  console.log('Github API -', 'GET', url);
  return fetch(`${GITHUB_URL}${url}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  })
    .then(res => res.json())
    .then(data => {
      console.log(`Github API - OK ${JSON.stringify(data).slice(0, 80)}...`);
      return data;
    })
    .catch(err => {
      console.log(`Github API - ERROR ${err}`);
      return Promise.reject(err);
    });
};
