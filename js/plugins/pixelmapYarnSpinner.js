/*:
 * @target MZ
 * @author PixelMap
 * @plugindesc PixelMap Yarn Spinner
 * @help This plugin adds support for Yarn Spinner dialog.  All dialog should be located directly under the main game directory
 * within a folder named "dialog", all with an extension of ".yarn".
 * 
 * Variables by default are prefixed by the name of the dialog file, meaning that each has it's own namespace (so one NPC
 * can feel one way about a player vs. another NPC, without worrying about variable name conflicts).
 * 
 * However, if a variable is prefixed with the "$global_", it will be stored globally, accessible by ALL NPCs.
 * 
 * There's also some additional functionality built-in.  If you'd like to have a NPC become exhausted after a player
 * speaks with them too many times, just increase the value of "$dialog_exhaustion".  If "$dialog_exhaustion" reaches 3,
 * the plugin will automatically redirect to a node named "Exhausted" within the dialog file.
 * 
 * Please note, if using ANY variable as a type of number, you MUST explicitly set it to a value before doing any addition
 * or subtraction.  So call <<set $dialog_exhaustion = 1>> BEFORE doing something like
 * <<set $dialog_exhaustion = $dialog_exhaustion + 1>>.  Otherwise you'll get a NaN error as Javascript has no idea how to
 * add X to nothingness.sample
 * 
 * Supported message functions:
 * - <<set_background 1>> -- Set the background to opacity to 0, 1 or 2
 * 
 * @command yarn
 * @text Yarn Dialog
 * @desc Attach yarn dialog to an NPC
 * @arg Yarn File Path
 * @type text
 * @text Yarn File Path
 * @desc Path to the Yarn Dialog file
 * @arg Start At
 * @type text
 * @text Start At
 * @desc What node to start at?
 */

"use strict";
var pixelmapYarnSpinner = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/yarn-bound-ts/lib/results.js
  var require_results = __commonJS({
    "node_modules/yarn-bound-ts/lib/results.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.OptionsResult = exports.OptionResult = exports.CommandResult = exports.TextResult = void 0;
      var Result = class {
      };
      var TextResult2 = class extends Result {
        /**
         * Create a text display result
         * @param text text to be displayed
         * @param hashtags the hashtags for the line
         * @param metadata the parent yarn data
         */
        text;
        hashtags;
        metadata;
        constructor(text, hashtags, metadata) {
          super();
          this.text = text;
          this.hashtags = hashtags;
          this.metadata = metadata;
        }
      };
      exports.TextResult = TextResult2;
      var CommandResult2 = class extends Result {
        /**
         * Return a command string
         * @param command the command text
         * @param hashtags the hashtags for the line
         * @param metadata the parent yarn data
         */
        command;
        hashtags;
        metadata;
        constructor(command, hashtags, metadata) {
          super();
          this.command = command;
          this.hashtags = hashtags;
          this.metadata = metadata;
        }
      };
      exports.CommandResult = CommandResult2;
      var OptionResult = class extends Result {
        /**
         * Strip down Conditional option for presentation
         * @param text option text to display
         * @param isAvailable whether option is available
         * @param hashtags the hashtags for the line
         * @param {object} [metadata] the parent yarn data
         */
        text;
        isAvailable;
        hashtags;
        metadata;
        constructor(text, isAvailable = true, hashtags = [], metadata) {
          super();
          this.text = text;
          this.isAvailable = isAvailable;
          this.hashtags = hashtags;
          this.metadata = metadata;
        }
      };
      exports.OptionResult = OptionResult;
      var OptionsResult2 = class extends Result {
        /**
         * Create a selectable list of options from the given list of text
         * @param {Node[]} [options] list of the text of options to be shown
         * @param {object} [metadata] the parent yarn data
         */
        options;
        metadata;
        selected;
        constructor(options, metadata) {
          super();
          this.options = options.map((s) => {
            return new OptionResult(s.text, s.isAvailable, s.hashtags);
          });
          this.metadata = metadata;
        }
        select(index = -1) {
          if (index < 0 || index >= this.options.length) {
            throw new Error(`Cannot select option #${index}, there are ${this.options.length} options`);
          }
          this.selected = index;
        }
      };
      exports.OptionsResult = OptionsResult2;
    }
  });

  // node_modules/yarn-bound-ts/lib/line-parser.js
  var require_line_parser = __commonJS({
    "node_modules/yarn-bound-ts/lib/line-parser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function parseLine(node, locale) {
        node.markup = [];
        parseCharacterLabel(node);
        parseMarkup(node, locale);
        node.text = node.text.replace(/(?:\\(.))/g, "$1");
      }
      exports.default = parseLine;
      function parseCharacterLabel(node) {
        const match = node.text.match(/^(\S+):\s+/);
        if (match) {
          node.text = node.text.replace(match[0], "");
          node.markup.push({ name: "character", properties: { name: match[1] } });
        }
      }
      function parseMarkup(node, locale) {
        const attributes = [];
        let noMarkup = false;
        const attributeRegex = /(^|[^\\])\[(.*?[^\\])\](.|$)/;
        let textRemaining = node.text;
        let resultText = "";
        let match = textRemaining.match(attributeRegex);
        while (match) {
          const { index } = match;
          const [wholeMatch, charBefore, contents, charAfter] = match;
          const hasLeadingSpace = /\s/.test(charBefore);
          const hasTrailingSpace = /\s/.test(charAfter);
          const attribute = {
            ...parseAttributeContents(contents, locale),
            position: resultText.length + index + charBefore.length
          };
          if (!noMarkup || attribute.name === "nomarkup") {
            const isReplacementTag = attribute.name === "select" || attribute.name === "plural" || attribute.name === "ordinal";
            const shouldTrim = !isReplacementTag && attribute.isSelfClosing && attribute.properties && attribute.properties.trimwhitespace !== false && (index === 0 && hasTrailingSpace || hasLeadingSpace && hasTrailingSpace);
            if (attribute.properties) {
              delete attribute.properties.trimwhitespace;
            }
            const replacement = charBefore + (attribute.replacement || "") + (shouldTrim ? charAfter.slice(1) : charAfter);
            textRemaining = textRemaining.replace(attributeRegex, replacement);
            resultText += textRemaining.slice(0, index + replacement.slice(1).length);
            textRemaining = textRemaining.slice(index + replacement.slice(1).length);
            if (!isReplacementTag && attribute.name !== "nomarkup") {
              attributes.push(attribute);
            }
          } else {
            resultText += textRemaining.slice(0, index + wholeMatch.length - 1);
            textRemaining = textRemaining.slice(index + wholeMatch.length - 1);
          }
          if (attribute.name === "nomarkup") {
            noMarkup = !attribute.isClosing;
          }
          match = textRemaining.match(attributeRegex);
        }
        node.text = resultText + textRemaining;
        const escapedCharacterRegex = /\\(\[|\])/;
        match = node.text.match(escapedCharacterRegex);
        textRemaining = node.text;
        resultText = "";
        while (match) {
          const char = match[1];
          attributes.forEach((attr) => {
            if (attr.position > resultText.length + match.index) {
              attr.position -= 1;
            }
          });
          textRemaining = textRemaining.replace(escapedCharacterRegex, char);
          resultText += textRemaining.slice(0, match.index + 1);
          textRemaining = textRemaining.slice(match.index + 1);
          match = textRemaining.match(escapedCharacterRegex);
        }
        node.text = resultText + textRemaining;
        const openTagStacks = {};
        attributes.forEach((attr) => {
          if (!openTagStacks[attr.name]) {
            openTagStacks[attr.name] = [];
          }
          if (attr.isClosing && !openTagStacks[attr.name].length) {
            throw new Error(`Encountered closing ${attr.name} tag before opening tag`);
          } else if (attr.isClosing) {
            const openTag = openTagStacks[attr.name].pop();
            node.markup.push({
              name: openTag.name,
              position: openTag.position,
              properties: openTag.properties,
              length: attr.position - openTag.position
            });
          } else if (attr.isSelfClosing) {
            node.markup.push({
              name: attr.name,
              position: attr.position,
              properties: attr.properties,
              length: 0
            });
          } else if (attr.isCloseAll) {
            const openTags = Object.values(openTagStacks).flat();
            while (openTags.length) {
              const openTag = openTags.pop();
              node.markup.push({
                name: openTag.name,
                position: openTag.position,
                properties: openTag.properties,
                length: attr.position - openTag.position
              });
            }
          } else {
            openTagStacks[attr.name].push({
              name: attr.name,
              position: attr.position,
              properties: attr.properties
            });
          }
        });
      }
      function parseAttributeContents(contents, locale) {
        const nameMatch = contents.match(/^\/?([^\s=/]+)(\/|\s|$)/);
        const isClosing = contents[0] === "/";
        const isSelfClosing = contents[contents.length - 1] === "/";
        const isCloseAll = contents === "/";
        if (isCloseAll) {
          return { name: "closeall", isCloseAll: true };
        } else if (isClosing) {
          return { name: nameMatch[1], isClosing: true };
        } else {
          const propertyAssignmentsText = nameMatch ? contents.replace(nameMatch[0], "") : contents;
          const propertyAssignments = propertyAssignmentsText.match(/(\S+?".*?"|[^\s/]+)/g);
          let properties = {};
          if (propertyAssignments) {
            properties = propertyAssignments.reduce((acc, propAss) => {
              return { ...acc, ...parsePropertyAssignment(propAss) };
            }, {});
          }
          const name = nameMatch && nameMatch[1] || Object.keys(properties)[0];
          let replacement;
          if (name === "select") {
            replacement = processSelectAttribute(properties);
          } else if (name === "plural") {
            replacement = processPluralAttribute(properties, locale);
          } else if (name === "ordinal") {
            replacement = processOrdinalAttribute(properties, locale);
          }
          return {
            name,
            properties,
            isSelfClosing,
            replacement
          };
        }
      }
      function parsePropertyAssignment(propAss) {
        const [propName, ...rest] = propAss.split("=");
        const stringValue = rest.join("=");
        if (!propName || !stringValue) {
          throw new Error(`Invalid markup property assignment: ${propAss}`);
        }
        let value;
        if (stringValue === "true" || stringValue === "false") {
          value = stringValue === "true";
        } else if (/^-?\d*\.?\d+$/.test(stringValue)) {
          value = +stringValue;
        } else if (stringValue[0] === '"' && stringValue[stringValue.length - 1] === '"') {
          value = stringValue.slice(1, -1);
        } else {
          value = stringValue;
        }
        return { [propName]: value };
      }
      function processSelectAttribute(properties) {
        return properties[properties.value];
      }
      function processPluralAttribute(properties, locale) {
        return properties[new Intl.PluralRules(locale).select(properties.value)].replace(/%/g, properties.value);
      }
      function processOrdinalAttribute(properties, locale) {
        return properties[new Intl.PluralRules(locale, { type: "ordinal" }).select(properties.value)].replace(/%/g, properties.value);
      }
    }
  });

  // node_modules/yarn-bound-ts/lib/convert-yarn-to-js.js
  var require_convert_yarn_to_js = __commonJS({
    "node_modules/yarn-bound-ts/lib/convert-yarn-to-js.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function convertYarnToJS(content) {
        const objects = [];
        const lines = content.split(/\r?\n+/).filter((line) => {
          return !line.match(/^\s*$/);
        });
        let obj = null;
        let readingBody = false;
        let filetags;
        let leadingSpace = "";
        let i = 0;
        while (lines[i].trim()[0] === "#") {
          if (!filetags)
            filetags = [];
          filetags.push(lines[i].trim().substr(1));
          i += 1;
        }
        for (; i < lines.length; i += 1) {
          if (lines[i].trim() === "===") {
            readingBody = false;
            if (filetags)
              obj.filetags = filetags;
            objects.push(obj);
            obj = null;
          } else if (readingBody) {
            obj.body += `${lines[i].replace(leadingSpace, "")}
`;
          } else if (lines[i].trim() === "---") {
            readingBody = true;
            obj.body = "";
            leadingSpace = lines[i].match(/^\s*/)[0];
          } else if (lines[i].indexOf(":") > -1) {
            const [key, value] = lines[i].split(":");
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey !== "body") {
              if (obj == null)
                obj = {};
              if (obj[trimmedKey]) {
                throw new Error(`Duplicate tag on node: ${trimmedKey}`);
              }
              obj[trimmedKey] = trimmedValue;
            }
          }
        }
        return objects;
      }
      exports.default = convertYarnToJS;
    }
  });

  // node_modules/yarn-bound-ts/lib/default-variable-storage.js
  var require_default_variable_storage = __commonJS({
    "node_modules/yarn-bound-ts/lib/default-variable-storage.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var DefaultVariableStorage = class {
        constructor() {
          this.data = {};
        }
        set(name, value) {
          this.data[name] = value;
        }
        // Called when a variable is being evaluated.
        get(name) {
          return this.data[name];
        }
      };
      exports.default = DefaultVariableStorage;
    }
  });

  // node_modules/yarn-bound-ts/lib/parser/nodes.js
  var require_nodes = __commonJS({
    "node_modules/yarn-bound-ts/lib/parser/nodes.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var Text = class {
      };
      var Shortcut = class {
      };
      var Conditional = class {
      };
      var Assignment = class {
      };
      var Literal = class {
      };
      var Expression = class {
      };
      var FunctionCall = class {
      };
      var Command = class {
      };
      exports.default = {
        types: {
          Text,
          Shortcut,
          Conditional,
          Assignment,
          Literal,
          Expression,
          FunctionCall,
          Command
        },
        // /////////////// Dialog Nodes
        DialogShortcutNode: class extends Shortcut {
          constructor(text, content, lineNo, hashtags = [], conditionalExpression) {
            super();
            this.type = "DialogShortcutNode";
            this.text = text;
            this.content = content;
            this.lineNum = lineNo.first_line;
            this.hashtags = hashtags;
            this.conditionalExpression = conditionalExpression;
          }
        },
        // /////////////// Conditional Nodes
        IfNode: class extends Conditional {
          constructor(expression, statement) {
            super();
            this.type = "IfNode";
            this.expression = expression;
            this.statement = statement;
          }
        },
        IfElseNode: class extends Conditional {
          constructor(expression, statement, elseStatement) {
            super();
            this.type = "IfElseNode";
            this.expression = expression;
            this.statement = statement;
            this.elseStatement = elseStatement;
          }
        },
        ElseNode: class extends Conditional {
          constructor(statement) {
            super();
            this.type = "ElseNode";
            this.statement = statement;
          }
        },
        ElseIfNode: class extends Conditional {
          constructor(expression, statement, elseStatement) {
            super();
            this.type = "ElseIfNode";
            this.expression = expression;
            this.statement = statement;
            this.elseStatement = elseStatement;
          }
        },
        // /////////////// Command Nodes
        GenericCommandNode: class extends Command {
          constructor(command, lineNo, hashtags = []) {
            super();
            this.type = "GenericCommandNode";
            this.command = command;
            this.hashtags = hashtags;
            this.lineNum = lineNo.first_line;
          }
        },
        JumpCommandNode: class extends Command {
          constructor(destination) {
            super();
            this.type = "JumpCommandNode";
            this.destination = destination;
          }
        },
        StopCommandNode: class extends Command {
          constructor() {
            super();
            this.type = "StopCommandNode";
          }
        },
        // /////////////// Contents Nodes
        TextNode: class extends Text {
          constructor(text, lineNo, hashtags = []) {
            super();
            this.type = "TextNode";
            this.text = text;
            this.lineNum = lineNo.first_line;
            this.hashtags = hashtags;
          }
        },
        EscapedCharacterNode: class extends Text {
          constructor(text, lineNo, hashtags = []) {
            super();
            this.type = "EscapedCharacterNode";
            this.text = text;
            this.lineNum = lineNo.first_line;
            this.hashtags = hashtags;
          }
        },
        // /////////////// Literal Nodes
        NumericLiteralNode: class extends Literal {
          constructor(numericLiteral) {
            super();
            this.type = "NumericLiteralNode";
            this.numericLiteral = numericLiteral;
          }
        },
        StringLiteralNode: class extends Literal {
          constructor(stringLiteral) {
            super();
            this.type = "StringLiteralNode";
            this.stringLiteral = stringLiteral;
          }
        },
        BooleanLiteralNode: class extends Literal {
          constructor(booleanLiteral) {
            super();
            this.type = "BooleanLiteralNode";
            this.booleanLiteral = booleanLiteral;
          }
        },
        VariableNode: class extends Literal {
          constructor(variableName) {
            super();
            this.type = "VariableNode";
            this.variableName = variableName;
          }
        },
        // /////////////// Arithmetic Expression Nodes
        UnaryMinusExpressionNode: class extends Expression {
          expression;
          constructor(expression) {
            super();
            this.expression = expression;
            this.type = "UnaryMinusExpressionNode";
          }
        },
        ArithmeticExpressionAddNode: class extends Expression {
          expression1;
          expression2;
          constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = "ArithmeticExpressionAddNode";
          }
        },
        ArithmeticExpressionMinusNode: class extends Expression {
          expression1;
          expression2;
          constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = "ArithmeticExpressionMinusNode";
          }
        },
        ArithmeticExpressionMultiplyNode: class extends Expression {
          expression1;
          expression2;
          constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = "ArithmeticExpressionMultiplyNode";
          }
        },
        ArithmeticExpressionExponentNode: class extends Expression {
          expression1;
          expression2;
          constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = "ArithmeticExpressionExponentNode";
          }
        },
        ArithmeticExpressionDivideNode: class extends Expression {
          expression1;
          expression2;
          constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = "ArithmeticExpressionDivideNode";
          }
        },
        ArithmeticExpressionModuloNode: class extends Expression {
          expression1;
          expression2;
          constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = "ArithmeticExpressionModuloNode";
          }
        },
        // /////////////// Boolean Expression Nodes
        NegatedBooleanExpressionNode: class extends Expression {
          expression;
          constructor(expression) {
            super();
            this.expression = expression;
            this.type = "NegatedBooleanExpressionNode";
          }
        },
        BooleanOrExpressionNode: class extends Expression {
          expression1;
          expression2;
          constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = "BooleanOrExpressionNode";
          }
        },
        BooleanAndExpressionNode: class extends Expression {
          expression1;
          expression2;
          constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = "BooleanAndExpressionNode";
          }
        },
        BooleanXorExpressionNode: class extends Expression {
          expression1;
          expression2;
          constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = "BooleanXorExpressionNode";
          }
        },
        EqualToExpressionNode: class extends Expression {
          constructor(expression1, expression2) {
            super();
            this.type = "EqualToExpressionNode";
            this.expression1 = expression1;
            this.expression2 = expression2;
          }
        },
        NotEqualToExpressionNode: class extends Expression {
          constructor(expression1, expression2) {
            super();
            this.type = "NotEqualToExpressionNode";
            this.expression1 = expression1;
            this.expression2 = expression2;
          }
        },
        GreaterThanExpressionNode: class extends Expression {
          constructor(expression1, expression2) {
            super();
            this.type = "GreaterThanExpressionNode";
            this.expression1 = expression1;
            this.expression2 = expression2;
          }
        },
        GreaterThanOrEqualToExpressionNode: class extends Expression {
          constructor(expression1, expression2) {
            super();
            this.type = "GreaterThanOrEqualToExpressionNode";
            this.expression1 = expression1;
            this.expression2 = expression2;
          }
        },
        LessThanExpressionNode: class extends Expression {
          constructor(expression1, expression2) {
            super();
            this.type = "LessThanExpressionNode";
            this.expression1 = expression1;
            this.expression2 = expression2;
          }
        },
        LessThanOrEqualToExpressionNode: class extends Expression {
          constructor(expression1, expression2) {
            super();
            this.type = "LessThanOrEqualToExpressionNode";
            this.expression1 = expression1;
            this.expression2 = expression2;
          }
        },
        // /////////////// Assignment Expression Nodes
        SetVariableEqualToNode: class extends Assignment {
          constructor(variableName, expression) {
            super();
            this.type = "SetVariableEqualToNode";
            this.variableName = variableName;
            this.expression = expression;
          }
        },
        // /////////////// Function Nodes
        FunctionCallNode: class extends FunctionCall {
          constructor(functionName, args, lineNo, hashtags = []) {
            super();
            this.type = "FunctionCallNode";
            this.functionName = functionName;
            this.args = args;
            this.lineNum = lineNo.first_line;
            this.hashtags = hashtags;
          }
        },
        // /////////////// Inline Expression
        InlineExpressionNode: class extends Expression {
          constructor(expression, lineNo, hashtags = []) {
            super();
            this.type = "InlineExpressionNode";
            this.expression = expression;
            this.lineNum = lineNo.first_line;
            this.hashtags = hashtags;
          }
        }
      };
    }
  });

  // node_modules/yarn-bound-ts/lib/lexer/tokens.js
  var require_tokens = __commonJS({
    "node_modules/yarn-bound-ts/lib/lexer/tokens.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var Tokens = {
        // Special tokens
        Whitespace: null,
        Indent: null,
        Dedent: null,
        EndOfLine: /\n/,
        EndOfInput: null,
        // Literals in ("<<commands>>")
        Number: /-?[0-9]+(\.[0-9+])?/,
        String: /"([^"\\]*(?:\\.[^"\\]*)*)"/,
        // Command syntax ("<<foo>>")
        BeginCommand: /<</,
        EndCommand: />>/,
        // Variables ("$foo")
        Variable: /\$([A-Za-z0-9_.])+/,
        // Shortcut syntax ("->")
        ShortcutOption: /->/,
        // Hashtag ("#something")
        Hashtag: /#([^(\s|#|//)]+)/,
        // Comment ("// some stuff")
        Comment: /\/\/.*/,
        // Option syntax ("[[Let's go here|Destination]]")
        OptionStart: /\[\[/,
        OptionDelimit: /\|/,
        OptionEnd: /\]\]/,
        // Command types (specially recognized command word)
        If: /if(?!\w)/,
        ElseIf: /elseif(?!\w)/,
        Else: /else(?!\w)/,
        EndIf: /endif(?!\w)/,
        Jump: /jump(?!\w)/,
        Stop: /stop(?!\w)/,
        Set: /set(?!\w)/,
        Declare: /declare(?!\w)/,
        As: /as(?!\w)/,
        ExplicitType: /(String|Number|Bool)(?=>>)/,
        // Boolean values
        True: /true(?!\w)/,
        False: /false(?!\w)/,
        // The null value
        Null: /null(?!\w)/,
        // Parentheses
        LeftParen: /\(/,
        RightParen: /\)/,
        // Parameter delimiters
        Comma: /,/,
        // Operators
        UnaryMinus: /-(?!\s)/,
        EqualTo: /(==|is(?!\w)|eq(?!\w))/,
        GreaterThan: /(>|gt(?!\w))/,
        GreaterThanOrEqualTo: /(>=|gte(?!\w))/,
        LessThan: /(<|lt(?!\w))/,
        LessThanOrEqualTo: /(<=|lte(?!\w))/,
        NotEqualTo: /(!=|neq(?!\w))/,
        // Logical operators
        Or: /(\|\||or(?!\w))/,
        And: /(&&|and(?!\w))/,
        Xor: /(\^|xor(?!\w))/,
        Not: /(!|not(?!\w))/,
        // this guy's special because '=' can mean either 'equal to'
        // or 'becomes' depending on context
        EqualToOrAssign: /(=|to(?!\w))/,
        Add: /\+/,
        Minus: /-/,
        Exponent: /\*\*/,
        Multiply: /\*/,
        Divide: /\//,
        Modulo: /%/,
        AddAssign: /\+=/,
        MinusAssign: /-=/,
        MultiplyAssign: /\*=/,
        DivideAssign: /\/=/,
        Identifier: /[a-zA-Z0-9_:.]+/,
        EscapedCharacter: /\\./,
        Text: /[^\\]/,
        // Braces are used for inline expressions. Ignore escaped braces
        // TODO: doesn't work ios
        BeginInlineExp: /{/,
        EndInlineExp: /}/
        // }
      };
      exports.default = Tokens;
    }
  });

  // node_modules/yarn-bound-ts/lib/lexer/lexer-state.js
  var require_lexer_state = __commonJS({
    "node_modules/yarn-bound-ts/lib/lexer/lexer-state.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var tokens_1 = __importDefault(require_tokens());
      var LexerState = class {
        constructor() {
          this.transitions = [];
          this.textRule = null;
          this.isTrackingNextIndentation = false;
        }
        /**
         * addTransition - Define a new transition for this state.
         *
         * @param  {type} token - the token to match
         * @param  {string} [state] - the state to which transition; if not provided, will
         *                            remain in the same state.
         * @param  {boolean} [delimitsText] - `true` if the token is a text delimiter. A text delimiters
         *                                    is a token which should be considered as a token, even if it
         *                                    doesn't start the line.
         * @return {Object} - returns the LexState itself for chaining.
         */
        addTransition(token, state, delimitsText) {
          this.transitions.push({
            token,
            regex: tokens_1.default[token],
            state: state || null,
            delimitsText: delimitsText || false
          });
          return this;
        }
        /**
         * addTextRule - Match all the way up to any of the other transitions in this state.
         *               The text rule can only be added once.
         *
         * @param  {type} type  description
         * @param  {type} state description
         * @return {Object} - returns the LexState itself for chaining.
         */
        addTextRule(type, state) {
          if (this.textRule) {
            throw new Error("Cannot add more than one text rule to a state.");
          }
          const rules = [];
          this.transitions.forEach((transition) => {
            if (transition.delimitsText) {
              rules.push(`(${transition.regex.source})`);
            }
          });
          const textPattern = `((?!${rules.join("|")}).)+`;
          this.addTransition(type, state);
          this.textRule = this.transitions[this.transitions.length - 1];
          this.textRule.regex = new RegExp(textPattern);
          return this;
        }
        /**
         * setTrackNextIndentation - tell this state whether to track indentation.
         *
         * @param  {boolean} track - `true` to track, `false` otherwise.
         * @return {Object} - returns the LexState itself for chaining.
         */
        setTrackNextIndentation(track) {
          this.isTrackingNextIndentation = track;
          return this;
        }
      };
      exports.default = LexerState;
    }
  });

  // node_modules/yarn-bound-ts/lib/lexer/states.js
  var require_states = __commonJS({
    "node_modules/yarn-bound-ts/lib/lexer/states.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var lexer_state_1 = __importDefault(require_lexer_state());
      function makeStates() {
        return {
          base: new lexer_state_1.default().addTransition("EscapedCharacter", null, true).addTransition("Comment", null, true).addTransition("Hashtag", null, true).addTransition("BeginCommand", "command", true).addTransition("BeginInlineExp", "inlineExpression", true).addTransition("ShortcutOption", "shortcutOption").addTextRule("Text"),
          shortcutOption: new lexer_state_1.default().setTrackNextIndentation(true).addTransition("EscapedCharacter", null, true).addTransition("Comment", null, true).addTransition("Hashtag", null, true).addTransition("BeginCommand", "expression", true).addTransition("BeginInlineExp", "inlineExpressionInShortcut", true).addTextRule("Text", "base"),
          command: new lexer_state_1.default().addTransition("If", "expression").addTransition("Else").addTransition("ElseIf", "expression").addTransition("EndIf").addTransition("Set", "assignment").addTransition("Declare", "declare").addTransition("Jump", "jump").addTransition("Stop", "stop").addTransition("BeginInlineExp", "inlineExpressionInCommand", true).addTransition("EndCommand", "base", true).addTextRule("Text"),
          commandArg: new lexer_state_1.default().addTextRule("Text"),
          commandParenArgOrExpression: new lexer_state_1.default().addTransition("EndCommand", "base", true).addTransition("LeftParen", "expression").addTransition("Variable", "expression").addTransition("Number", "expression").addTransition("String").addTransition("True").addTransition("False").addTransition("Null").addTransition("RightParen"),
          assignment: new lexer_state_1.default().addTransition("Variable").addTransition("EqualToOrAssign", "expression"),
          declare: new lexer_state_1.default().addTransition("Variable").addTransition("EndCommand", "base").addTransition("EqualToOrAssign", "expression"),
          jump: new lexer_state_1.default().addTransition("Identifier").addTransition("BeginInlineExp", "inlineExpressionInCommand", true).addTransition("EndCommand", "base", true),
          stop: new lexer_state_1.default().addTransition("EndCommand", "base", true),
          expression: new lexer_state_1.default().addTransition("As").addTransition("ExplicitType").addTransition("EndCommand", "base").addTransition("Number").addTransition("String").addTransition("LeftParen").addTransition("RightParen").addTransition("EqualTo").addTransition("EqualToOrAssign").addTransition("NotEqualTo").addTransition("GreaterThanOrEqualTo").addTransition("GreaterThan").addTransition("LessThanOrEqualTo").addTransition("LessThan").addTransition("Add").addTransition("UnaryMinus").addTransition("Minus").addTransition("Exponent").addTransition("Multiply").addTransition("Divide").addTransition("Modulo").addTransition("And").addTransition("Or").addTransition("Xor").addTransition("Not").addTransition("Variable").addTransition("Comma").addTransition("True").addTransition("False").addTransition("Null").addTransition("Identifier").addTextRule(),
          inlineExpression: new lexer_state_1.default().addTransition("EndInlineExp", "base").addTransition("Number").addTransition("String").addTransition("LeftParen").addTransition("RightParen").addTransition("EqualTo").addTransition("EqualToOrAssign").addTransition("NotEqualTo").addTransition("GreaterThanOrEqualTo").addTransition("GreaterThan").addTransition("LessThanOrEqualTo").addTransition("LessThan").addTransition("Add").addTransition("UnaryMinus").addTransition("Minus").addTransition("Exponent").addTransition("Multiply").addTransition("Divide").addTransition("Modulo").addTransition("And").addTransition("Or").addTransition("Xor").addTransition("Not").addTransition("Variable").addTransition("Comma").addTransition("True").addTransition("False").addTransition("Null").addTransition("Identifier").addTextRule("Text", "base"),
          // TODO: Copied from above
          // There has to be a non-stupid way to do this, right?
          // I'm just not familiar enough yet to know how to
          // transition from inline expression back to base OR command
          // states depending on how we got there
          inlineExpressionInCommand: new lexer_state_1.default().addTransition("EndInlineExp", "command").addTransition("Number").addTransition("String").addTransition("LeftParen").addTransition("RightParen").addTransition("EqualTo").addTransition("EqualToOrAssign").addTransition("NotEqualTo").addTransition("GreaterThanOrEqualTo").addTransition("GreaterThan").addTransition("LessThanOrEqualTo").addTransition("LessThan").addTransition("Add").addTransition("UnaryMinus").addTransition("Minus").addTransition("Exponent").addTransition("Multiply").addTransition("Divide").addTransition("Modulo").addTransition("And").addTransition("Or").addTransition("Xor").addTransition("Not").addTransition("Variable").addTransition("Comma").addTransition("True").addTransition("False").addTransition("Null").addTransition("Identifier").addTextRule("Text", "base"),
          inlineExpressionInShortcut: new lexer_state_1.default().addTransition("EndInlineExp", "shortcutOption").addTransition("Number").addTransition("String").addTransition("LeftParen").addTransition("RightParen").addTransition("EqualTo").addTransition("EqualToOrAssign").addTransition("NotEqualTo").addTransition("GreaterThanOrEqualTo").addTransition("GreaterThan").addTransition("LessThanOrEqualTo").addTransition("LessThan").addTransition("Add").addTransition("UnaryMinus").addTransition("Minus").addTransition("Exponent").addTransition("Multiply").addTransition("Divide").addTransition("Modulo").addTransition("And").addTransition("Or").addTransition("Xor").addTransition("Not").addTransition("Variable").addTransition("Comma").addTransition("True").addTransition("False").addTransition("Null").addTransition("Identifier").addTextRule("Text", "base")
        };
      }
      exports.default = {
        makeStates
      };
    }
  });

  // node_modules/yarn-bound-ts/lib/lexer/lexer.js
  var require_lexer = __commonJS({
    "node_modules/yarn-bound-ts/lib/lexer/lexer.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var states_1 = __importDefault(require_states());
      var Lexer = class {
        constructor() {
          this.states = states_1.default.makeStates();
          this.state = "base";
          this.originalText = "";
          this.lines = [];
          this.indentation = [[0, false]];
          this.shouldTrackNextIndentation = false;
          this.previousLevelOfIndentation = 0;
          this.reset();
        }
        /**
         * reset - Reset the lexer location, text and line number. Nothing fancy.
         */
        reset() {
          this.yytext = "";
          this.yylloc = {
            first_column: 1,
            first_line: 1,
            last_column: 1,
            last_line: 1
          };
          this.yylineno = 1;
        }
        /**
         * lex - Lex the input and emit the next matched token.
         *
         * @return {string}  Emit the next token found.
         */
        lex() {
          if (this.isAtTheEndOfText()) {
            this.yytext = "";
            const indent = this.indentation.pop();
            if (indent && indent[1]) {
              return "Dedent";
            }
            return "EndOfInput";
          }
          if (this.isAtTheEndOfLine()) {
            this.advanceLine();
            return "EndOfLine";
          }
          return this.lexNextTokenOnCurrentLine();
        }
        advanceLine() {
          this.yylineno += 1;
          const currentLine = this.getCurrentLine().replace(/\t/, "    ");
          this.lines[this.yylineno - 1] = currentLine;
          this.previousLevelOfIndentation = this.getLastRecordedIndentation()[0];
          this.yytext = "";
          this.yylloc = {
            first_column: 1,
            first_line: this.yylineno,
            last_column: 1,
            last_line: this.yylineno
          };
        }
        // eslint-disable-next-line sonarjs/cognitive-complexity
        lexNextTokenOnCurrentLine() {
          const thisIndentation = this.getCurrentLineIndentation();
          if (this.shouldTrackNextIndentation && thisIndentation > this.previousLevelOfIndentation) {
            this.indentation.push([thisIndentation, true]);
            this.shouldTrackNextIndentation = false;
            this.yylloc.first_column = this.yylloc.last_column;
            this.yylloc.last_column += thisIndentation;
            this.yytext = "";
            return "Indent";
          } else if (thisIndentation < this.getLastRecordedIndentation()[0]) {
            const indent = this.indentation.pop();
            if (indent[1]) {
              this.yytext = "";
              this.previousLevelOfIndentation = this.getLastRecordedIndentation()[0];
              return "Dedent";
            }
            this.lexNextTokenOnCurrentLine();
          }
          if (thisIndentation === this.previousLevelOfIndentation && this.yylloc.last_column === 1) {
            this.yylloc.last_column += thisIndentation;
          }
          const rules = this.getState().transitions;
          for (let i = 0, len = rules.length; i < len; i += 1) {
            const rule = rules[i];
            const match = this.getCurrentLine().substring(this.yylloc.last_column - 1).match(rule.regex);
            if (match !== null && match.index === 0) {
              const matchedText = match[0];
              this.yytext = this.getCurrentLine().substr(this.yylloc.last_column - 1, matchedText.length);
              if (rule.token === "String") {
                this.yytext = this.yytext.substring(1, this.yytext.length - 1);
              }
              this.yylloc.first_column = this.yylloc.last_column;
              this.yylloc.last_column += matchedText.length;
              if (rule.state) {
                this.setState(rule.state);
                if (this.shouldTrackNextIndentation && this.getLastRecordedIndentation()[0] < thisIndentation) {
                  this.indentation.push([thisIndentation, false]);
                }
              }
              const nextState = this.states[rule.state];
              const nextStateHasText = !rule.state || nextState.transitions.find((transition) => {
                return transition.token === "Text";
              });
              if (rule.token !== "EndInlineExp" && rule.token !== "EscapedCharacter" || !nextStateHasText) {
                const spaceMatch = this.getCurrentLine().substring(this.yylloc.last_column - 1).match(/^\s*/);
                if (spaceMatch[0]) {
                  this.yylloc.last_column += spaceMatch[0].length;
                }
              }
              return rule.token;
            }
          }
          throw new Error(`Invalid syntax in: ${this.getCurrentLine()}`);
        }
        // /////////////// Getters & Setters
        /**
         * setState - set the current state of the lexer.
         *
         * @param  {string} state name of the state
         */
        setState(state) {
          if (this.states[state] === void 0) {
            throw new Error(`Cannot set the unknown state [${state}]`);
          }
          this.state = state;
          if (this.getState().isTrackingNextIndentation) {
            this.shouldTrackNextIndentation = true;
          }
        }
        /**
         * setInput - Set the text on which perform lexical analysis.
         *
         * @param  {string} text the text to lex.
         */
        setInput(text) {
          this.originalText = text.replace(/(\r\n)/g, "\n").replace(/\r/g, "\n").replace(/[\n\r]+$/, "");
          this.lines = this.originalText.split("\n");
          this.reset();
        }
        /**
         * getState - Returns the full current state object (LexerState),
         * rather than its identifier.
         *
         * @return {Object}  the state object.
         */
        getState() {
          return this.states[this.state];
        }
        getCurrentLine() {
          return this.lines[this.yylineno - 1];
        }
        getCurrentLineIndentation() {
          const match = this.getCurrentLine().match(/^(\s*)/g);
          return match[0].length;
        }
        getLastRecordedIndentation() {
          if (this.indentation.length === 0) {
            return [0, false];
          }
          return this.indentation[this.indentation.length - 1];
        }
        // /////////////// Booleans tests
        /**
         * @return {boolean}  `true` when yylloc indicates that the end was reached.
         */
        isAtTheEndOfText() {
          return this.isAtTheEndOfLine() && this.yylloc.first_line >= this.lines.length;
        }
        /**
         * @return {boolean}  `true` when yylloc indicates that the end of the line was reached.
         */
        isAtTheEndOfLine() {
          return this.yylloc.last_column > this.getCurrentLine().length;
        }
      };
      exports.default = Lexer;
    }
  });

  // node_modules/yarn-bound-ts/lib/parser/compiled-parser.js
  var require_compiled_parser = __commonJS({
    "node_modules/yarn-bound-ts/lib/parser/compiled-parser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Parser = exports.parser = void 0;
      var o = function(k, v, o2, l) {
        for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v)
          ;
        return o2;
      };
      var $V0 = [1, 16];
      var $V1 = [1, 17];
      var $V2 = [1, 12];
      var $V3 = [1, 19];
      var $V4 = [1, 18];
      var $V5 = [5, 18, 19, 23, 34, 36, 77];
      var $V6 = [1, 23];
      var $V7 = [1, 24];
      var $V8 = [1, 26];
      var $V9 = [1, 27];
      var $Va = [5, 14, 16, 18, 19, 21, 23, 34, 36, 77];
      var $Vb = [1, 30];
      var $Vc = [1, 34];
      var $Vd = [1, 35];
      var $Ve = [1, 36];
      var $Vf = [1, 37];
      var $Vg = [5, 14, 16, 18, 19, 21, 23, 26, 34, 36, 77];
      var $Vh = [1, 50];
      var $Vi = [1, 49];
      var $Vj = [1, 44];
      var $Vk = [1, 45];
      var $Vl = [1, 46];
      var $Vm = [1, 51];
      var $Vn = [1, 52];
      var $Vo = [1, 53];
      var $Vp = [1, 54];
      var $Vq = [1, 55];
      var $Vr = [5, 16, 18, 19, 23, 34, 36, 77];
      var $Vs = [1, 71];
      var $Vt = [1, 72];
      var $Vu = [1, 73];
      var $Vv = [1, 74];
      var $Vw = [1, 75];
      var $Vx = [1, 76];
      var $Vy = [1, 77];
      var $Vz = [1, 78];
      var $VA = [1, 79];
      var $VB = [1, 80];
      var $VC = [1, 81];
      var $VD = [1, 82];
      var $VE = [1, 83];
      var $VF = [1, 84];
      var $VG = [1, 85];
      var $VH = [26, 46, 51, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78];
      var $VI = [26, 46, 51, 53, 54, 55, 56, 57, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78];
      var $VJ = [26, 46, 51, 70, 78];
      var $VK = [1, 122];
      var $VL = [1, 123];
      var $VM = [26, 46, 51, 53, 54, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78];
      var $VN = [26, 46, 51, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78];
      var $VO = [51, 70];
      var $VP = [16, 18, 19, 23, 34, 77];
      var parser = {
        trace: function trace() {
        },
        yy: {},
        symbols_: {
          error: 2,
          node: 3,
          statements: 4,
          EndOfInput: 5,
          conditionalBlock: 6,
          statement: 7,
          text: 8,
          shortcut: 9,
          genericCommand: 10,
          assignmentCommand: 11,
          jumpCommand: 12,
          stopCommand: 13,
          Comment: 14,
          hashtags: 15,
          EndOfLine: 16,
          textNode: 17,
          Text: 18,
          EscapedCharacter: 19,
          inlineExpression: 20,
          Hashtag: 21,
          conditional: 22,
          BeginCommand: 23,
          If: 24,
          expression: 25,
          EndCommand: 26,
          EndIf: 27,
          additionalConditionalBlocks: 28,
          else: 29,
          Else: 30,
          elseif: 31,
          ElseIf: 32,
          shortcutOption: 33,
          ShortcutOption: 34,
          Indent: 35,
          Dedent: 36,
          Jump: 37,
          Identifier: 38,
          Stop: 39,
          setCommandInner: 40,
          declareCommandInner: 41,
          Set: 42,
          Variable: 43,
          EqualToOrAssign: 44,
          Declare: 45,
          As: 46,
          ExplicitType: 47,
          functionArgument: 48,
          functionCall: 49,
          LeftParen: 50,
          RightParen: 51,
          UnaryMinus: 52,
          Add: 53,
          Minus: 54,
          Exponent: 55,
          Multiply: 56,
          Divide: 57,
          Modulo: 58,
          Not: 59,
          Or: 60,
          And: 61,
          Xor: 62,
          EqualTo: 63,
          NotEqualTo: 64,
          GreaterThan: 65,
          GreaterThanOrEqualTo: 66,
          LessThan: 67,
          LessThanOrEqualTo: 68,
          parenExpressionArgs: 69,
          Comma: 70,
          literal: 71,
          True: 72,
          False: 73,
          Number: 74,
          String: 75,
          Null: 76,
          BeginInlineExp: 77,
          EndInlineExp: 78,
          $accept: 0,
          $end: 1
        },
        terminals_: {
          2: "error",
          5: "EndOfInput",
          14: "Comment",
          16: "EndOfLine",
          18: "Text",
          19: "EscapedCharacter",
          21: "Hashtag",
          23: "BeginCommand",
          24: "If",
          26: "EndCommand",
          27: "EndIf",
          30: "Else",
          32: "ElseIf",
          34: "ShortcutOption",
          35: "Indent",
          36: "Dedent",
          37: "Jump",
          38: "Identifier",
          39: "Stop",
          42: "Set",
          43: "Variable",
          44: "EqualToOrAssign",
          45: "Declare",
          46: "As",
          47: "ExplicitType",
          50: "LeftParen",
          51: "RightParen",
          52: "UnaryMinus",
          53: "Add",
          54: "Minus",
          55: "Exponent",
          56: "Multiply",
          57: "Divide",
          58: "Modulo",
          59: "Not",
          60: "Or",
          61: "And",
          62: "Xor",
          63: "EqualTo",
          64: "NotEqualTo",
          65: "GreaterThan",
          66: "GreaterThanOrEqualTo",
          67: "LessThan",
          68: "LessThanOrEqualTo",
          70: "Comma",
          72: "True",
          73: "False",
          74: "Number",
          75: "String",
          76: "Null",
          77: "BeginInlineExp",
          78: "EndInlineExp"
        },
        productions_: [
          0,
          [3, 2],
          [4, 1],
          [4, 2],
          [4, 1],
          [4, 2],
          [7, 1],
          [7, 1],
          [7, 1],
          [7, 1],
          [7, 1],
          [7, 1],
          [7, 2],
          [7, 2],
          [7, 2],
          [17, 1],
          [17, 1],
          [8, 1],
          [8, 1],
          [8, 2],
          [15, 1],
          [15, 2],
          [22, 4],
          [6, 6],
          [6, 4],
          [6, 2],
          [29, 3],
          [29, 2],
          [31, 4],
          [31, 2],
          [28, 5],
          [28, 5],
          [28, 3],
          [33, 2],
          [33, 3],
          [33, 2],
          [33, 2],
          [33, 3],
          [33, 2],
          [9, 1],
          [9, 5],
          [10, 3],
          [12, 4],
          [12, 4],
          [13, 3],
          [11, 3],
          [11, 3],
          [40, 4],
          [41, 4],
          [41, 6],
          [25, 1],
          [25, 1],
          [25, 3],
          [25, 2],
          [25, 3],
          [25, 3],
          [25, 3],
          [25, 3],
          [25, 3],
          [25, 3],
          [25, 2],
          [25, 3],
          [25, 3],
          [25, 3],
          [25, 3],
          [25, 3],
          [25, 3],
          [25, 3],
          [25, 3],
          [25, 3],
          [49, 3],
          [49, 4],
          [69, 3],
          [69, 1],
          [48, 1],
          [48, 1],
          [48, 1],
          [71, 1],
          [71, 1],
          [71, 1],
          [71, 1],
          [71, 1],
          [20, 3]
        ],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
          var $0 = $$.length - 1;
          switch (yystate) {
            case 1:
              return $$[$0 - 1].flat();
              break;
            case 2:
            case 4:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 17:
            case 18:
            case 73:
              this.$ = [$$[$0]];
              break;
            case 3:
              this.$ = $$[$0 - 1].concat($$[$0]);
              break;
            case 5:
              this.$ = $$[$0 - 1].concat([$$[$0]]);
              break;
            case 6:
            case 51:
              this.$ = $$[$0];
              break;
            case 12:
            case 14:
            case 25:
            case 28:
            case 29:
            case 45:
            case 52:
              this.$ = $$[$0 - 1];
              break;
            case 13:
              this.$ = $$[$0 - 1].map((s) => Object.assign(s, { hashtags: $$[$0] }));
              break;
            case 15:
              this.$ = new yy.TextNode($$[$0], this._$);
              break;
            case 16:
              this.$ = new yy.EscapedCharacterNode($$[$0], this._$);
              break;
            case 19:
              this.$ = $$[$0 - 1].concat($$[$0]);
              break;
            case 20:
              this.$ = [$$[$0].substring(1)];
              break;
            case 21:
              this.$ = [$$[$0 - 1].substring(1)].concat($$[$0]);
              break;
            case 22:
            case 36:
            case 38:
              this.$ = $$[$0 - 1];
              break;
            case 23:
              this.$ = new yy.IfNode($$[$0 - 5], $$[$0 - 3].flat());
              break;
            case 24:
              this.$ = new yy.IfElseNode($$[$0 - 3], $$[$0 - 1].flat(), $$[$0]);
              break;
            case 26:
            case 27:
              this.$ = void 0;
              break;
            case 30:
              this.$ = new yy.ElseNode($$[$0 - 3].flat());
              break;
            case 31:
              this.$ = new yy.ElseIfNode($$[$0 - 4], $$[$0 - 3].flat());
              break;
            case 32:
              this.$ = new yy.ElseIfNode($$[$0 - 2], $$[$0 - 1].flat(), $$[$0]);
              break;
            case 33:
              this.$ = { text: $$[$0] };
              break;
            case 34:
              this.$ = { text: $$[$0 - 1], conditional: $$[$0] };
              break;
            case 35:
              this.$ = { ...$$[$0 - 1], hashtags: $$[$0] };
              break;
            case 37:
              this.$ = { ...$$[$0 - 2], hashtags: $$[$0 - 1] };
              break;
            case 39:
              this.$ = new yy.DialogShortcutNode($$[$0].text, void 0, this._$, $$[$0].hashtags, $$[$0].conditional);
              break;
            case 40:
              this.$ = new yy.DialogShortcutNode($$[$0 - 4].text, $$[$0 - 1].flat(), this._$, $$[$0 - 4].hashtags, $$[$0 - 4].conditional);
              break;
            case 41:
              this.$ = new yy.GenericCommandNode($$[$0 - 1], this._$);
              break;
            case 42:
            case 43:
              this.$ = new yy.JumpCommandNode($$[$0 - 1]);
              break;
            case 44:
              this.$ = new yy.StopCommandNode();
              break;
            case 46:
              this.$ = null;
              break;
            case 47:
              this.$ = new yy.SetVariableEqualToNode($$[$0 - 2].substring(1), $$[$0]);
              break;
            case 48:
              this.$ = null;
              yy.registerDeclaration($$[$0 - 2].substring(1), $$[$0]);
              break;
            case 49:
              this.$ = null;
              yy.registerDeclaration($$[$0 - 4].substring(1), $$[$0 - 2], $$[$0]);
              break;
            case 50:
            case 74:
            case 75:
              this.$ = $$[$0];
              break;
            case 53:
              this.$ = new yy.UnaryMinusExpressionNode($$[$0]);
              break;
            case 54:
              this.$ = new yy.ArithmeticExpressionAddNode($$[$0 - 2], $$[$0]);
              break;
            case 55:
              this.$ = new yy.ArithmeticExpressionMinusNode($$[$0 - 2], $$[$0]);
              break;
            case 56:
              this.$ = new yy.ArithmeticExpressionExponentNode($$[$0 - 2], $$[$0]);
              break;
            case 57:
              this.$ = new yy.ArithmeticExpressionMultiplyNode($$[$0 - 2], $$[$0]);
              break;
            case 58:
              this.$ = new yy.ArithmeticExpressionDivideNode($$[$0 - 2], $$[$0]);
              break;
            case 59:
              this.$ = new yy.ArithmeticExpressionModuloNode($$[$0 - 2], $$[$0]);
              break;
            case 60:
              this.$ = new yy.NegatedBooleanExpressionNode($$[$0]);
              break;
            case 61:
              this.$ = new yy.BooleanOrExpressionNode($$[$0 - 2], $$[$0]);
              break;
            case 62:
              this.$ = new yy.BooleanAndExpressionNode($$[$0 - 2], $$[$0]);
              break;
            case 63:
              this.$ = new yy.BooleanXorExpressionNode($$[$0 - 2], $$[$0]);
              break;
            case 64:
              this.$ = new yy.EqualToExpressionNode($$[$0 - 2], $$[$0]);
              break;
            case 65:
              this.$ = new yy.NotEqualToExpressionNode($$[$0 - 2], $$[$0]);
              break;
            case 66:
              this.$ = new yy.GreaterThanExpressionNode($$[$0 - 2], $$[$0]);
              break;
            case 67:
              this.$ = new yy.GreaterThanOrEqualToExpressionNode($$[$0 - 2], $$[$0]);
              break;
            case 68:
              this.$ = new yy.LessThanExpressionNode($$[$0 - 2], $$[$0]);
              break;
            case 69:
              this.$ = new yy.LessThanOrEqualToExpressionNode($$[$0 - 2], $$[$0]);
              break;
            case 70:
              this.$ = new yy.FunctionCallNode($$[$0 - 2], [], this._$);
              break;
            case 71:
              this.$ = new yy.FunctionCallNode($$[$0 - 3], $$[$0 - 1], this._$);
              break;
            case 72:
              this.$ = $$[$0 - 2].concat([$$[$0]]);
              break;
            case 76:
              this.$ = new yy.VariableNode($$[$0].substring(1));
              break;
            case 77:
            case 78:
              this.$ = new yy.BooleanLiteralNode($$[$0]);
              break;
            case 79:
              this.$ = new yy.NumericLiteralNode($$[$0]);
              break;
            case 80:
              this.$ = new yy.StringLiteralNode($$[$0]);
              break;
            case 81:
              this.$ = new yy.NullLiteralNode($$[$0]);
              break;
            case 82:
              this.$ = new yy.InlineExpressionNode($$[$0 - 1], this._$);
              break;
          }
        },
        table: [
          {
            3: 1,
            4: 2,
            6: 3,
            7: 4,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            22: 5,
            23: $V2,
            33: 15,
            34: $V3,
            77: $V4
          },
          { 1: [3] },
          {
            5: [1, 20],
            6: 21,
            7: 22,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            22: 5,
            23: $V2,
            33: 15,
            34: $V3,
            77: $V4
          },
          o($V5, [2, 2], { 16: $V6 }),
          o($V5, [2, 4], { 15: 25, 14: $V7, 16: $V8, 21: $V9 }),
          { 16: [1, 28] },
          o([5, 14, 16, 21, 23, 34, 36], [2, 6], { 17: 13, 20: 14, 8: 29, 18: $V0, 19: $V1, 77: $V4 }),
          o($Va, [2, 7]),
          o($Va, [2, 8]),
          o($Va, [2, 9]),
          o($Va, [2, 10]),
          o($Va, [2, 11]),
          { 8: 31, 17: 13, 18: $V0, 19: $V1, 20: 14, 24: $Vb, 37: $Vc, 39: $Vd, 40: 32, 41: 33, 42: $Ve, 45: $Vf, 77: $V4 },
          o($Vg, [2, 17]),
          o($Vg, [2, 18]),
          o($V5, [2, 39], { 15: 39, 14: [1, 40], 16: [1, 38], 21: $V9 }),
          o($Vg, [2, 15]),
          o($Vg, [2, 16]),
          {
            20: 47,
            25: 41,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          { 8: 56, 17: 13, 18: $V0, 19: $V1, 20: 14, 77: $V4 },
          { 1: [2, 1] },
          o($V5, [2, 3], { 16: $V6 }),
          o($V5, [2, 5], { 15: 25, 14: $V7, 16: $V8, 21: $V9 }),
          o($Vr, [2, 25]),
          o($Va, [2, 12]),
          o($Va, [2, 13]),
          o($Va, [2, 14]),
          o([5, 14, 16, 18, 19, 23, 34, 36, 77], [2, 20], { 15: 57, 21: $V9 }),
          {
            4: 58,
            6: 3,
            7: 4,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            22: 5,
            23: $V2,
            33: 15,
            34: $V3,
            77: $V4
          },
          o([5, 14, 16, 21, 23, 26, 34, 36], [2, 19], { 17: 13, 20: 14, 8: 29, 18: $V0, 19: $V1, 77: $V4 }),
          {
            20: 47,
            25: 59,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          { 8: 29, 17: 13, 18: $V0, 19: $V1, 20: 14, 26: [1, 60], 77: $V4 },
          { 26: [1, 61] },
          { 26: [1, 62] },
          { 20: 64, 38: [1, 63], 77: $V4 },
          { 26: [1, 65] },
          { 43: [1, 66] },
          { 43: [1, 67] },
          o($Va, [2, 38], { 35: [1, 68] }),
          o([5, 16, 18, 19, 21, 23, 34, 36, 77], [2, 35], { 14: [1, 69] }),
          o($Va, [2, 36]),
          {
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            60: $Vy,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG,
            78: [1, 70]
          },
          o($VH, [2, 50]),
          o($VH, [2, 51]),
          {
            20: 47,
            25: 86,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 87,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 88,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          o($VH, [2, 74]),
          o($VH, [2, 75]),
          o($VH, [2, 76]),
          { 50: [1, 89] },
          o($VH, [2, 77]),
          o($VH, [2, 78]),
          o($VH, [2, 79]),
          o($VH, [2, 80]),
          o($VH, [2, 81]),
          o([5, 14, 16, 21, 34, 36], [2, 33], { 17: 13, 20: 14, 8: 29, 22: 90, 18: $V0, 19: $V1, 23: [1, 91], 77: $V4 }),
          o($Va, [2, 21]),
          {
            6: 21,
            7: 22,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            22: 5,
            23: [1, 92],
            28: 93,
            29: 94,
            31: 95,
            33: 15,
            34: $V3,
            77: $V4
          },
          {
            26: [1, 96],
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            60: $Vy,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          },
          o($Va, [2, 41]),
          o($Va, [2, 45]),
          o($Va, [2, 46]),
          { 26: [1, 97] },
          { 26: [1, 98] },
          o($Va, [2, 44]),
          { 44: [1, 99] },
          { 44: [1, 100] },
          {
            4: 101,
            6: 3,
            7: 4,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            22: 5,
            23: $V2,
            33: 15,
            34: $V3,
            77: $V4
          },
          o($Va, [2, 37]),
          o([
            5,
            14,
            16,
            18,
            19,
            21,
            23,
            26,
            34,
            36,
            46,
            51,
            53,
            54,
            55,
            56,
            57,
            58,
            60,
            61,
            62,
            63,
            64,
            65,
            66,
            67,
            68,
            70,
            77,
            78
          ], [2, 82]),
          {
            20: 47,
            25: 102,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 103,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 104,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 105,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 106,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 107,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 108,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 109,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 110,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 111,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 112,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 113,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 114,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 115,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 116,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            51: [1, 117],
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            60: $Vy,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          },
          o($VI, [2, 53], { 58: $Vx }),
          o($VJ, [2, 60], {
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            60: $Vy,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          }),
          {
            20: 47,
            25: 120,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            51: [1, 118],
            52: $Vk,
            59: $Vl,
            69: 119,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          o($Va, [2, 34]),
          { 24: $Vb },
          {
            8: 31,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            24: $Vb,
            27: [1, 121],
            30: $VK,
            32: $VL,
            37: $Vc,
            39: $Vd,
            40: 32,
            41: 33,
            42: $Ve,
            45: $Vf,
            77: $V4
          },
          o($Vr, [2, 24]),
          {
            4: 124,
            6: 3,
            7: 4,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            16: [1, 125],
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            22: 5,
            23: $V2,
            33: 15,
            34: $V3,
            77: $V4
          },
          {
            4: 126,
            6: 3,
            7: 4,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            16: [1, 127],
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            22: 5,
            23: $V2,
            33: 15,
            34: $V3,
            77: $V4
          },
          o($Va, [2, 22]),
          o($Va, [2, 42]),
          o($Va, [2, 43]),
          {
            20: 47,
            25: 128,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            20: 47,
            25: 129,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            6: 21,
            7: 22,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            22: 5,
            23: $V2,
            33: 15,
            34: $V3,
            36: [1, 130],
            77: $V4
          },
          o($VM, [2, 54], { 55: $Vu, 56: $Vv, 57: $Vw, 58: $Vx }),
          o($VM, [2, 55], { 55: $Vu, 56: $Vv, 57: $Vw, 58: $Vx }),
          o($VI, [2, 56], { 58: $Vx }),
          o($VI, [2, 57], { 58: $Vx }),
          o($VI, [2, 58], { 58: $Vx }),
          o($VJ, [2, 59], {
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            60: $Vy,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          }),
          o([26, 46, 51, 60, 70, 78], [2, 61], {
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          }),
          o([26, 46, 51, 60, 61, 70, 78], [2, 62], {
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          }),
          o([26, 46, 51, 60, 61, 62, 70, 78], [2, 63], {
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          }),
          o($VN, [2, 64], { 53: $Vs, 54: $Vt, 55: $Vu, 56: $Vv, 57: $Vw, 58: $Vx }),
          o($VN, [2, 65], { 53: $Vs, 54: $Vt, 55: $Vu, 56: $Vv, 57: $Vw, 58: $Vx }),
          o($VN, [2, 66], { 53: $Vs, 54: $Vt, 55: $Vu, 56: $Vv, 57: $Vw, 58: $Vx }),
          o($VN, [2, 67], { 53: $Vs, 54: $Vt, 55: $Vu, 56: $Vv, 57: $Vw, 58: $Vx }),
          o($VN, [2, 68], { 53: $Vs, 54: $Vt, 55: $Vu, 56: $Vv, 57: $Vw, 58: $Vx }),
          o($VN, [2, 69], { 53: $Vs, 54: $Vt, 55: $Vu, 56: $Vv, 57: $Vw, 58: $Vx }),
          o($VH, [2, 52]),
          o($VH, [2, 70]),
          { 51: [1, 131], 70: [1, 132] },
          o($VO, [2, 73], {
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            60: $Vy,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          }),
          { 26: [1, 133] },
          { 26: [1, 134] },
          {
            20: 47,
            25: 135,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          {
            6: 21,
            7: 22,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            22: 5,
            23: [1, 136],
            33: 15,
            34: $V3,
            77: $V4
          },
          o($VP, [2, 27]),
          {
            6: 21,
            7: 22,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            22: 5,
            23: [1, 137],
            28: 138,
            29: 94,
            31: 95,
            33: 15,
            34: $V3,
            77: $V4
          },
          o($VP, [2, 29]),
          {
            26: [2, 47],
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            60: $Vy,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          },
          {
            26: [2, 48],
            46: [1, 139],
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            60: $Vy,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          },
          o($Va, [2, 40]),
          o($VH, [2, 71]),
          {
            20: 47,
            25: 140,
            38: $Vh,
            43: $Vi,
            48: 42,
            49: 43,
            50: $Vj,
            52: $Vk,
            59: $Vl,
            71: 48,
            72: $Vm,
            73: $Vn,
            74: $Vo,
            75: $Vp,
            76: $Vq,
            77: $V4
          },
          o($Vr, [2, 23]),
          o($VP, [2, 26]),
          {
            26: [1, 141],
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            60: $Vy,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          },
          {
            8: 31,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            24: $Vb,
            27: [1, 142],
            37: $Vc,
            39: $Vd,
            40: 32,
            41: 33,
            42: $Ve,
            45: $Vf,
            77: $V4
          },
          {
            8: 31,
            17: 13,
            18: $V0,
            19: $V1,
            20: 14,
            24: $Vb,
            27: [1, 143],
            30: $VK,
            32: $VL,
            37: $Vc,
            39: $Vd,
            40: 32,
            41: 33,
            42: $Ve,
            45: $Vf,
            77: $V4
          },
          o($Vr, [2, 32]),
          { 47: [1, 144] },
          o($VO, [2, 72], {
            53: $Vs,
            54: $Vt,
            55: $Vu,
            56: $Vv,
            57: $Vw,
            58: $Vx,
            60: $Vy,
            61: $Vz,
            62: $VA,
            63: $VB,
            64: $VC,
            65: $VD,
            66: $VE,
            67: $VF,
            68: $VG
          }),
          o($VP, [2, 28]),
          { 26: [1, 145] },
          { 26: [1, 146] },
          { 26: [2, 49] },
          o($Vr, [2, 30]),
          o($Vr, [2, 31])
        ],
        defaultActions: { 20: [2, 1], 144: [2, 49] },
        parseError: function parseError(str, hash) {
          if (hash.recoverable) {
            this.trace(str);
          } else {
            var error = new Error(str);
            error.hash = hash;
            throw error;
          }
        },
        // eslint-disable-next-line sonarjs/cognitive-complexity
        parse: function parse(input) {
          var self2 = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
          var args = lstack.slice.call(arguments, 1);
          var lexer = Object.create(this.lexer);
          var sharedState = { yy: {} };
          for (var k in this.yy) {
            if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
              sharedState.yy[k] = this.yy[k];
            }
          }
          lexer.setInput(input, sharedState.yy);
          sharedState.yy.lexer = lexer;
          sharedState.yy.parser = this;
          if (typeof lexer.yylloc == "undefined") {
            lexer.yylloc = {};
          }
          var yyloc = lexer.yylloc;
          lstack.push(yyloc);
          var ranges = lexer.options && lexer.options.ranges;
          if (typeof sharedState.yy.parseError === "function") {
            this.parseError = sharedState.yy.parseError;
          } else {
            this.parseError = Object.getPrototypeOf(this).parseError;
          }
          function popStack(n) {
            stack.length = stack.length - 2 * n;
            vstack.length = vstack.length - n;
            lstack.length = lstack.length - n;
          }
          _token_stack:
            var lex = function() {
              var token;
              token = lexer.lex() || EOF;
              if (typeof token !== "number") {
                token = self2.symbols_[token] || token;
              }
              return token;
            };
          var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
          while (true) {
            state = stack[stack.length - 1];
            if (this.defaultActions[state]) {
              action = this.defaultActions[state];
            } else {
              if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
              }
              action = table[state] && table[state][symbol];
            }
            if (typeof action === "undefined" || !action.length || !action[0]) {
              var errStr = "";
              expected = [];
              for (p in table[state]) {
                if (this.terminals_[p] && p > TERROR) {
                  expected.push("'" + this.terminals_[p] + "'");
                }
              }
              if (lexer.showPosition) {
                errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
              } else {
                errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
              }
              this.parseError(errStr, {
                text: lexer.match,
                token: this.terminals_[symbol] || symbol,
                line: lexer.yylineno,
                loc: yyloc,
                expected
              });
            }
            if (action[0] instanceof Array && action.length > 1) {
              throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
            }
            switch (action[0]) {
              case 1:
                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]);
                symbol = null;
                if (!preErrorSymbol) {
                  yyleng = lexer.yyleng;
                  yytext = lexer.yytext;
                  yylineno = lexer.yylineno;
                  yyloc = lexer.yylloc;
                  if (recovering > 0) {
                    recovering--;
                  }
                } else {
                  symbol = preErrorSymbol;
                  preErrorSymbol = null;
                }
                break;
              case 2:
                len = this.productions_[action[1]][1];
                yyval.$ = vstack[vstack.length - len];
                yyval._$ = {
                  first_line: lstack[lstack.length - (len || 1)].first_line,
                  last_line: lstack[lstack.length - 1].last_line,
                  first_column: lstack[lstack.length - (len || 1)].first_column,
                  last_column: lstack[lstack.length - 1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));
                if (typeof r !== "undefined") {
                  return r;
                }
                if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
                }
                stack.push(this.productions_[action[1]][0]);
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                stack.push(newState);
                break;
              case 3:
                return true;
            }
          }
          return true;
        }
      };
      exports.parser = parser;
      function Parser() {
        this.yy = {};
      }
      exports.Parser = Parser;
      Parser.prototype = parser;
      parser.Parser = Parser;
    }
  });

  // node_modules/yarn-bound-ts/lib/parser/parser.js
  var require_parser = __commonJS({
    "node_modules/yarn-bound-ts/lib/parser/parser.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var lexer_1 = __importDefault(require_lexer());
      var compiled_parser_1 = require_compiled_parser();
      var nodes_1 = __importDefault(require_nodes());
      compiled_parser_1.parser.lexer = new lexer_1.default();
      compiled_parser_1.parser.yy = nodes_1.default;
      compiled_parser_1.parser.yy.declarations = {};
      compiled_parser_1.parser.yy.parseError = function parseError(e) {
        throw e;
      };
      compiled_parser_1.parser.yy.registerDeclaration = function registerDeclaration(variableName, expression, explicitType) {
        if (!this.areDeclarationsHandled) {
          if (this.declarations[variableName]) {
            throw new Error(`Duplicate declaration found for variable: ${variableName}`);
          }
          this.declarations[variableName] = {
            variableName,
            expression,
            explicitType
          };
        }
      };
      exports.default = compiled_parser_1.parser;
    }
  });

  // node_modules/yarn-bound-ts/lib/runner.js
  var require_runner = __commonJS({
    "node_modules/yarn-bound-ts/lib/runner.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Runner = void 0;
      var convert_yarn_to_js_1 = __importDefault(require_convert_yarn_to_js());
      var default_variable_storage_1 = __importDefault(require_default_variable_storage());
      var nodes_1 = __importDefault(require_nodes());
      var parser_1 = __importDefault(require_parser());
      var results = __importStar(require_results());
      var nodeTypes = nodes_1.default.types;
      var Runner = class {
        noEscape;
        yarnNodes;
        variables;
        functions;
        constructor() {
          this.noEscape = false;
          this.yarnNodes = {};
          this.variables = new default_variable_storage_1.default();
          this.functions = {};
        }
        /**
         * Loads the yarn node data into this.nodes
         * @param dialogue {any[]} yarn dialogue as string or array
         */
        load(dialogue) {
          if (!dialogue) {
            throw new Error("No dialogue supplied");
          }
          let nodes;
          if (typeof dialogue === "string") {
            nodes = (0, convert_yarn_to_js_1.default)(dialogue);
          } else {
            nodes = dialogue;
          }
          nodes.forEach((node) => {
            if (!node.title) {
              throw new Error(`Node needs a title: ${JSON.stringify(node)}`);
            } else if (node.title.split(".").length > 1) {
              throw new Error(`Node title cannot contain a dot: ${node.title}`);
            }
            if (!node.body) {
              throw new Error(`Node needs a body: ${JSON.stringify(node)}`);
            }
            if (this.yarnNodes[node.title]) {
              throw new Error(`Duplicate node title: ${node.title}`);
            }
            this.yarnNodes[node.title] = node;
          });
          parser_1.default.yy.areDeclarationsHandled = false;
          parser_1.default.yy.declarations = {};
          this.handleDeclarations(nodes);
          parser_1.default.yy.areDeclarationsHandled = true;
        }
        /**
         * Set a new variable storage object
         * This must simply contain a 'get(name)' and 'set(name, value)' function
         *
         * Calling this function will clear any existing variable's values
         */
        setVariableStorage(storage2) {
          if (typeof storage2.set !== "function" || typeof storage2.get !== "function") {
            throw new Error('Variable Storage object must contain both a "set" and "get" function');
          }
          this.variables = storage2;
        }
        /**
         * Scans for <<declare>> commands and sets initial variable values
         * @param {any[]} yarn dialogue as string or array
         */
        handleDeclarations(nodes) {
          const exampleValues = {
            Number: 0,
            String: "",
            Boolean: false
          };
          const allLines = nodes.reduce((acc, node) => {
            const nodeLines = node.body.split(/\r?\n+/);
            return [...acc, ...nodeLines];
          }, []);
          const declareLines = allLines.reduce((acc, line) => {
            const match = line.match(/^<<declare .+>>/);
            return match ? [...acc, line] : acc;
          }, []);
          if (declareLines.length) {
            parser_1.default.parse(declareLines.join("\n"));
          }
          Object.entries(parser_1.default.yy.declarations).forEach(([variableName, { expression, explicitType }]) => {
            const value = this.evaluateExpressionOrLiteral(expression);
            if (explicitType && typeof value !== typeof exampleValues[explicitType]) {
              throw new Error(`Cannot declare value ${value} as type ${explicitType} for variable ${variableName}`);
            }
            if (!this.variables.get(variableName)) {
              this.variables.set(variableName, value);
            }
          });
        }
        registerFunction(name, func) {
          if (typeof func !== "function") {
            throw new Error("Registered function must be...well...a function");
          }
          this.functions[name] = func;
        }
        /**
         * Generator to return each sequential dialog result starting from the given node
         * @param {string} [startNode] - The name of the yarn node to begin at
         */
        *run(startNode) {
          let jumpTo = startNode;
          while (jumpTo) {
            const yarnNode = this.yarnNodes[jumpTo];
            if (yarnNode === void 0) {
              throw new Error(`Node "${startNode}" does not exist`);
            }
            const parserNodes = Array.from(parser_1.default.parse(yarnNode.body));
            const metadata = { ...yarnNode };
            delete metadata.body;
            const result = yield* this.evalNodes(parserNodes, metadata);
            jumpTo = result && result.jump;
          }
        }
        /**
         * Evaluate a list of parser nodes, yielding the ones that need to be seen by
         * the user. Calls itself recursively if that is required by nested nodes
         * @param {Node[]} nodes
         * @param {YarnNode[]} metadata
         */
        // eslint-disable-next-line sonarjs/cognitive-complexity
        *evalNodes(nodes, metadata) {
          let shortcutNodes = [];
          let textRun = "";
          const filteredNodes = nodes.filter(Boolean);
          for (let nodeIdx = 0; nodeIdx < filteredNodes.length; nodeIdx += 1) {
            const node = filteredNodes[nodeIdx];
            const nextNode = filteredNodes[nodeIdx + 1];
            if (node instanceof nodeTypes.Text || node instanceof nodeTypes.Expression) {
              textRun += this.evaluateExpressionOrLiteral(node).toString();
              if (nextNode && node.lineNum === nextNode.lineNum && (nextNode instanceof nodeTypes.Text || nextNode instanceof nodeTypes.Expression)) {
              } else {
                yield new results.TextResult(textRun, node.hashtags, metadata);
                textRun = "";
              }
            } else if (node instanceof nodeTypes.Shortcut) {
              shortcutNodes.push(node);
              if (!(nextNode instanceof nodeTypes.Shortcut)) {
                const result = yield* this.handleShortcuts(shortcutNodes, metadata);
                if (result && (result.stop || result.jump)) {
                  return result;
                }
                shortcutNodes = [];
              }
            } else if (node instanceof nodeTypes.Assignment) {
              this.evaluateAssignment(node);
            } else if (node instanceof nodeTypes.Conditional) {
              const evalResult = this.evaluateConditional(node);
              if (evalResult) {
                const result = yield* this.evalNodes(evalResult, metadata);
                if (result && (result.stop || result.jump)) {
                  return result;
                }
              }
            } else if (node instanceof nodes_1.default.JumpCommandNode) {
              return { jump: node.destination };
            } else if (node instanceof nodes_1.default.StopCommandNode) {
              return { stop: true };
            } else {
              const command = this.evaluateExpressionOrLiteral(node.command);
              yield new results.CommandResult(command, node.hashtags, metadata);
            }
          }
          return void 0;
        }
        /**
         * yield a shortcut result then handle the subsequent selection
         * @param {any[]} selections
         */
        *handleShortcuts(selections, metadata) {
          const transformedSelections = selections.map((s) => {
            let isAvailable = true;
            if (s.conditionalExpression && !this.evaluateExpressionOrLiteral(s.conditionalExpression)) {
              isAvailable = false;
            }
            const text = this.evaluateExpressionOrLiteral(s.text);
            return Object.assign(s, { isAvailable, text });
          });
          const optionsResult = new results.OptionsResult(transformedSelections, metadata);
          yield optionsResult;
          if (typeof optionsResult.selected === "number") {
            const selectedOption = transformedSelections[optionsResult.selected];
            if (selectedOption.content) {
              return yield* this.evalNodes(selectedOption.content, metadata);
            }
          } else {
            throw new Error("No option selected before resuming dialogue");
          }
          return void 0;
        }
        /**
         * Evaluates the given assignment node
         */
        evaluateAssignment(node) {
          const result = this.evaluateExpressionOrLiteral(node.expression);
          const oldValue = this.variables.get(node.variableName);
          if (oldValue && typeof oldValue !== typeof result) {
            throw new Error(`Variable ${node.variableName} is already type ${typeof oldValue}; cannot set equal to ${result} of type ${typeof result}`);
          }
          this.variables.set(node.variableName, result);
        }
        /**
         * Evaluates the given conditional node
         * Returns the statements to be run as a result of it (if any)
         */
        evaluateConditional(node) {
          if (node.type === "IfNode") {
            if (this.evaluateExpressionOrLiteral(node.expression)) {
              return node.statement;
            }
          } else if (node.type === "IfElseNode" || node.type === "ElseIfNode") {
            if (this.evaluateExpressionOrLiteral(node.expression)) {
              return node.statement;
            }
            if (node.elseStatement) {
              return this.evaluateConditional(node.elseStatement);
            }
          } else {
            return node.statement;
          }
          return null;
        }
        evaluateFunctionCall(node) {
          if (this.functions[node.functionName]) {
            return this.functions[node.functionName](...node.args.map(this.evaluateExpressionOrLiteral, this));
          }
          throw new Error(`Function "${node.functionName}" not found`);
        }
        /**
         * Evaluates an expression or literal down to its final value
         */
        evaluateExpressionOrLiteral(node) {
          if (Array.isArray(node)) {
            return node.reduce((acc, n) => {
              return acc + this.evaluateExpressionOrLiteral(n).toString();
            }, "");
          }
          const nodeHandlers = {
            UnaryMinusExpressionNode: (a) => {
              return -a;
            },
            ArithmeticExpressionAddNode: (a, b) => {
              return a + b;
            },
            ArithmeticExpressionMinusNode: (a, b) => {
              return a - b;
            },
            ArithmeticExpressionExponentNode: (a, b) => {
              return a ** b;
            },
            ArithmeticExpressionMultiplyNode: (a, b) => {
              return a * b;
            },
            ArithmeticExpressionDivideNode: (a, b) => {
              return a / b;
            },
            ArithmeticExpressionModuloNode: (a, b) => {
              return a % b;
            },
            NegatedBooleanExpressionNode: (a) => {
              return !a;
            },
            BooleanOrExpressionNode: (a, b) => {
              return a || b;
            },
            BooleanAndExpressionNode: (a, b) => {
              return a && b;
            },
            BooleanXorExpressionNode: (a, b) => {
              return !!(a ^ b);
            },
            EqualToExpressionNode: (a, b) => {
              return a === b;
            },
            NotEqualToExpressionNode: (a, b) => {
              return a !== b;
            },
            GreaterThanExpressionNode: (a, b) => {
              return a > b;
            },
            GreaterThanOrEqualToExpressionNode: (a, b) => {
              return a >= b;
            },
            LessThanExpressionNode: (a, b) => {
              return a < b;
            },
            LessThanOrEqualToExpressionNode: (a, b) => {
              return a <= b;
            },
            TextNode: (a) => {
              return a.text;
            },
            EscapedCharacterNode: (a) => {
              return this.noEscape ? a.text : a.text.slice(1);
            },
            NumericLiteralNode: (a) => {
              return parseFloat(a.numericLiteral);
            },
            StringLiteralNode: (a) => {
              return `${a.stringLiteral}`;
            },
            BooleanLiteralNode: (a) => {
              return a.booleanLiteral === "true";
            },
            VariableNode: (a) => {
              return this.variables.get(a.variableName);
            },
            FunctionCallNode: (a) => {
              return this.evaluateFunctionCall(a);
            },
            InlineExpressionNode: (a) => {
              return a;
            }
          };
          const handler = nodeHandlers[node.type];
          if (!handler) {
            throw new Error(`node type not recognized: ${node.type}`);
          }
          return handler(node instanceof nodeTypes.Expression ? this.evaluateExpressionOrLiteral(node.expression || node.expression1) : node, node.expression2 ? this.evaluateExpressionOrLiteral(node.expression2) : node);
        }
      };
      exports.Runner = Runner;
    }
  });

  // node_modules/yarn-bound-ts/lib/yarn-bound.js
  var require_yarn_bound = __commonJS({
    "node_modules/yarn-bound-ts/lib/yarn-bound.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var line_parser_1 = __importDefault(require_line_parser());
      var results_1 = require_results();
      var runner_1 = require_runner();
      var YarnBound2 = class {
        handleCommand;
        combineTextAndOptionsResults;
        bufferedNode;
        currentResult;
        history;
        locale;
        runner;
        generator;
        constructor({ dialogue, variableStorage, functions: functions2, handleCommand, combineTextAndOptionsResults, locale = void 0, startAt = "Start" }) {
          this.handleCommand = handleCommand;
          this.combineTextAndOptionsResults = combineTextAndOptionsResults;
          this.bufferedNode = null;
          this.currentResult = null;
          this.history = [];
          this.locale = locale;
          this.runner = new runner_1.Runner();
          this.runner.noEscape = true;
          this.runner.load(dialogue);
          if (variableStorage) {
            variableStorage.display = variableStorage.display || variableStorage.get;
            this.runner.setVariableStorage(variableStorage);
          }
          if (functions2) {
            Object.entries(functions2).forEach((entry) => {
              this.registerFunction(...entry);
            });
          }
          this.jump(startAt);
        }
        jump(startAt) {
          this.generator = this.runner.run(startAt);
          this.bufferedNode = null;
          this.advance();
        }
        // eslint-disable-next-line sonarjs/cognitive-complexity
        advance(optionIndex = void 0) {
          if (typeof optionIndex !== "undefined" && this.currentResult && this.currentResult.select) {
            this.currentResult.select(optionIndex);
          }
          let next = this.bufferedNode || this.generator.next().value;
          let buffered = null;
          if (this.handleCommand) {
            while (next instanceof results_1.CommandResult) {
              this.handleCommand(next);
              next = this.generator.next().value;
            }
          }
          if (!(next instanceof results_1.OptionsResult)) {
            const upcoming = this.generator.next();
            buffered = upcoming.value;
            if (next instanceof results_1.TextResult && this.combineTextAndOptionsResults && buffered instanceof results_1.OptionsResult) {
              next = Object.assign(buffered, next);
              buffered = null;
            } else if (next && upcoming.done) {
              next = Object.assign(next, { isDialogueEnd: true });
            }
          }
          if (this.currentResult) {
            this.history.push(this.currentResult);
          }
          if (next instanceof results_1.TextResult) {
            (0, line_parser_1.default)(next, this.locale);
          } else if (next instanceof results_1.OptionsResult) {
            if (next.text) {
              (0, line_parser_1.default)(next, this.locale);
            }
            next.options.forEach((option) => {
              (0, line_parser_1.default)(option, this.locale);
            });
          }
          this.currentResult = next;
          this.bufferedNode = buffered;
        }
        registerFunction(name, func) {
          this.runner.registerFunction(name, func);
        }
      };
      __publicField(YarnBound2, "OptionsResult");
      __publicField(YarnBound2, "TextResult");
      __publicField(YarnBound2, "CommandResult");
      exports.default = YarnBound2;
    }
  });

  // node_modules/yarn-bound-ts/lib/index.js
  var require_lib = __commonJS({
    "node_modules/yarn-bound-ts/lib/index.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CommandResult = exports.TextResult = exports.OptionsResult = exports.YarnBound = void 0;
      var results_1 = require_results();
      Object.defineProperty(exports, "CommandResult", { enumerable: true, get: function() {
        return results_1.CommandResult;
      } });
      Object.defineProperty(exports, "OptionsResult", { enumerable: true, get: function() {
        return results_1.OptionsResult;
      } });
      Object.defineProperty(exports, "TextResult", { enumerable: true, get: function() {
        return results_1.TextResult;
      } });
      var yarn_bound_1 = __importDefault(require_yarn_bound());
      exports.YarnBound = yarn_bound_1.default;
    }
  });

  // node_modules/lodash.get/index.js
  var require_lodash = __commonJS({
    "node_modules/lodash.get/index.js"(exports, module) {
      var FUNC_ERROR_TEXT = "Expected a function";
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var INFINITY = 1 / 0;
      var funcTag = "[object Function]";
      var genTag = "[object GeneratorFunction]";
      var symbolTag = "[object Symbol]";
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
      var reIsPlainProp = /^\w*$/;
      var reLeadingDot = /^\./;
      var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      var reEscapeChar = /\\(\\)?/g;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      function getValue(object, key) {
        return object == null ? void 0 : object[key];
      }
      function isHostObject(value) {
        var result = false;
        if (value != null && typeof value.toString != "function") {
          try {
            result = !!(value + "");
          } catch (e) {
          }
        }
        return result;
      }
      var arrayProto = Array.prototype;
      var funcProto = Function.prototype;
      var objectProto = Object.prototype;
      var coreJsData = root["__core-js_shared__"];
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var objectToString = objectProto.toString;
      var reIsNative = RegExp(
        "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      var Symbol2 = root.Symbol;
      var splice = arrayProto.splice;
      var Map2 = getNative(root, "Map");
      var nativeCreate = getNative(Object, "create");
      var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
      var symbolToString = symbolProto ? symbolProto.toString : void 0;
      function Hash(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
      }
      function hashDelete(key) {
        return this.has(key) && delete this.__data__[key];
      }
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? void 0 : result;
        }
        return hasOwnProperty.call(data, key) ? data[key] : void 0;
      }
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
      }
      function hashSet(key, value) {
        var data = this.__data__;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
      }
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? void 0 : data[index][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function mapCacheClear() {
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map2 || ListCache)(),
          "string": new Hash()
        };
      }
      function mapCacheDelete(key) {
        return getMapData(this, key)["delete"](key);
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        getMapData(this, key).set(key, value);
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      function baseGet(object, path) {
        path = isKey(path, object) ? [path] : castPath(path);
        var index = 0, length = path.length;
        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }
        return index && index == length ? object : void 0;
      }
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      function castPath(value) {
        return isArray(value) ? value : stringToPath(value);
      }
      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : void 0;
      }
      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      var stringToPath = memoize(function(string) {
        string = toString(string);
        var result = [];
        if (reLeadingDot.test(string)) {
          result.push("");
        }
        string.replace(rePropName, function(match, number, quote, string2) {
          result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
        });
        return result;
      });
      function toKey(value) {
        if (typeof value == "string" || isSymbol(value)) {
          return value;
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver && typeof resolver != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result = func.apply(this, args);
          memoized.cache = cache.set(key, result);
          return result;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var isArray = Array.isArray;
      function isFunction(value) {
        var tag = isObject(value) ? objectToString.call(value) : "";
        return tag == funcTag || tag == genTag;
      }
      function isObject(value) {
        var type = typeof value;
        return !!value && (type == "object" || type == "function");
      }
      function isObjectLike(value) {
        return !!value && typeof value == "object";
      }
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
      }
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      function get2(object, path, defaultValue) {
        var result = object == null ? void 0 : baseGet(object, path);
        return result === void 0 ? defaultValue : result;
      }
      module.exports = get2;
    }
  });

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    addCommand: () => addCommand,
    commands: () => commands,
    initializeVariableStorage: () => initializeVariableStorage,
    yarnSpinnerProcesser: () => yarnSpinnerProcesser
  });
  var import_yarn_bound_ts = __toESM(require_lib());

  // src/commands/add_gold.ts
  function add_gold(_callingEventId, amount) {
    $gameParty.gainGold(amount);
  }

  // src/enums.ts
  var DIRECTION = /* @__PURE__ */ ((DIRECTION2) => {
    DIRECTION2[DIRECTION2["up"] = 8] = "up";
    DIRECTION2[DIRECTION2["down"] = 2] = "down";
    DIRECTION2[DIRECTION2["left"] = 4] = "left";
    DIRECTION2[DIRECTION2["right"] = 6] = "right";
    return DIRECTION2;
  })(DIRECTION || {});
  var FADE_TYPE = /* @__PURE__ */ ((FADE_TYPE2) => {
    FADE_TYPE2[FADE_TYPE2["fade_black"] = 0] = "fade_black";
    FADE_TYPE2[FADE_TYPE2["fade_white"] = 1] = "fade_white";
    FADE_TYPE2[FADE_TYPE2["no_fade"] = 2] = "no_fade";
    return FADE_TYPE2;
  })(FADE_TYPE || {});
  var BALLOON_TYPE = /* @__PURE__ */ ((BALLOON_TYPE2) => {
    BALLOON_TYPE2[BALLOON_TYPE2["exclamation"] = 1] = "exclamation";
    BALLOON_TYPE2[BALLOON_TYPE2["question"] = 2] = "question";
    BALLOON_TYPE2[BALLOON_TYPE2["music_note"] = 3] = "music_note";
    BALLOON_TYPE2[BALLOON_TYPE2["heart"] = 4] = "heart";
    BALLOON_TYPE2[BALLOON_TYPE2["anger"] = 5] = "anger";
    BALLOON_TYPE2[BALLOON_TYPE2["sweat"] = 6] = "sweat";
    BALLOON_TYPE2[BALLOON_TYPE2["frustration"] = 7] = "frustration";
    BALLOON_TYPE2[BALLOON_TYPE2["silence"] = 8] = "silence";
    BALLOON_TYPE2[BALLOON_TYPE2["light_bulb"] = 9] = "light_bulb";
    BALLOON_TYPE2[BALLOON_TYPE2["zzz"] = 10] = "zzz";
    return BALLOON_TYPE2;
  })(BALLOON_TYPE || {});

  // src/utils.ts
  function getItemIdFromName(itemName) {
    for (const item of $dataItems) {
      if (item && item.name === itemName) {
        return item.id;
      }
    }
    throw "Item could not be found by name";
  }
  function getEventIdByName(name) {
    for (const event of $dataMap.events) {
      if (event?.name == name) {
        return event.id;
      }
    }
    throw new Error("Could not locate an event with name: " + name);
  }
  function getMapIdByName(name) {
    for (const map of $dataMapInfos) {
      if (map?.name == name) {
        return map.id;
      }
    }
    throw new Error("Could not locate a map with name: " + name);
  }
  function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : "";
  }
  async function moveEntity(_callingEventId, direction_name, distance, speed, event, synchronous) {
    return new Promise(async (finalResolve) => {
      if (!synchronous) {
        finalResolve();
      }
      let distanceTraveled = 0;
      while (distanceTraveled < distance) {
        await new Promise(async function(resolve, _reject) {
          const direction = DIRECTION[direction_name];
          await waitUntilNotMoving(event);
          event.setThrough(true);
          event.setMoveSpeed(speed);
          event.moveStraight(direction);
          await new Promise((r) => setTimeout(r, 60));
          await waitUntilNotMoving(event);
          event.setThrough(false);
          resolve();
        });
        distanceTraveled++;
      }
      finalResolve();
    });
  }
  function waitUntilNotMoving(event) {
    return new Promise(function(resolve, _reject) {
      if (event.isMoving()) {
        const interval = setInterval(function() {
          if (!event.isMoving()) {
            clearInterval(interval);
            resolve();
          }
        }, 60);
      } else {
        resolve();
      }
    });
  }

  // src/commands/add_item.ts
  function add_item(_callingEventId, item_name, quantity = 1) {
    $gameParty.gainItem($dataItems[getItemIdFromName(item_name)], quantity, false);
  }

  // src/commands/change_weather.ts
  function change_weather(_callingEventId, weather_type, intensity = 4, duration = 24) {
    $gameScreen.changeWeather(weather_type, intensity, duration);
  }

  // src/commands/fade_in.ts
  function fade_in(_callingEventId, duration = 24) {
    $gameScreen.startTint([0, 0, 0, 0], duration);
    $gameScreen.startFadeIn(duration);
  }

  // src/commands/fade_out.ts
  function fade_out(_callingEventId, duration = 24, red = -255, green = -255, blue = -255, grey = 0, alpha = 1) {
    red = red ?? -255;
    green = green ?? -255;
    blue = blue ?? -255;
    grey = grey ?? -255;
    alpha = alpha ?? 1;
    $gameScreen.startTint([red * alpha, green * alpha, blue * alpha, grey * alpha], duration);
  }

  // src/commands/flash_screen.ts
  function flash_screen(_callingEventId, duration = 8, red = 0, green = 0, blue = 0, intensity = 255) {
    $gameScreen.startFlash([red, green, blue, intensity], duration);
  }

  // src/commands/hide_event.ts
  function hide_event(_callingEventId, entity_name) {
    const targetEventId = entity_name != void 0 ? getEventIdByName(entity_name) : _callingEventId;
    const gameEvent = $gameMap.event(targetEventId);
    gameEvent.setOpacity(0);
  }

  // src/commands/move_event.ts
  async function move_event(_callingEventId, event_name, direction_name, distance, speed = 0.25) {
    const targetEventId = getEventIdByName(event_name);
    const event = $gameMap._events[targetEventId];
    return moveEntity(_callingEventId, direction_name, distance, speed, event, false);
  }

  // src/commands/move_self.ts
  async function move_self(_callingEventId, direction_name, distance, speed = 0.25) {
    const event = $gameMap._events[_callingEventId];
    return moveEntity(_callingEventId, direction_name, distance, speed, event, false);
  }

  // src/commands/play_music.ts
  function play_music(_callingEventId, music_name, volume = 100) {
    AudioManager.playBgm({
      name: music_name,
      pos: 0,
      pan: 0,
      pitch: 100,
      volume
    });
  }

  // src/commands/play_sound.ts
  function play_sound(_callingEventId, sound_name, volume = 100) {
    AudioManager.playSe({
      name: sound_name,
      pan: 0,
      pitch: 100,
      volume,
      pos: 0
    });
  }

  // src/commands/remove_gold.ts
  function remove_gold(_callingEventId, amount) {
    $gameParty.loseGold(amount);
  }

  // src/commands/remove_item.ts
  function remove_item(_callingEventId, item_name, quantity = 1) {
    $gameParty.loseItem($dataItems[getItemIdFromName(item_name)], quantity, false);
  }

  // src/commands/set_background.ts
  function set_background(_callingEventId, opacity = 0) {
    if (opacity < 0 || opacity > 2) {
      throw new Error("Invalid opacity level, must be between 0 and two");
    }
    $gameMessage.setBackground(opacity);
  }

  // src/commands/set_facing.ts
  function set_facing(_callingEventId, event_name, direction) {
    const targetEventId = getEventIdByName(event_name);
    const parsedDirection = DIRECTION[direction];
    $gameMap._events[targetEventId].setDirection(parsedDirection);
  }

  // src/commands/set_level.ts
  function set_level(_callingEventId, map_name, x, y, direction = getEnumKeyByEnumValue(DIRECTION, $gamePlayer.direction()), fade_type = "no_fade") {
    const parsedDirection = DIRECTION[direction];
    $gamePlayer.reserveTransfer(
      getMapIdByName(map_name),
      x,
      y,
      parsedDirection,
      FADE_TYPE[fade_type]
    );
  }

  // src/commands/set_self_facing.ts
  function set_self_facing(_callingEventId, direction) {
    const parsedDirection = DIRECTION[direction];
    $gameMap._events[_callingEventId].setDirection(parsedDirection);
  }

  // src/commands/show_balloon.ts
  function show_balloon(_callingEventId, balloon_type, event_name) {
    if (event_name == "player") {
      $gameTemp.requestBalloon($gamePlayer, BALLOON_TYPE[balloon_type]);
    } else if (event_name == void 0) {
      $gameTemp.requestBalloon(
        $gameMap._events[_callingEventId],
        BALLOON_TYPE[balloon_type]
      );
    } else {
      const targetEventId = getEventIdByName(event_name);
      $gameTemp.requestBalloon($gameMap._events[targetEventId], BALLOON_TYPE[balloon_type]);
    }
  }

  // src/commands/show_event.ts
  function show_event(_callingEventId, event_name, opacity = 1) {
    if (arguments.length > 1) {
      opacity = parseFloat(opacity);
    }
    const targetEventId = event_name != void 0 ? getEventIdByName(event_name) : _callingEventId;
    const gameEvent = $gameMap.event(targetEventId);
    if (opacity > 1) {
      throw new Error("Opacity greater than 1, please use a value between 0 and 1");
    }
    if (opacity < 0) {
      throw new Error("Opacity less than 0, please use a value between 0 and 1");
    }
    const opacityInHexFormat = opacity * 255;
    gameEvent.setOpacity(opacityInHexFormat);
  }

  // src/commands/stop_music.ts
  function stop_music(_callingEventId, duration = 0) {
    $gameSystem.saveBgm();
    AudioManager.fadeOutBgm(duration);
  }

  // src/commands/sync_move_event.ts
  async function sync_move_event(_callingEventId, event_name, direction_name, distance, speed = 0.25) {
    const targetEventId = getEventIdByName(event_name);
    const event = $gameMap._events[targetEventId];
    return moveEntity(_callingEventId, direction_name, distance, speed, event, true);
  }

  // src/commands/sync_move_self.ts
  async function sync_move_self(_callingEventId, direction_name, distance, speed = 0.25) {
    const event = $gameMap._events[_callingEventId];
    return moveEntity(_callingEventId, direction_name, distance, speed, event, true);
  }

  // src/commands/teleport_event.ts
  function teleport_event(_callingEventId, event_name, x, y) {
    const targetEventId = getEventIdByName(event_name);
    const event = $gameMap._events[targetEventId];
    event.setPosition(x, y);
  }

  // src/commands/teleport_self.ts
  function teleport_self(_callingEventId, x, y) {
    const targetEventId = _callingEventId;
    const event = $gameMap._events[targetEventId];
    event.setPosition(x, y);
  }

  // src/commands/wait.ts
  async function wait(_callingEventId, duration) {
    await new Promise((r) => setTimeout(r, duration));
  }

  // src/commands/index.ts
  var commands = /* @__PURE__ */ new Map([
    ["add_item", add_item],
    ["add_gold", add_gold],
    ["change_weather", change_weather],
    ["fade_out", fade_out],
    ["fade_in", fade_in],
    ["flash_screen", flash_screen],
    ["hide_event", hide_event],
    ["move_event", move_event],
    ["move_self", move_self],
    ["play_music", play_music],
    ["play_sound", play_sound],
    ["remove_item", remove_item],
    ["remove_gold", remove_gold],
    ["set_facing", set_facing],
    ["set_level", set_level],
    ["show_balloon", show_balloon],
    ["show_event", show_event],
    ["stop_music", stop_music],
    ["teleport_event", teleport_event],
    ["teleport_self", teleport_self],
    ["set_background", set_background],
    ["set_self_facing", set_self_facing],
    ["sync_move_event", sync_move_event],
    ["sync_move_self", sync_move_self],
    ["wait", wait]
  ]);
  function isNum(value) {
    return /^\d+$/.test(value);
  }
  async function addCommand(commandName, command) {
    if (commands.get(commandName)) {
      console.error(`Command ${commandName} already exists.  Skipping add.`);
    } else {
      commands.set(commandName, command);
    }
  }
  async function executeCommand(command, args, callingEventId) {
    if (commands.get(command)) {
      for (let i = 0; i < args.length; i++) {
        if (isNum(args[i])) {
          args[i] = parseInt(args[i]);
        }
      }
      return await commands.get(command)(callingEventId, ...args);
    }
    throw new Error("Invalid command, cannot find: " + command);
  }

  // src/functions/get_variable.ts
  var import_lodash = __toESM(require_lodash());
  function get_variable(variable_name) {
    return (0, import_lodash.default)(window, variable_name);
    ;
  }

  // src/playerHasItemByName.ts
  function playerHasItemByName(itemName) {
    for (const item of $dataItems) {
      if (item && item.name === itemName) {
        return $gameParty.hasItem(item, true);
      }
    }
    return false;
  }

  // src/functions/has_item.ts
  function has_item(itemName) {
    return playerHasItemByName(itemName);
  }

  // src/functions/item_count.ts
  function item_count(itemName) {
    const itemId = getItemIdFromName(itemName);
    return $gameParty.numItems($dataItems[itemId]);
  }

  // src/functions/random_range.ts
  function random_range(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // src/functions/index.ts
  var functions = {
    has_item,
    item_count,
    random_range,
    get_variable
  };

  // src/wrap.ts
  function wrap(str, options) {
    options = options || {};
    if (str == null) {
      return str;
    }
    const width = options.width || 50;
    const indent = typeof options.indent === "string" ? options.indent : "";
    const newline = options.newline || "\n" + indent;
    const escape = typeof options.escape === "function" ? options.escape : identity;
    let regexString = ".{1," + width + "}";
    if (!options.cut) {
      regexString += "([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)";
    }
    const re = new RegExp(regexString, "g");
    const lines = str.match(re) || [];
    let result = indent + lines.map(function(line) {
      if (line.slice(-1) === "\n") {
        line = line.slice(0, line.length - 1);
      }
      return escape(line);
    }).join(newline);
    if (options.trim) {
      result = result.replace(/[ \t]*$/gm, "");
    }
    return result;
  }
  function identity(str) {
    return str;
  }

  // src/processor/updateCharacterPortrait.ts
  function updateCharacterPortrait(currentResult) {
    const character = currentResult.markup.find((markup) => {
      return markup.name === "character";
    });
    if (character) {
      $gameMessage.setFaceImage(character.properties.name, 0);
    }
  }

  // src/processor/addFormattedGameMessage.ts
  var callBackAfterMessageClose = () => {
  };
  Window_Base.prototype.updateClose = function() {
    if (this._closing) {
      this.openness -= 32;
      if (this.isClosed()) {
        this._closing = false;
      }
      if (!this._closing)
        callBackAfterMessageClose();
    }
  };
  async function addFormattedGameMessage(currentResult) {
    return new Promise((resolve) => {
      updateCharacterPortrait(currentResult);
      if (currentResult.text.trim().length > 0) {
        let text = currentResult.text;
        const special = currentResult.markup.find((markup) => {
          return markup.name === "special";
        });
        if (special) {
          text = currentResult.text.slice(0, special.position) + "\\C[1]" + currentResult.text.slice(special.position, special.position + special.length) + "\\C[0]" + currentResult.text.slice(special.position + special.length);
        }
        callBackAfterMessageClose = () => {
          callBackAfterMessageClose = () => {
          };
          resolve();
        };
        $gameMessage.add(wrap(text, { width: 58 }));
      }
    });
  }

  // src/split-spaces-exclude-quotes.ts
  function splitSpacesExcludeQuotes(input) {
    const matches = input.match(/\\?.|^$/g);
    if (matches) {
      return matches.reduce(
        (p, c) => {
          if (c === '"') {
            p.quote ^= 1;
          } else if (!p.quote && c === " ") {
            p.a.push("");
          } else {
            p.a[p.a.length - 1] += c.replace(/\\(.)/, "$1");
          }
          return p;
        },
        { a: [""] }
        // @ts-ignore
      ).a;
    }
  }

  // src/index.ts
  function initializeVariableStorage() {
    Game_System.prototype.variableStorage = function() {
      if (!this._variableStorage) {
        this._variableStorage = /* @__PURE__ */ new Map();
      }
      return this._variableStorage;
    };
    return /* @__PURE__ */ new Map();
  }
  var MAX_DIALOG_EXHAUSTION = 3;
  PluginManager.registerCommand("pixelmapYarnSpinner", "yarn", invokeYarn);
  function invokeYarn(args) {
    const callingEventId = this._eventId;
    return fetch(args["Yarn File Path"]).then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const prefix = args["Yarn File Path"].split(".")[0].replace("dialog/", "");
      const startAt = args["Start At"];
      void response.text().then((dialogue) => {
        yarnSpinnerProcesser(prefix, dialogue, startAt, callingEventId).catch((e) => {
          console.error(e);
        });
      });
    });
  }
  async function yarnSpinnerProcesser(prefix, dialogue, startAt, callingEventId) {
    const variableStorage = new VariableStorage(prefix);
    if (startAt == "StardewMode") {
      startAt = getStardewModeNode(variableStorage, dialogue);
    }
    const runner = new import_yarn_bound_ts.YarnBound({
      dialogue,
      startAt,
      functions,
      variableStorage
    });
    await processYarnDialog(runner, callingEventId);
  }
  function getStardewModeNode(variableStorage, dialogue) {
    let exhaustion = variableStorage.getExhaustion();
    if (!exhaustion) {
      exhaustion = 0;
    }
    if (exhaustion >= MAX_DIALOG_EXHAUSTION) {
      return getRandomNodeOfType("Exhausted" /* Exhausted */, dialogue);
    }
    variableStorage.set("dialog_exhaustion", exhaustion + 1);
    const introduced = variableStorage.get("introduced");
    if (!introduced) {
      variableStorage.set("introduced", true);
      return "Start";
    }
    return getRandomNodeOfType("Anytime" /* Anytime */, dialogue);
  }
  function getNodes(dialogue) {
    const tempRunner = new import_yarn_bound_ts.YarnBound({
      dialogue
    });
    return Object.entries(tempRunner.runner.yarnNodes);
  }
  function getRandomNodeOfType(type, dialogue) {
    const nodes = getNodes(dialogue);
    const filtered = nodes.filter((node) => {
      return node[0].includes(type);
    });
    return filtered[Math.floor(Math.random() * filtered.length)][0];
  }
  async function processYarnDialog(runner, callingEventId) {
    const currentResult = runner.currentResult;
    switch (currentResult.constructor) {
      case import_yarn_bound_ts.TextResult:
        await addFormattedGameMessage(currentResult);
        if (!currentResult.isDialogueEnd) {
          if (currentResult.text.trim().length > 0) {
          }
          runner.advance();
          await processYarnDialog(runner, callingEventId);
        }
        break;
      case import_yarn_bound_ts.OptionsResult:
        const choices = [];
        const choiceIndexMap = {};
        let arrayIndex = 0;
        let yarnIndex = 0;
        for (const option of currentResult.options) {
          if (option.isAvailable) {
            choices.push(option.text);
            choiceIndexMap[arrayIndex] = yarnIndex;
            arrayIndex = arrayIndex + 1;
          }
          yarnIndex = yarnIndex + 1;
        }
        $gameMessage.setChoices(choices, 0, 0);
        $gameMessage.setChoiceCallback(async (responseIndex) => {
          runner.advance(choiceIndexMap[responseIndex]);
          await processYarnDialog(runner, callingEventId);
        });
        break;
      case import_yarn_bound_ts.CommandResult:
        await commandHandler(currentResult, callingEventId);
        if (!currentResult.isDialogueEnd) {
          runner.advance();
          await processYarnDialog(runner, callingEventId);
        }
        break;
      default:
        break;
    }
  }
  async function commandHandler(cmdResult, callingEventId) {
    const splitCmd = splitSpacesExcludeQuotes(cmdResult.command);
    const cmd = splitCmd[0];
    await executeCommand(cmd, splitCmd.slice(1), callingEventId);
  }
  var storage = /* @__PURE__ */ new Map();
  var VariableStorage = class {
    storage;
    prefix;
    constructor(prefix) {
      this.storage = storage;
      this.prefix = prefix;
    }
    getExhaustion() {
      return this.storage.get(this.prefix + "_dialog_exhaustion");
    }
    get(key) {
      const retrievalKey = key.startsWith("global_") ? key : this.prefix + "_" + key;
      return this.storage.get(retrievalKey) ?? "unknown";
    }
    set(key, value) {
      const retrievalKey = key.startsWith("global_") ? key : this.prefix + "_" + key;
      this.storage.set(retrievalKey, value);
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=pixelmapYarnSpinner.js.map
