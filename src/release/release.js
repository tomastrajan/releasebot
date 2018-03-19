export const resolveNewVersions = (storedVersions, versions) =>
  versions.filter(version => !storedVersions.includes(version));

export const buildTweetStatus = (project, version) => {
  const { name, url, hashtags } = project;
  const isPrerelease = version.includes('alpha') || version.includes('beta');
  return `
🔥📦 NEW ${name.toUpperCase()} RELEASE 🚀🔥
  
📦 ${version} ${isPrerelease ? '🚨🚧 PRE-RELEASE 🚧🚨' : ''}

${hashtags.map(h => `#${h}`).join(' ')}
${url}
`;
};

const getRandomElement = array => array[getRandomInt(0, array.length - 1)];
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/*
  TODO

  link to version if github changelog...
  multiple templates, randomize

 */
