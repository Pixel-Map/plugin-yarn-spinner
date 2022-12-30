// import * as os from 'os';
import * as fs from 'fs';
import path from 'path';
import { TSDocParser, ParserContext, DocComment } from '@microsoft/tsdoc';
import * as ts from 'typescript';

// class Formatter {
//   public static renderDocNode(docNode: DocNode): string {
//     let result: string = '';
//     if (docNode) {
//       if (docNode instanceof DocExcerpt) {
//         result += docNode.content.toString();
//       }
//       for (const childNode of docNode.getChildNodes()) {
//         result += Formatter.renderDocNode(childNode);
//       }
//     }
//     return result;
//   }
//
//   public static renderDocNodes(docNodes: ReadonlyArray<DocNode>): string {
//     let result: string = '';
//     for (const docNode of docNodes) {
//       result += Formatter.renderDocNode(docNode);
//     }
//     return result;
//   }
// }

interface CommandInterface {
  YarnName: string;
  DefinitionName: string;
  Documentation: string;
  Signature: string;
  Language: string;
  Parameters: ParameterInterface[];
}

interface ParameterInterface {
  Name: string;
  Type: string;
  Documentation: string;
  IsParamsArray: boolean;
  DefaultValue?: string;
}

const output = {
  Commands: [] as CommandInterface[],
};

const commandsFolder = 'src/commands';
fs.readdirSync(commandsFolder).forEach((fileName) => {
  if (fileName == 'index.ts') {
    return;
  }
  console.log('-----------------------------------------------------------');
  console.log('Processing: ' + fileName);
  console.log('-----------------------------------------------------------');

  const parameterTypes = getParameterTypes(fileName);
  // console.log(parameterTypes);

  const inputBuffer: string = fs.readFileSync('src/commands/' + fileName).toString();
  const tsdocParser: TSDocParser = new TSDocParser();
  const parserContext: ParserContext = tsdocParser.parseString(inputBuffer);
  const commandName = fileName.replace('.ts', '');
  const docComment: DocComment = parserContext.docComment;

  let signature = commandName;
  let parameters = [] as ParameterInterface[];
  // NOTE, I've added ONE to the docComments, because we aren't looking for the _callingEventId param
  if (docComment.params.blocks.length + 1 != parameterTypes.length) {
    console.log(docComment.params.blocks.length + 1);
    console.log(parameterTypes.length);
    throw new Error(
      `The number of documented parameters for ${commandName} does not match the number of parameters in the function signature.`,
    );
  }
  for (const paramBlock of docComment.params.blocks) {
    signature += ' ' + paramBlock.parameterName;

    // @ts-ignore
    const documentation = paramBlock.content.getChildNodes()[0].getChildNodes()[0]._text;
    const parameterFromTS = parameterTypes.find((x) => x.parameterName === paramBlock.parameterName);
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

  // if (docComment.returnsBlock) {
  //   console.log(colors.cyan('Returns: ') + JSON.stringify(Formatter.renderDocNode(docComment.returnsBlock.content)));
  // }

  // console.log(colors.cyan('Modifiers: ') + docComment.modifierTagSet.nodes.map((x) => x.tagName).join(', '));

  output.Commands.push({
    YarnName: commandName,
    DefinitionName: commandName,
    Documentation: parserContext.lines[0]?.toString(),
    Signature: signature,
    Language: 'text',
    Parameters: parameters,
  });
  console.log(JSON.stringify(output, null, 2));
});

// console.log(output.Commands[0].Parameters[0].Documentation);
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function getParameterTypes(inputfname: string): { parameterName: string; parameterType: string; default: any }[] {
  const inputFilename: string = path.resolve(path.join(__dirname, 'commands', inputfname));
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES5,
  };
  console.log(inputFilename);
  const program: ts.Program = ts.createProgram([inputFilename], compilerOptions);
  // Report any compiler errors
  // const compilerDiagnostics: ReadonlyArray<ts.Diagnostic> = program.getSemanticDiagnostics();
  // if (compilerDiagnostics.length > 0) {
  //   for (const diagnostic of compilerDiagnostics) {
  //     const message: string = ts.flattenDiagnosticMessageText(diagnostic.messageText, os.EOL);
  //     if (diagnostic.file) {
  //       const location: ts.LineAndCharacter = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
  //       const formattedMessage: string =
  //         `${diagnostic.file.fileName}(${location.line + 1},${location.character + 1}):` + ` [TypeScript] ${message}`;
  //       console.log(colors.red(formattedMessage));
  //     } else {
  //       console.log(colors.red(message));
  //     }
  //   }
  // } else {
  //   console.log('No compiler errors or warnings.');
  // }

  const parameters = [] as { parameterName: string; parameterType: string; default: any }[];

  const sourceFile: ts.SourceFile | undefined = program.getSourceFile(inputFilename);
  if (!sourceFile) {
    throw new Error('Error retrieving source file');
  }

  // @ts-ignore
  // search all nodes of source file
  const sf = sourceFile.getSourceFile();

  // process class childs
  sf.forEachChild(function (m: ts.Node) {
    // @ts-ignore

    // limit proecssing to methods

    const method = <ts.MethodDeclaration>m;

    // process the right method with the right count of parameters
    if (method.name?.getText(sf) == inputfname.replace('.ts', '')) {
      for (const param of method.parameters) {
        // get parameter type
        const type = param.type;
        // get raw string of parametr type name
        const typeName = type?.getText(sf);
        parameters.push({
          // @ts-ignore
          parameterName: param.name?.escapedText,
          // @ts-ignore
          parameterType: typeName,
          // @ts-ignore
          default: param.initializer?.text,
        });
        // console.log(param);
      }
      // response result
    }
  });
  return parameters;
}
