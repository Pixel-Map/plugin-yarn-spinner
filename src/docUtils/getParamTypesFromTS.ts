import * as ts from 'typescript';

export function getParamTypesFromTS(
  filepath: string,
): { parameterName: string; parameterType: string; default: any }[] {
  const inputFilename: string = filepath;
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES5,
  };
  const program: ts.Program = ts.createProgram([inputFilename], compilerOptions);

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
    if (method.name?.getText(sf) == filepath.split('/').at(-1)?.replace('.ts', '')) {
      for (const param of method.parameters) {
        // get parameter type
        const type = param.type;
        // get raw string of parameter type name
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
