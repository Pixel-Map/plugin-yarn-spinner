import fs from 'fs';
import { DocComment, ParserContext, TSDocParser } from '@microsoft/tsdoc';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';
import { YarnParameterInterface } from './yarnParameter.interface';
import { getParamTypesFromTS } from './getParamTypesFromTS';

interface ParseMethodIntoDocsInterface {
  commandName: string;
  documentation: string;
  signature: string;
  parameters: YarnParameterInterface[];
  category: string;
}
export function parseMethodIntoDocs(filename: string, type: 'function' | 'command'): ParseMethodIntoDocsInterface {
  console.log('-----------------------------------------------------------');
  console.log('Processing: ' + filename);
  console.log('-----------------------------------------------------------');

  const parameterTypes = getParamTypesFromTS(filename);
  // console.log(parameterTypes);

  const inputBuffer: string = fs.readFileSync(filename).toString();
  const tsdocParser: TSDocParser = new TSDocParser();
  const parserContext: ParserContext = tsdocParser.parseString(inputBuffer);
  const commandName = filename.split('/').at(-1)?.replace('.ts', '')!;
  const docComment: DocComment = parserContext.docComment;

  let signature = commandName;
  let parameters = [] as YarnParameterInterface[];
  // NOTE, I've added ONE to the docComments, because we aren't looking for the _callingEventId param
  const expectedParamCount = type == 'command' ? docComment.params.blocks.length + 1 : docComment.params.blocks.length;
  if (expectedParamCount != parameterTypes.length) {
    console.log(docComment.params.blocks.length + 1);
    console.log(parameterTypes.length);
    throw new Error(
      `The number of documented parameters for ${commandName} does not match the number of parameters in the function signature.`,
    );
  }
  const paramNames = [];
  for (const paramBlock of docComment.params.blocks) {
    if (type == 'command') {
      signature += ' ' + paramBlock.parameterName;
    }
    paramNames.push(paramBlock.parameterName);

    // @ts-ignore
    const documentation = paramBlock.content.getChildNodes()[0].getChildNodes()[0]._text;
    const parameterFromTS = parameterTypes.find(
      (x: { parameterName: string }) => x.parameterName === paramBlock.parameterName,
    );
    if (!parameterFromTS!.parameterType) {
      throw (
        'Parameter type not found for ' +
        paramBlock.parameterName +
        ', perhaps you set default = something, and did not specify a type?'
      );
    }
    const parameter = {
      Name: paramBlock.parameterName,
      Type: capitalizeFirstLetter(parameterFromTS!.parameterType.toString()),
      Documentation: documentation,
      IsParamsArray: false,
    };
    if (parameterFromTS!.default != undefined) {
      // @ts-ignore
      parameter.DefaultValue = parameterFromTS!.default;
    }

    parameters.push(parameter);
    // console.log(paramBlock.content.getChildNodes()[0]);
  }

  if (type == 'function') {
    signature += '(';
    signature += paramNames.slice(0, -1).join(', ');
    if (paramNames.length > 1) {
      signature += ', ';
    }
    signature += paramNames.at(-1) + ')';
  }

  const category = // @ts-ignore
    parserContext.docComment.remarksBlock?.content.getChildNodes()[0].getChildNodes()[0]._text.trim() ??
    'Uncategorized';
  return {
    commandName: commandName,
    documentation: parserContext.lines[0]?.toString(),
    signature: signature,
    parameters: parameters,
    category: category,
  };
}
