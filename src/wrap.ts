export function wrap(
  str: string,
  options: {
    trim?: boolean;
    cut?: boolean;
    escape?: string;
    newline?: string;
    width?: number;
    indent?: string;
  },
) {
  options = options || {};
  if (str == null) {
    return str;
  }
  const width = options.width || 50;
  const indent = typeof options.indent === 'string' ? options.indent : '';
  const newline = options.newline || '\n' + indent;
  const escape = typeof options.escape === 'function' ? options.escape : identity;
  let regexString = '.{1,' + width + '}';
  if (!options.cut) {
    regexString += '([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)';
  }
  const re = new RegExp(regexString, 'g');
  const lines = str.match(re) || [];
  let result =
    indent +
    lines
      .map(function (line) {
        if (line.slice(-1) === '\n') {
          line = line.slice(0, line.length - 1);
        }
        return escape(line);
      })
      .join(newline);
  if (options.trim) {
    result = result.replace(/[ \t]*$/gm, '');
  }
  return result;
}

function identity(str: string) {
  return str;
}
