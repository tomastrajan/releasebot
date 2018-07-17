import * as express from 'express';
import { getLogger } from 'log4js';

import { getChangelogImage } from '../handlers/changelog';

const logger = getLogger('Server');
const PORT = 8080;

export function runServer() {
  const app = express();

  app.use(express.static('public'));

  app.get('/changelog', getChangelogImage);

  app.listen(PORT);

  logger.info('Server started, port:', PORT);
}
