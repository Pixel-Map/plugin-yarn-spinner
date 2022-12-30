import * as fs from 'fs';
import { parseMethodIntoDocs } from './docUtils/parseMethodIntoDocs';
import { YarnCommandInterface } from './docUtils/yarnCommand.interface';
import path from 'path';

const output = {
  Commands: [] as YarnCommandInterface[],
  Functions: [] as YarnCommandInterface[],
};

// Parse Commands
fs.readdirSync('src/commands').forEach((filename) => {
  if (filename == 'index.ts') {
    return;
  }
  output.Commands.push(parseMethodIntoDocs(path.resolve(path.join(__dirname, 'commands', filename)), 'command'));
});

// Parse Functions
fs.readdirSync('src/functions').forEach((filename) => {
  if (filename == 'index.ts') {
    return;
  }
  output.Functions.push(parseMethodIntoDocs(path.resolve(path.join(__dirname, 'functions', filename)), 'function'));
});
console.log(JSON.stringify(output, null, 2));
