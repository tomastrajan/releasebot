const { GITHUB_CHANGELOG_URL } = process.env;

export const getChangelogFileUrl = repo =>
  `${GITHUB_CHANGELOG_URL}/${repo}/blob/master/CHANGELOG.md`;

export const getChangelogReleaseUrl = (repo, version) =>
  `${GITHUB_CHANGELOG_URL}/${repo}/releases/tag/${version}`;
