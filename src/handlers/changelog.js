import { getLogger } from 'log4js';
import stream from 'stream';

import { getChangelogAsImage } from '../services/changelog';

const logger = getLogger('Changelog Handler');

let counterDownloads = 0;

export const getChangelogImage = (req, res) => {
  const { type, repo, name, version, theme } = req.query;
  logger.info('Download changelog -', type, repo, version);
  getChangelogAsImage({ type, name, repo }, version, theme, false, true)
    .then(imageBuffer => {
      res.set(
        'Content-disposition',
        `attachment; filename=changelog-${repo}-${version}.png`
      );
      res.set('Content-Type', 'image/png');
      const imageStream = new stream.PassThrough();
      imageStream.end(imageBuffer);
      logger.info(
        `Download changelog success - ${type} ${repo} ${
          version
        } - downloads since deployment: ${++counterDownloads}\n`
      );
      imageStream.pipe(res);
    })
    .catch(err => {
      logger.error('Download changelog failed -', err, '\n');
      res.status(500).send({ message: 'Download changelog failed' });
    });
};
