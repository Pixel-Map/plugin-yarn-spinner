import * as fs from 'fs';
import path from 'path';
// @ts-ignore
import tablemark from 'tablemark';
import { parseMethodIntoDocs } from './docUtils/parseMethodIntoDocs';
import { YarnCommandInterface } from './docUtils/yarnCommand.interface';

const output = {
  Commands: [] as YarnCommandInterface[],
  Functions: [] as YarnCommandInterface[],
};
const allCommands: {
  name: string;
  documentation: string;
  signature: string;
  // parameters: YarnParameterInterface[];
  category: string;
}[] = [];

const allFunctions: {
  name: string;
  signature: string;
  documentation: string;
}[] = [];

// Parse Commands
fs.readdirSync('src/commands').forEach((filename) => {
  if (filename == 'index.ts') {
    return;
  }
  const parsedMethod = parseMethodIntoDocs(path.resolve(path.join(__dirname, 'commands', filename)), 'command');
  allCommands.push({
    name: parsedMethod.commandName,
    documentation: parsedMethod.documentation,
    signature: parsedMethod.signature,
    category: parsedMethod.category,
  });
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
  output.Functions.push({
    YarnName: parsedMethod.commandName,
    DefinitionName: parsedMethod.commandName,
    Language: 'text',
    Signature: parsedMethod.signature,
    Documentation: parsedMethod.documentation,
    Parameters: parsedMethod.parameters,
  });
  allFunctions.push({
    name: parsedMethod.commandName,
    signature: parsedMethod.signature,
    documentation: parsedMethod.documentation,
  });
});

fs.writeFileSync('.ysls.json', JSON.stringify(output, null, 2));
function groupBy(xs: any, f: any) {
  // @ts-ignore
  return xs.reduce((r: any, v: any, i: any, a: any, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}
const result = groupBy(allCommands, (c: any) => c.category);
// console.log(result);
const newmap = new Map(Object.entries(result));
const sortedAsc = new Map([...newmap].sort());
let readme =
  '# RPGMaker MZ Yarn Spinner Plugin\n\n' +
  '[Yarn Spinner](https://yarnspinner.dev/) is a fantastic tool designed to make writing game dialogue easier.\n' +
  '![banner](plugin-yarn-spinner.png)' +
  'It was created by the makers of "Night in the Woods", and now you can finally use it within your [RPGMaker MZ](https://www.rpgmakerweb.com/products/rpg-maker-mz) games! \n' +
  'Here are some of the features:\n' +
  '\n' +
  '* ' +
  allCommands.length +
  ' Commands!\n' +
  '* ' +
  allFunctions.length +
  ' Functions!\n' +
  '* Stardew Valley mode (See guide for more information)\n' +
  '* Sample Dialog!\n\n## Commands\n';
readme +=
  '\n' +
  '## Demo\n' +
  '[![Plugin Demo](https://img.youtube.com/vi/xRlhuiQvHjE/0.jpg)](https://www.youtube.com/watch?v=xRlhuiQvHjE)\n\n';
readme += "Commands allow Yarn Spinner to control parts of the game that you've built.\n";

sortedAsc.forEach((value: any, key: any) => {
  readme += `\n### ${key}\n\n`;
  console.log(value);
  const withoutCategory: { Name: any; Documentation: any; Signature: any }[] = [];
  value.forEach((command: any) => {
    withoutCategory.push({
      Name: command.name,
      Signature: command.signature,
      Documentation: command.documentation,
    });
  });
  readme += tablemark(withoutCategory);
});
readme += '\n## Functions\n';
readme += 'Functions are units of code that Yarn scripts can call to receive a value.\n\n';
readme += tablemark(allFunctions);

readme += '\n';
readme += fs.readFileSync('src/docUtils/addingCustomCommands.md');
// Credits
readme +=
  '\n## Credits\n' +
  '\n' +
  '* [Yarn Spinner](https://yarnspinner.dev/) - The Yarn Spinner engine\n' +
  '* [Yarn Bound](https://github.com/mnbroatch/yarn-bound) - Yarn 2.0 wrapper around bondage.js by mnbroatch.\n' +
  '* [Plugin Metadata](https://github.com/comuns-rpgmaker/plugin-metadata) - The plugin metadata generator by Comuns\n';
console.log(readme);
fs.writeFileSync('README.md', readme);
// console.log(tablemark(allMethods));
