import * as fs from 'fs';
import { parseMethodIntoDocs } from './docUtils/parseMethodIntoDocs';
import { YarnCommandInterface } from './docUtils/yarnCommand.interface';
import path from 'path';
import { YarnParameterInterface } from './docUtils/yarnParameter.interface';

const output = {
  Commands: [] as YarnCommandInterface[],
  Functions: [] as YarnCommandInterface[],
};
const allMethods: {
  commandName: string;
  documentation: string;
  signature: string;
  parameters: YarnParameterInterface[];
  category: string;
  type: string;
}[] = [];

// Parse Commands
fs.readdirSync('src/commands').forEach((filename) => {
  if (filename == 'index.ts') {
    return;
  }
  const parsedMethod = parseMethodIntoDocs(path.resolve(path.join(__dirname, 'commands', filename)), 'command');
  allMethods.push({ type: 'command', ...parsedMethod });
  output.Commands.push({
    YarnName: parsedMethod.commandName,
    DefinitionName: parsedMethod.commandName,
    Language: 'text',
    Signature: parsedMethod.signature,
    Documentation: parsedMethod.documentation,
    Parameters: parsedMethod.parameters,
  });
});

// Parse Functions
fs.readdirSync('src/functions').forEach((filename) => {
  if (filename == 'index.ts') {
    return;
  }
  const parsedMethod = parseMethodIntoDocs(path.resolve(path.join(__dirname, 'functions', filename)), 'function');
  allMethods.push({ type: 'function', ...parsedMethod });
  output.Functions.push({
    YarnName: parsedMethod.commandName,
    DefinitionName: parsedMethod.commandName,
    Language: 'text',
    Signature: parsedMethod.signature,
    Documentation: parsedMethod.documentation,
    Parameters: parsedMethod.parameters,
  });
});
console.log(JSON.stringify(output, null, 2));
console.log(allMethods);
