import { getLogger } from 'log4js';
import stream from 'stream';

import { getLatestVersion, getNextVersion } from '../api/github';
import { getChangelogAsImage } from '../services/changelog';

const logger = getLogger('Changelog Handler');

let counterDownloads = 0;

export const getChangelogImage = async (req, res) => {
  try {
    const { type, repo, name, theme, version: sourceVersion } = req.query;
    const project = { type, name, repo };
    let version =
      sourceVersion === 'latest'
        ? await getLatestVersion(repo)
        : sourceVersion === 'next'
          ? await getNextVersion(repo)
          : sourceVersion;

    if (!version) {
      throw new Error(`Version not found for ${sourceVersion}`);
    }

    logger.info('Download changelog -', type, repo, version);

    const image = await getChangelogAsImage(
      project,
      version,
      theme,
      false,
      true
    );
    res.set(
      'Content-disposition',
      `attachment; filename=changelog-${repo}-${version}.png`
    );
    res.set('Content-Type', 'image/png');
    const imageStream = new stream.PassThrough();
    imageStream.end(image);
    logger.info(`Download changelog success - ${type} ${repo} ${version}`);
    logger.info(`Downloads since deployment: ${++counterDownloads}\n`);
    imageStream.pipe(res);
  } catch (err) {
    logger.error('Download changelog failed -', err, '\n');
    res.status(500).send({ message: 'Download changelog failed' });
  }
};
