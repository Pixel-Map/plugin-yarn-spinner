import { TSDocParser, ParserContext, DocComment, DocExcerpt, DocNode } from '@microsoft/tsdoc';

import colors from 'colors';
import * as os from 'os';
import * as fs from 'fs';

class Formatter {
  public static renderDocNode(docNode: DocNode): string {
    let result: string = '';
    if (docNode) {
      if (docNode instanceof DocExcerpt) {
        result += docNode.content.toString();
      }
      for (const childNode of docNode.getChildNodes()) {
        result += Formatter.renderDocNode(childNode);
      }
    }
    return result;
  }

  public static renderDocNodes(docNodes: ReadonlyArray<DocNode>): string {
    let result: string = '';
    for (const docNode of docNodes) {
      result += Formatter.renderDocNode(docNode);
    }
    return result;
  }
}
const output = {
  Commands: [],
};
console.log(output);
console.log('aBHI');

const commandsFolder = 'src/commands';
fs.readdirSync(commandsFolder).forEach((fileName) => {
  console.log(fileName);
  const inputBuffer: string = fs.readFileSync('src/commands/' + fileName).toString();
  const tsdocParser: TSDocParser = new TSDocParser();
  const parserContext: ParserContext = tsdocParser.parseString(inputBuffer);
  console.log(os.EOL + colors.green('Input Buffer:') + os.EOL);
  console.log(colors.gray('<<<<<<'));
  console.log(inputBuffer);
  console.log(colors.gray('>>>>>>'));

  console.log(os.EOL + colors.green('Extracted Lines:') + os.EOL);
  console.log(
    JSON.stringify(
      parserContext.lines.map((x) => x.toString()),
      undefined,
      '  ',
    ),
  );
  console.log(os.EOL + colors.green('Parser Log Messages:') + os.EOL);

  if (parserContext.log.messages.length === 0) {
    console.log('No errors or warnings.');
  } else {
    for (const message of parserContext.log.messages) {
      console.log(fileName + message.toString());
    }
  }

  console.log(os.EOL + colors.green('DocComment parts:') + os.EOL);

  const docComment: DocComment = parserContext.docComment;

  console.log(colors.cyan('Summary: ') + JSON.stringify(Formatter.renderDocNode(docComment.summarySection)));

  if (docComment.remarksBlock) {
    console.log(colors.cyan('Remarks: ') + JSON.stringify(Formatter.renderDocNode(docComment.remarksBlock.content)));
  }

  for (const paramBlock of docComment.params.blocks) {
    console.log(
      colors.cyan(`Parameter "${paramBlock.parameterName}": `) +
        JSON.stringify(Formatter.renderDocNode(paramBlock.content)),
    );
  }

  if (docComment.returnsBlock) {
    console.log(colors.cyan('Returns: ') + JSON.stringify(Formatter.renderDocNode(docComment.returnsBlock.content)));
  }

  console.log(colors.cyan('Modifiers: ') + docComment.modifierTagSet.nodes.map((x) => x.tagName).join(', '));
});
