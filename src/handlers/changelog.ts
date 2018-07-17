import { getLogger } from 'log4js';
import { PassThrough } from 'stream';

import { getLatestVersion, getNextVersion } from '../api/github';
import { getChangelogAsImage } from '../services/changelog';

const logger = getLogger('Changelog Handler');
const loggerRemote = getLogger('remote');

let counterDownloads = 0;

export const getChangelogImage = async (req, res) => {
  try {
    const {
      type,
      repo,
      name,
      theme,
      version: sourceVersion,
      branding
    } = req.query;
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

    logger.info('Download changelog -', repo, version, sourceVersion, type, theme, branding);
    loggerRemote.info(
      { repo, version, sourceVersion, type, theme, branding },
      { tags: ['RB-download', 'RB-stats'] }
    );

    const image = await getChangelogAsImage(
      project,
      version,
      theme,
      false,
      true,
      !branding
    );
    res.set(
      'Content-disposition',
      `attachment; filename=changelog-${repo}-${version}.png`
    );
    res.set('Content-Type', 'image/png');
    const imageStream = new PassThrough();
    imageStream.end(image);
    logger.debug(`Download changelog success - ${type} ${repo} ${version}`);
    logger.info(`Downloads since deployment: ${++counterDownloads}\n`);
    imageStream.pipe(res);
  } catch (err) {
    logger.error('Download changelog failed -', err, '\n');
    res.status(500).send({ message: 'Download changelog failed' });
  }
};
