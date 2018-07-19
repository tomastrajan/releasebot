#!/usr/bin/env ts-node
import 'now-env';
import * as yargs from 'yargs';
import * as yargonaut from 'yargonaut';
import { textSync } from 'figlet';

import { configureLogger } from './core/log';

console.log(textSync('Release Butler', 'Standard'));

yargonaut
  .style('blue')
  .style('green', 'Positionals:')
  .style('yellow', 'required')
  .helpStyle('green')
  .errorsStyle('red');

yargs
  .usage('Try running "releasebutler <command> --help" for more info...')
  .option('debug', { type: 'boolean', description: 'Set debug log level' })
  .middleware([configureLogger])
  .demandCommand(1, 'Please provide at least one command')
  .commandDir('./commands', { extensions: ['js', 'ts'] })
  .help()
  .argv;
