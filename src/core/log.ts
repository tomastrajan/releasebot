import { configure, addLayout } from 'log4js';

const { LOGGLY_TOKEN } = process.env;

addLayout('json', () => logEvent => logEvent.data[0]);

export const configureLogger = debug =>
  configure({
    appenders: {
      out: {
        type: 'stdout',
        layout: { type: 'pattern', pattern: '%[[%p] %c - %]%m' }
      },
      loggly: {
        type: '@log4js-node/loggly',
        layout: { type: 'json' },
        token: LOGGLY_TOKEN,
        subdomain: 'tomastrajan',
        tags: ['RB'],
        json: true
      }
    },
    categories: {
      default: { appenders: ['out'], level: debug ? 'debug' : 'info' },
      remote: { appenders: ['loggly'], level: 'info' }
    }
  });
