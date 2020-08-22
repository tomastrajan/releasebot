import * as express from 'express';
import * as cors from 'cors';
import { getLogger } from 'log4js';

import { getChangelogImage } from '../handlers/changelog';

const logger = getLogger('Server');
const PORT = process.env.PORT || 8080;
const CORS_ALLOWED = [
  'https://releasebutler.now.sh',
  'https://releasebutler.stackblitz.io'
]

export function runServer() {
  const app = express();

  app.use(cors({
    origin(origin, next) {
      if (!origin || CORS_ALLOWED.indexOf(origin) !== -1) {
        next(null, true);
      } else {
        next(new Error('Not allowed by CORS'))
      }
    }
  }))

  app.use(express.static('public'));

  app.get('/changelog', getChangelogImage);

  app.listen(PORT);

  logger.info('Server started, port:', PORT);
}
