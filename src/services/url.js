import { getCommitDate, getRepoTags } from '../api/github';

const { GITHUB_CHANGELOG_URL } = process.env;

export const getChangelogReleaseUrl = (repo, version) =>
  `${GITHUB_CHANGELOG_URL}/${repo}/releases/tag/${version}`;

export const getChangelogFileUrl = repo =>
  `${GITHUB_CHANGELOG_URL}/${repo}/blob/master/CHANGELOG.md`;

export const getChangelogFileUrlHash = async repo => {
  const tags = await getRepoTags(repo);
  const sha = tags.filter(t => t.name === version)[0].commit.sha;
  const date = await getCommitDate(repo, sha);
  return `#${version.replace(/\./gi, '')}-${date.split('T')[0]}`;
};
