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
 * 
 * @command stardew
 * @text Enhanced Stardew Mode
 * @desc Highly opinionated Stardew Valley style dialog
 * @arg Character Name
 * @type text
 * @text Character Name
 * @desc Please read the README, this is highly opinionated / custom.
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
      var Lexer2 = class {
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
      exports.default = Lexer2;
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
        parse: function parse2(input) {
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
      function Parser2() {
        this.yy = {};
      }
      exports.Parser = Parser2;
      Parser2.prototype = parser;
      parser.Parser = Parser2;
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
      function getMapData(map2, key) {
        var data = map2.__data__;
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
      var stringToPath = memoize(function(string2) {
        string2 = toString(string2);
        var result = [];
        if (reLeadingDot.test(string2)) {
          result.push("");
        }
        string2.replace(rePropName, function(match, number, quote, string3) {
          result.push(quote ? string3.replace(reEscapeChar, "$1") : number || match);
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
    for (const map2 of $dataMapInfos) {
      if (map2?.name == name) {
        return map2.id;
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

  // node_modules/yaml/browser/dist/index.js
  var dist_exports = {};
  __export(dist_exports, {
    Alias: () => Alias,
    CST: () => cst_exports,
    Composer: () => Composer,
    Document: () => Document,
    Lexer: () => Lexer,
    LineCounter: () => LineCounter,
    Pair: () => Pair,
    Parser: () => Parser,
    Scalar: () => Scalar,
    Schema: () => Schema,
    YAMLError: () => YAMLError,
    YAMLMap: () => YAMLMap,
    YAMLParseError: () => YAMLParseError,
    YAMLSeq: () => YAMLSeq,
    YAMLWarning: () => YAMLWarning,
    isAlias: () => isAlias,
    isCollection: () => isCollection,
    isDocument: () => isDocument,
    isMap: () => isMap,
    isNode: () => isNode,
    isPair: () => isPair,
    isScalar: () => isScalar,
    isSeq: () => isSeq,
    parse: () => parse,
    parseAllDocuments: () => parseAllDocuments,
    parseDocument: () => parseDocument,
    stringify: () => stringify3,
    visit: () => visit,
    visitAsync: () => visitAsync
  });

  // node_modules/yaml/browser/dist/nodes/Node.js
  var ALIAS = Symbol.for("yaml.alias");
  var DOC = Symbol.for("yaml.document");
  var MAP = Symbol.for("yaml.map");
  var PAIR = Symbol.for("yaml.pair");
  var SCALAR = Symbol.for("yaml.scalar");
  var SEQ = Symbol.for("yaml.seq");
  var NODE_TYPE = Symbol.for("yaml.node.type");
  var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
  var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
  var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
  var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
  var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
  var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
  function isCollection(node) {
    if (node && typeof node === "object")
      switch (node[NODE_TYPE]) {
        case MAP:
        case SEQ:
          return true;
      }
    return false;
  }
  function isNode(node) {
    if (node && typeof node === "object")
      switch (node[NODE_TYPE]) {
        case ALIAS:
        case MAP:
        case SCALAR:
        case SEQ:
          return true;
      }
    return false;
  }
  var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
  var NodeBase = class {
    constructor(type) {
      Object.defineProperty(this, NODE_TYPE, { value: type });
    }
    /** Create a copy of this node.  */
    clone() {
      const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
  };

  // node_modules/yaml/browser/dist/visit.js
  var BREAK = Symbol("break visit");
  var SKIP = Symbol("skip children");
  var REMOVE = Symbol("remove node");
  function visit(node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (isDocument(node)) {
      const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
      if (cd === REMOVE)
        node.contents = null;
    } else
      visit_(null, node, visitor_, Object.freeze([]));
  }
  visit.BREAK = BREAK;
  visit.SKIP = SKIP;
  visit.REMOVE = REMOVE;
  function visit_(key, node, visitor, path) {
    const ctrl = callVisitor(key, node, visitor, path);
    if (isNode(ctrl) || isPair(ctrl)) {
      replaceNode(key, path, ctrl);
      return visit_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== "symbol") {
      if (isCollection(node)) {
        path = Object.freeze(path.concat(node));
        for (let i = 0; i < node.items.length; ++i) {
          const ci = visit_(i, node.items[i], visitor, path);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            node.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (isPair(node)) {
        path = Object.freeze(path.concat(node));
        const ck = visit_("key", node.key, visitor, path);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node.key = null;
        const cv = visit_("value", node.value, visitor, path);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node.value = null;
      }
    }
    return ctrl;
  }
  async function visitAsync(node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (isDocument(node)) {
      const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
      if (cd === REMOVE)
        node.contents = null;
    } else
      await visitAsync_(null, node, visitor_, Object.freeze([]));
  }
  visitAsync.BREAK = BREAK;
  visitAsync.SKIP = SKIP;
  visitAsync.REMOVE = REMOVE;
  async function visitAsync_(key, node, visitor, path) {
    const ctrl = await callVisitor(key, node, visitor, path);
    if (isNode(ctrl) || isPair(ctrl)) {
      replaceNode(key, path, ctrl);
      return visitAsync_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== "symbol") {
      if (isCollection(node)) {
        path = Object.freeze(path.concat(node));
        for (let i = 0; i < node.items.length; ++i) {
          const ci = await visitAsync_(i, node.items[i], visitor, path);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            node.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (isPair(node)) {
        path = Object.freeze(path.concat(node));
        const ck = await visitAsync_("key", node.key, visitor, path);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node.key = null;
        const cv = await visitAsync_("value", node.value, visitor, path);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node.value = null;
      }
    }
    return ctrl;
  }
  function initVisitor(visitor) {
    if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
      return Object.assign({
        Alias: visitor.Node,
        Map: visitor.Node,
        Scalar: visitor.Node,
        Seq: visitor.Node
      }, visitor.Value && {
        Map: visitor.Value,
        Scalar: visitor.Value,
        Seq: visitor.Value
      }, visitor.Collection && {
        Map: visitor.Collection,
        Seq: visitor.Collection
      }, visitor);
    }
    return visitor;
  }
  function callVisitor(key, node, visitor, path) {
    if (typeof visitor === "function")
      return visitor(key, node, path);
    if (isMap(node))
      return visitor.Map?.(key, node, path);
    if (isSeq(node))
      return visitor.Seq?.(key, node, path);
    if (isPair(node))
      return visitor.Pair?.(key, node, path);
    if (isScalar(node))
      return visitor.Scalar?.(key, node, path);
    if (isAlias(node))
      return visitor.Alias?.(key, node, path);
    return void 0;
  }
  function replaceNode(key, path, node) {
    const parent = path[path.length - 1];
    if (isCollection(parent)) {
      parent.items[key] = node;
    } else if (isPair(parent)) {
      if (key === "key")
        parent.key = node;
      else
        parent.value = node;
    } else if (isDocument(parent)) {
      parent.contents = node;
    } else {
      const pt = isAlias(parent) ? "alias" : "scalar";
      throw new Error(`Cannot replace node with ${pt} parent`);
    }
  }

  // node_modules/yaml/browser/dist/doc/directives.js
  var escapeChars = {
    "!": "%21",
    ",": "%2C",
    "[": "%5B",
    "]": "%5D",
    "{": "%7B",
    "}": "%7D"
  };
  var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
  var Directives = class {
    constructor(yaml, tags) {
      this.docStart = null;
      this.docEnd = false;
      this.yaml = Object.assign({}, Directives.defaultYaml, yaml);
      this.tags = Object.assign({}, Directives.defaultTags, tags);
    }
    clone() {
      const copy = new Directives(this.yaml, this.tags);
      copy.docStart = this.docStart;
      return copy;
    }
    /**
     * During parsing, get a Directives instance for the current document and
     * update the stream state according to the current version's spec.
     */
    atDocument() {
      const res = new Directives(this.yaml, this.tags);
      switch (this.yaml.version) {
        case "1.1":
          this.atNextDocument = true;
          break;
        case "1.2":
          this.atNextDocument = false;
          this.yaml = {
            explicit: Directives.defaultYaml.explicit,
            version: "1.2"
          };
          this.tags = Object.assign({}, Directives.defaultTags);
          break;
      }
      return res;
    }
    /**
     * @param onError - May be called even if the action was successful
     * @returns `true` on success
     */
    add(line, onError) {
      if (this.atNextDocument) {
        this.yaml = { explicit: Directives.defaultYaml.explicit, version: "1.1" };
        this.tags = Object.assign({}, Directives.defaultTags);
        this.atNextDocument = false;
      }
      const parts = line.trim().split(/[ \t]+/);
      const name = parts.shift();
      switch (name) {
        case "%TAG": {
          if (parts.length !== 2) {
            onError(0, "%TAG directive should contain exactly two parts");
            if (parts.length < 2)
              return false;
          }
          const [handle, prefix] = parts;
          this.tags[handle] = prefix;
          return true;
        }
        case "%YAML": {
          this.yaml.explicit = true;
          if (parts.length !== 1) {
            onError(0, "%YAML directive should contain exactly one part");
            return false;
          }
          const [version] = parts;
          if (version === "1.1" || version === "1.2") {
            this.yaml.version = version;
            return true;
          } else {
            const isValid = /^\d+\.\d+$/.test(version);
            onError(6, `Unsupported YAML version ${version}`, isValid);
            return false;
          }
        }
        default:
          onError(0, `Unknown directive ${name}`, true);
          return false;
      }
    }
    /**
     * Resolves a tag, matching handles to those defined in %TAG directives.
     *
     * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
     *   `'!local'` tag, or `null` if unresolvable.
     */
    tagName(source, onError) {
      if (source === "!")
        return "!";
      if (source[0] !== "!") {
        onError(`Not a valid tag: ${source}`);
        return null;
      }
      if (source[1] === "<") {
        const verbatim = source.slice(2, -1);
        if (verbatim === "!" || verbatim === "!!") {
          onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
          return null;
        }
        if (source[source.length - 1] !== ">")
          onError("Verbatim tags must end with a >");
        return verbatim;
      }
      const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/);
      if (!suffix)
        onError(`The ${source} tag has no suffix`);
      const prefix = this.tags[handle];
      if (prefix)
        return prefix + decodeURIComponent(suffix);
      if (handle === "!")
        return source;
      onError(`Could not resolve tag: ${source}`);
      return null;
    }
    /**
     * Given a fully resolved tag, returns its printable string form,
     * taking into account current tag prefixes and defaults.
     */
    tagString(tag) {
      for (const [handle, prefix] of Object.entries(this.tags)) {
        if (tag.startsWith(prefix))
          return handle + escapeTagName(tag.substring(prefix.length));
      }
      return tag[0] === "!" ? tag : `!<${tag}>`;
    }
    toString(doc) {
      const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
      const tagEntries = Object.entries(this.tags);
      let tagNames;
      if (doc && tagEntries.length > 0 && isNode(doc.contents)) {
        const tags = {};
        visit(doc.contents, (_key, node) => {
          if (isNode(node) && node.tag)
            tags[node.tag] = true;
        });
        tagNames = Object.keys(tags);
      } else
        tagNames = [];
      for (const [handle, prefix] of tagEntries) {
        if (handle === "!!" && prefix === "tag:yaml.org,2002:")
          continue;
        if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
          lines.push(`%TAG ${handle} ${prefix}`);
      }
      return lines.join("\n");
    }
  };
  Directives.defaultYaml = { explicit: false, version: "1.2" };
  Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };

  // node_modules/yaml/browser/dist/doc/anchors.js
  function anchorIsValid(anchor) {
    if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
      const sa = JSON.stringify(anchor);
      const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
      throw new Error(msg);
    }
    return true;
  }
  function anchorNames(root) {
    const anchors = /* @__PURE__ */ new Set();
    visit(root, {
      Value(_key, node) {
        if (node.anchor)
          anchors.add(node.anchor);
      }
    });
    return anchors;
  }
  function findNewAnchor(prefix, exclude) {
    for (let i = 1; true; ++i) {
      const name = `${prefix}${i}`;
      if (!exclude.has(name))
        return name;
    }
  }
  function createNodeAnchors(doc, prefix) {
    const aliasObjects = [];
    const sourceObjects = /* @__PURE__ */ new Map();
    let prevAnchors = null;
    return {
      onAnchor: (source) => {
        aliasObjects.push(source);
        if (!prevAnchors)
          prevAnchors = anchorNames(doc);
        const anchor = findNewAnchor(prefix, prevAnchors);
        prevAnchors.add(anchor);
        return anchor;
      },
      /**
       * With circular references, the source node is only resolved after all
       * of its child nodes are. This is why anchors are set only after all of
       * the nodes have been created.
       */
      setAnchors: () => {
        for (const source of aliasObjects) {
          const ref = sourceObjects.get(source);
          if (typeof ref === "object" && ref.anchor && (isScalar(ref.node) || isCollection(ref.node))) {
            ref.node.anchor = ref.anchor;
          } else {
            const error = new Error("Failed to resolve repeated object (this should not happen)");
            error.source = source;
            throw error;
          }
        }
      },
      sourceObjects
    };
  }

  // node_modules/yaml/browser/dist/nodes/Alias.js
  var Alias = class extends NodeBase {
    constructor(source) {
      super(ALIAS);
      this.source = source;
      Object.defineProperty(this, "tag", {
        set() {
          throw new Error("Alias nodes cannot have tags");
        }
      });
    }
    /**
     * Resolve the value of this alias within `doc`, finding the last
     * instance of the `source` anchor before this node.
     */
    resolve(doc) {
      let found = void 0;
      visit(doc, {
        Node: (_key, node) => {
          if (node === this)
            return visit.BREAK;
          if (node.anchor === this.source)
            found = node;
        }
      });
      return found;
    }
    toJSON(_arg, ctx) {
      if (!ctx)
        return { source: this.source };
      const { anchors, doc, maxAliasCount } = ctx;
      const source = this.resolve(doc);
      if (!source) {
        const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new ReferenceError(msg);
      }
      const data = anchors.get(source);
      if (!data || data.res === void 0) {
        const msg = "This should not happen: Alias anchor was not resolved?";
        throw new ReferenceError(msg);
      }
      if (maxAliasCount >= 0) {
        data.count += 1;
        if (data.aliasCount === 0)
          data.aliasCount = getAliasCount(doc, source, anchors);
        if (data.count * data.aliasCount > maxAliasCount) {
          const msg = "Excessive alias count indicates a resource exhaustion attack";
          throw new ReferenceError(msg);
        }
      }
      return data.res;
    }
    toString(ctx, _onComment, _onChompKeep) {
      const src = `*${this.source}`;
      if (ctx) {
        anchorIsValid(this.source);
        if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new Error(msg);
        }
        if (ctx.implicitKey)
          return `${src} `;
      }
      return src;
    }
  };
  function getAliasCount(doc, node, anchors) {
    if (isAlias(node)) {
      const source = node.resolve(doc);
      const anchor = anchors && source && anchors.get(source);
      return anchor ? anchor.count * anchor.aliasCount : 0;
    } else if (isCollection(node)) {
      let count = 0;
      for (const item of node.items) {
        const c = getAliasCount(doc, item, anchors);
        if (c > count)
          count = c;
      }
      return count;
    } else if (isPair(node)) {
      const kc = getAliasCount(doc, node.key, anchors);
      const vc = getAliasCount(doc, node.value, anchors);
      return Math.max(kc, vc);
    }
    return 1;
  }

  // node_modules/yaml/browser/dist/nodes/toJS.js
  function toJS(value, arg, ctx) {
    if (Array.isArray(value))
      return value.map((v, i) => toJS(v, String(i), ctx));
    if (value && typeof value.toJSON === "function") {
      if (!ctx || !hasAnchor(value))
        return value.toJSON(arg, ctx);
      const data = { aliasCount: 0, count: 1, res: void 0 };
      ctx.anchors.set(value, data);
      ctx.onCreate = (res2) => {
        data.res = res2;
        delete ctx.onCreate;
      };
      const res = value.toJSON(arg, ctx);
      if (ctx.onCreate)
        ctx.onCreate(res);
      return res;
    }
    if (typeof value === "bigint" && !ctx?.keep)
      return Number(value);
    return value;
  }

  // node_modules/yaml/browser/dist/nodes/Scalar.js
  var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
  var Scalar = class extends NodeBase {
    constructor(value) {
      super(SCALAR);
      this.value = value;
    }
    toJSON(arg, ctx) {
      return ctx?.keep ? this.value : toJS(this.value, arg, ctx);
    }
    toString() {
      return String(this.value);
    }
  };
  Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
  Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
  Scalar.PLAIN = "PLAIN";
  Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";

  // node_modules/yaml/browser/dist/doc/createNode.js
  var defaultTagPrefix = "tag:yaml.org,2002:";
  function findTagObject(value, tagName, tags) {
    if (tagName) {
      const match = tags.filter((t) => t.tag === tagName);
      const tagObj = match.find((t) => !t.format) ?? match[0];
      if (!tagObj)
        throw new Error(`Tag ${tagName} not found`);
      return tagObj;
    }
    return tags.find((t) => t.identify?.(value) && !t.format);
  }
  function createNode(value, tagName, ctx) {
    if (isDocument(value))
      value = value.contents;
    if (isNode(value))
      return value;
    if (isPair(value)) {
      const map2 = ctx.schema[MAP].createNode?.(ctx.schema, null, ctx);
      map2.items.push(value);
      return map2;
    }
    if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
      value = value.valueOf();
    }
    const { aliasDuplicateObjects, onAnchor, onTagObj, schema: schema4, sourceObjects } = ctx;
    let ref = void 0;
    if (aliasDuplicateObjects && value && typeof value === "object") {
      ref = sourceObjects.get(value);
      if (ref) {
        if (!ref.anchor)
          ref.anchor = onAnchor(value);
        return new Alias(ref.anchor);
      } else {
        ref = { anchor: null, node: null };
        sourceObjects.set(value, ref);
      }
    }
    if (tagName?.startsWith("!!"))
      tagName = defaultTagPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema4.tags);
    if (!tagObj) {
      if (value && typeof value.toJSON === "function") {
        value = value.toJSON();
      }
      if (!value || typeof value !== "object") {
        const node2 = new Scalar(value);
        if (ref)
          ref.node = node2;
        return node2;
      }
      tagObj = value instanceof Map ? schema4[MAP] : Symbol.iterator in Object(value) ? schema4[SEQ] : schema4[MAP];
    }
    if (onTagObj) {
      onTagObj(tagObj);
      delete ctx.onTagObj;
    }
    const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : new Scalar(value);
    if (tagName)
      node.tag = tagName;
    if (ref)
      ref.node = node;
    return node;
  }

  // node_modules/yaml/browser/dist/nodes/Collection.js
  function collectionFromPath(schema4, path, value) {
    let v = value;
    for (let i = path.length - 1; i >= 0; --i) {
      const k = path[i];
      if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
        const a = [];
        a[k] = v;
        v = a;
      } else {
        v = /* @__PURE__ */ new Map([[k, v]]);
      }
    }
    return createNode(v, void 0, {
      aliasDuplicateObjects: false,
      keepUndefined: false,
      onAnchor: () => {
        throw new Error("This should not happen, please report a bug.");
      },
      schema: schema4,
      sourceObjects: /* @__PURE__ */ new Map()
    });
  }
  var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
  var Collection = class extends NodeBase {
    constructor(type, schema4) {
      super(type);
      Object.defineProperty(this, "schema", {
        value: schema4,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
    /**
     * Create a copy of this collection.
     *
     * @param schema - If defined, overwrites the original's schema
     */
    clone(schema4) {
      const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
      if (schema4)
        copy.schema = schema4;
      copy.items = copy.items.map((it) => isNode(it) || isPair(it) ? it.clone(schema4) : it);
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    /**
     * Adds a value to the collection. For `!!map` and `!!omap` the value must
     * be a Pair instance or a `{ key, value }` object, which may not have a key
     * that already exists in the map.
     */
    addIn(path, value) {
      if (isEmptyPath(path))
        this.add(value);
      else {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (isCollection(node))
          node.addIn(rest, value);
        else if (node === void 0 && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
    /**
     * Removes a value from the collection.
     * @returns `true` if the item was found and removed.
     */
    deleteIn(path) {
      const [key, ...rest] = path;
      if (rest.length === 0)
        return this.delete(key);
      const node = this.get(key, true);
      if (isCollection(node))
        return node.deleteIn(rest);
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn(path, keepScalar) {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (rest.length === 0)
        return !keepScalar && isScalar(node) ? node.value : node;
      else
        return isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
    }
    hasAllNullValues(allowScalar) {
      return this.items.every((node) => {
        if (!isPair(node))
          return false;
        const n = node.value;
        return n == null || allowScalar && isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
      });
    }
    /**
     * Checks if the collection includes a value with the key `key`.
     */
    hasIn(path) {
      const [key, ...rest] = path;
      if (rest.length === 0)
        return this.has(key);
      const node = this.get(key, true);
      return isCollection(node) ? node.hasIn(rest) : false;
    }
    /**
     * Sets a value in this collection. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn(path, value) {
      const [key, ...rest] = path;
      if (rest.length === 0) {
        this.set(key, value);
      } else {
        const node = this.get(key, true);
        if (isCollection(node))
          node.setIn(rest, value);
        else if (node === void 0 && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
  };
  Collection.maxFlowStringSingleLineLength = 60;

  // node_modules/yaml/browser/dist/stringify/stringifyComment.js
  var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
  function indentComment(comment, indent) {
    if (/^\n+$/.test(comment))
      return comment.substring(1);
    return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
  }
  var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;

  // node_modules/yaml/browser/dist/stringify/foldFlowLines.js
  var FOLD_FLOW = "flow";
  var FOLD_BLOCK = "block";
  var FOLD_QUOTED = "quoted";
  function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
    if (!lineWidth || lineWidth < 0)
      return text;
    const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
    if (text.length <= endStep)
      return text;
    const folds = [];
    const escapedFolds = {};
    let end = lineWidth - indent.length;
    if (typeof indentAtStart === "number") {
      if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
        folds.push(0);
      else
        end = lineWidth - indentAtStart;
    }
    let split = void 0;
    let prev = void 0;
    let overflow = false;
    let i = -1;
    let escStart = -1;
    let escEnd = -1;
    if (mode === FOLD_BLOCK) {
      i = consumeMoreIndentedLines(text, i);
      if (i !== -1)
        end = i + endStep;
    }
    for (let ch; ch = text[i += 1]; ) {
      if (mode === FOLD_QUOTED && ch === "\\") {
        escStart = i;
        switch (text[i + 1]) {
          case "x":
            i += 3;
            break;
          case "u":
            i += 5;
            break;
          case "U":
            i += 9;
            break;
          default:
            i += 1;
        }
        escEnd = i;
      }
      if (ch === "\n") {
        if (mode === FOLD_BLOCK)
          i = consumeMoreIndentedLines(text, i);
        end = i + endStep;
        split = void 0;
      } else {
        if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
          const next = text[i + 1];
          if (next && next !== " " && next !== "\n" && next !== "	")
            split = i;
        }
        if (i >= end) {
          if (split) {
            folds.push(split);
            end = split + endStep;
            split = void 0;
          } else if (mode === FOLD_QUOTED) {
            while (prev === " " || prev === "	") {
              prev = ch;
              ch = text[i += 1];
              overflow = true;
            }
            const j = i > escEnd + 1 ? i - 2 : escStart - 1;
            if (escapedFolds[j])
              return text;
            folds.push(j);
            escapedFolds[j] = true;
            end = j + endStep;
            split = void 0;
          } else {
            overflow = true;
          }
        }
      }
      prev = ch;
    }
    if (overflow && onOverflow)
      onOverflow();
    if (folds.length === 0)
      return text;
    if (onFold)
      onFold();
    let res = text.slice(0, folds[0]);
    for (let i2 = 0; i2 < folds.length; ++i2) {
      const fold = folds[i2];
      const end2 = folds[i2 + 1] || text.length;
      if (fold === 0)
        res = `
${indent}${text.slice(0, end2)}`;
      else {
        if (mode === FOLD_QUOTED && escapedFolds[fold])
          res += `${text[fold]}\\`;
        res += `
${indent}${text.slice(fold + 1, end2)}`;
      }
    }
    return res;
  }
  function consumeMoreIndentedLines(text, i) {
    let ch = text[i + 1];
    while (ch === " " || ch === "	") {
      do {
        ch = text[i += 1];
      } while (ch && ch !== "\n");
      ch = text[i + 1];
    }
    return i;
  }

  // node_modules/yaml/browser/dist/stringify/stringifyString.js
  var getFoldOptions = (ctx) => ({
    indentAtStart: ctx.indentAtStart,
    lineWidth: ctx.options.lineWidth,
    minContentWidth: ctx.options.minContentWidth
  });
  var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
  function lineLengthOverLimit(str, lineWidth, indentLength) {
    if (!lineWidth || lineWidth < 0)
      return false;
    const limit = lineWidth - indentLength;
    const strLen = str.length;
    if (strLen <= limit)
      return false;
    for (let i = 0, start = 0; i < strLen; ++i) {
      if (str[i] === "\n") {
        if (i - start > limit)
          return true;
        start = i + 1;
        if (strLen - start <= limit)
          return false;
      }
    }
    return true;
  }
  function doubleQuotedString(value, ctx) {
    const json = JSON.stringify(value);
    if (ctx.options.doubleQuotedAsJSON)
      return json;
    const { implicitKey } = ctx;
    const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
    const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    let str = "";
    let start = 0;
    for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
      if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
        str += json.slice(start, i) + "\\ ";
        i += 1;
        start = i;
        ch = "\\";
      }
      if (ch === "\\")
        switch (json[i + 1]) {
          case "u":
            {
              str += json.slice(start, i);
              const code = json.substr(i + 2, 4);
              switch (code) {
                case "0000":
                  str += "\\0";
                  break;
                case "0007":
                  str += "\\a";
                  break;
                case "000b":
                  str += "\\v";
                  break;
                case "001b":
                  str += "\\e";
                  break;
                case "0085":
                  str += "\\N";
                  break;
                case "00a0":
                  str += "\\_";
                  break;
                case "2028":
                  str += "\\L";
                  break;
                case "2029":
                  str += "\\P";
                  break;
                default:
                  if (code.substr(0, 2) === "00")
                    str += "\\x" + code.substr(2);
                  else
                    str += json.substr(i, 6);
              }
              i += 5;
              start = i + 1;
            }
            break;
          case "n":
            if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
              i += 1;
            } else {
              str += json.slice(start, i) + "\n\n";
              while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                str += "\n";
                i += 2;
              }
              str += indent;
              if (json[i + 2] === " ")
                str += "\\";
              i += 1;
              start = i + 1;
            }
            break;
          default:
            i += 1;
        }
    }
    str = start ? str + json.slice(start) : json;
    return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx));
  }
  function singleQuotedString(value, ctx) {
    if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
      return doubleQuotedString(value, ctx);
    const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
    return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx));
  }
  function quotedString(value, ctx) {
    const { singleQuote } = ctx.options;
    let qs;
    if (singleQuote === false)
      qs = doubleQuotedString;
    else {
      const hasDouble = value.includes('"');
      const hasSingle = value.includes("'");
      if (hasDouble && !hasSingle)
        qs = singleQuotedString;
      else if (hasSingle && !hasDouble)
        qs = doubleQuotedString;
      else
        qs = singleQuote ? singleQuotedString : doubleQuotedString;
    }
    return qs(value, ctx);
  }
  function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
    const { blockQuote, commentString, lineWidth } = ctx.options;
    if (!blockQuote || /\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
      return quotedString(value, ctx);
    }
    const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
    const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.BLOCK_FOLDED ? false : type === Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
    if (!value)
      return literal ? "|\n" : ">\n";
    let chomp;
    let endStart;
    for (endStart = value.length; endStart > 0; --endStart) {
      const ch = value[endStart - 1];
      if (ch !== "\n" && ch !== "	" && ch !== " ")
        break;
    }
    let end = value.substring(endStart);
    const endNlPos = end.indexOf("\n");
    if (endNlPos === -1) {
      chomp = "-";
    } else if (value === end || endNlPos !== end.length - 1) {
      chomp = "+";
      if (onChompKeep)
        onChompKeep();
    } else {
      chomp = "";
    }
    if (end) {
      value = value.slice(0, -end.length);
      if (end[end.length - 1] === "\n")
        end = end.slice(0, -1);
      end = end.replace(/\n+(?!\n|$)/g, `$&${indent}`);
    }
    let startWithSpace = false;
    let startEnd;
    let startNlPos = -1;
    for (startEnd = 0; startEnd < value.length; ++startEnd) {
      const ch = value[startEnd];
      if (ch === " ")
        startWithSpace = true;
      else if (ch === "\n")
        startNlPos = startEnd;
      else
        break;
    }
    let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
    if (start) {
      value = value.substring(start.length);
      start = start.replace(/\n+/g, `$&${indent}`);
    }
    const indentSize = indent ? "2" : "1";
    let header = (literal ? "|" : ">") + (startWithSpace ? indentSize : "") + chomp;
    if (comment) {
      header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
      if (onComment)
        onComment();
    }
    if (literal) {
      value = value.replace(/\n+/g, `$&${indent}`);
      return `${header}
${indent}${start}${value}${end}`;
    }
    value = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
    const body = foldFlowLines(`${start}${value}${end}`, indent, FOLD_BLOCK, getFoldOptions(ctx));
    return `${header}
${indent}${body}`;
  }
  function plainString(item, ctx, onComment, onChompKeep) {
    const { type, value } = item;
    const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
    if (implicitKey && /[\n[\]{},]/.test(value) || inFlow && /[[\]{},]/.test(value)) {
      return quotedString(value, ctx);
    }
    if (!value || /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
      return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
    }
    if (!implicitKey && !inFlow && type !== Scalar.PLAIN && value.includes("\n")) {
      return blockString(item, ctx, onComment, onChompKeep);
    }
    if (containsDocumentMarker(value)) {
      if (indent === "") {
        ctx.forceBlockIndent = true;
        return blockString(item, ctx, onComment, onChompKeep);
      } else if (implicitKey && indent === indentStep) {
        return quotedString(value, ctx);
      }
    }
    const str = value.replace(/\n+/g, `$&
${indent}`);
    if (actualString) {
      const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
      const { compat, tags } = ctx.doc.schema;
      if (tags.some(test) || compat?.some(test))
        return quotedString(value, ctx);
    }
    return implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx));
  }
  function stringifyString(item, ctx, onComment, onChompKeep) {
    const { implicitKey, inFlow } = ctx;
    const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
    let { type } = item;
    if (type !== Scalar.QUOTE_DOUBLE) {
      if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
        type = Scalar.QUOTE_DOUBLE;
    }
    const _stringify = (_type) => {
      switch (_type) {
        case Scalar.BLOCK_FOLDED:
        case Scalar.BLOCK_LITERAL:
          return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
        case Scalar.QUOTE_DOUBLE:
          return doubleQuotedString(ss.value, ctx);
        case Scalar.QUOTE_SINGLE:
          return singleQuotedString(ss.value, ctx);
        case Scalar.PLAIN:
          return plainString(ss, ctx, onComment, onChompKeep);
        default:
          return null;
      }
    };
    let res = _stringify(type);
    if (res === null) {
      const { defaultKeyType, defaultStringType } = ctx.options;
      const t = implicitKey && defaultKeyType || defaultStringType;
      res = _stringify(t);
      if (res === null)
        throw new Error(`Unsupported default string type ${t}`);
    }
    return res;
  }

  // node_modules/yaml/browser/dist/stringify/stringify.js
  function createStringifyContext(doc, options) {
    const opt = Object.assign({
      blockQuote: true,
      commentString: stringifyComment,
      defaultKeyType: null,
      defaultStringType: "PLAIN",
      directives: null,
      doubleQuotedAsJSON: false,
      doubleQuotedMinMultiLineLength: 40,
      falseStr: "false",
      flowCollectionPadding: true,
      indentSeq: true,
      lineWidth: 80,
      minContentWidth: 20,
      nullStr: "null",
      simpleKeys: false,
      singleQuote: null,
      trueStr: "true",
      verifyAliasOrder: true
    }, doc.schema.toStringOptions, options);
    let inFlow;
    switch (opt.collectionStyle) {
      case "block":
        inFlow = false;
        break;
      case "flow":
        inFlow = true;
        break;
      default:
        inFlow = null;
    }
    return {
      anchors: /* @__PURE__ */ new Set(),
      doc,
      flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
      inFlow,
      options: opt
    };
  }
  function getTagObject(tags, item) {
    if (item.tag) {
      const match = tags.filter((t) => t.tag === item.tag);
      if (match.length > 0)
        return match.find((t) => t.format === item.format) ?? match[0];
    }
    let tagObj = void 0;
    let obj;
    if (isScalar(item)) {
      obj = item.value;
      const match = tags.filter((t) => t.identify?.(obj));
      tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
    } else {
      obj = item;
      tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
    }
    if (!tagObj) {
      const name = obj?.constructor?.name ?? typeof obj;
      throw new Error(`Tag not resolved for ${name} value`);
    }
    return tagObj;
  }
  function stringifyProps(node, tagObj, { anchors, doc }) {
    if (!doc.directives)
      return "";
    const props = [];
    const anchor = (isScalar(node) || isCollection(node)) && node.anchor;
    if (anchor && anchorIsValid(anchor)) {
      anchors.add(anchor);
      props.push(`&${anchor}`);
    }
    const tag = node.tag ? node.tag : tagObj.default ? null : tagObj.tag;
    if (tag)
      props.push(doc.directives.tagString(tag));
    return props.join(" ");
  }
  function stringify(item, ctx, onComment, onChompKeep) {
    if (isPair(item))
      return item.toString(ctx, onComment, onChompKeep);
    if (isAlias(item)) {
      if (ctx.doc.directives)
        return item.toString(ctx);
      if (ctx.resolvedAliases?.has(item)) {
        throw new TypeError(`Cannot stringify circular structure without alias nodes`);
      } else {
        if (ctx.resolvedAliases)
          ctx.resolvedAliases.add(item);
        else
          ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
        item = item.resolve(ctx.doc);
      }
    }
    let tagObj = void 0;
    const node = isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
    if (!tagObj)
      tagObj = getTagObject(ctx.doc.schema.tags, node);
    const props = stringifyProps(node, tagObj, ctx);
    if (props.length > 0)
      ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
    const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : isScalar(node) ? stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
    if (!props)
      return str;
    return isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
  }

  // node_modules/yaml/browser/dist/stringify/stringifyPair.js
  function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
    const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
    let keyComment = isNode(key) && key.comment || null;
    if (simpleKeys) {
      if (keyComment) {
        throw new Error("With simple keys, key nodes cannot have comments");
      }
      if (isCollection(key)) {
        const msg = "With simple keys, collection cannot be used as a key value";
        throw new Error(msg);
      }
    }
    let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || isCollection(key) || (isScalar(key) ? key.type === Scalar.BLOCK_FOLDED || key.type === Scalar.BLOCK_LITERAL : typeof key === "object"));
    ctx = Object.assign({}, ctx, {
      allNullValues: false,
      implicitKey: !explicitKey && (simpleKeys || !allNullValues),
      indent: indent + indentStep
    });
    let keyCommentDone = false;
    let chompKeep = false;
    let str = stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
    if (!explicitKey && !ctx.inFlow && str.length > 1024) {
      if (simpleKeys)
        throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
      explicitKey = true;
    }
    if (ctx.inFlow) {
      if (allNullValues || value == null) {
        if (keyCommentDone && onComment)
          onComment();
        return str === "" ? "?" : explicitKey ? `? ${str}` : str;
      }
    } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
      str = `? ${str}`;
      if (keyComment && !keyCommentDone) {
        str += lineComment(str, ctx.indent, commentString(keyComment));
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    if (keyCommentDone)
      keyComment = null;
    if (explicitKey) {
      if (keyComment)
        str += lineComment(str, ctx.indent, commentString(keyComment));
      str = `? ${str}
${indent}:`;
    } else {
      str = `${str}:`;
      if (keyComment)
        str += lineComment(str, ctx.indent, commentString(keyComment));
    }
    let vsb, vcb, valueComment;
    if (isNode(value)) {
      vsb = !!value.spaceBefore;
      vcb = value.commentBefore;
      valueComment = value.comment;
    } else {
      vsb = false;
      vcb = null;
      valueComment = null;
      if (value && typeof value === "object")
        value = doc.createNode(value);
    }
    ctx.implicitKey = false;
    if (!explicitKey && !keyComment && isScalar(value))
      ctx.indentAtStart = str.length + 1;
    chompKeep = false;
    if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && isSeq(value) && !value.flow && !value.tag && !value.anchor) {
      ctx.indent = ctx.indent.substring(2);
    }
    let valueCommentDone = false;
    const valueStr = stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
    let ws = " ";
    if (keyComment || vsb || vcb) {
      ws = vsb ? "\n" : "";
      if (vcb) {
        const cs = commentString(vcb);
        ws += `
${indentComment(cs, ctx.indent)}`;
      }
      if (valueStr === "" && !ctx.inFlow) {
        if (ws === "\n")
          ws = "\n\n";
      } else {
        ws += `
${ctx.indent}`;
      }
    } else if (!explicitKey && isCollection(value)) {
      const vs0 = valueStr[0];
      const nl0 = valueStr.indexOf("\n");
      const hasNewline = nl0 !== -1;
      const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
      if (hasNewline || !flow) {
        let hasPropsLine = false;
        if (hasNewline && (vs0 === "&" || vs0 === "!")) {
          let sp0 = valueStr.indexOf(" ");
          if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
            sp0 = valueStr.indexOf(" ", sp0 + 1);
          }
          if (sp0 === -1 || nl0 < sp0)
            hasPropsLine = true;
        }
        if (!hasPropsLine)
          ws = `
${ctx.indent}`;
      }
    } else if (valueStr === "" || valueStr[0] === "\n") {
      ws = "";
    }
    str += ws + valueStr;
    if (ctx.inFlow) {
      if (valueCommentDone && onComment)
        onComment();
    } else if (valueComment && !valueCommentDone) {
      str += lineComment(str, ctx.indent, commentString(valueComment));
    } else if (chompKeep && onChompKeep) {
      onChompKeep();
    }
    return str;
  }

  // node_modules/yaml/browser/dist/log.js
  function warn(logLevel, warning) {
    if (logLevel === "debug" || logLevel === "warn") {
      if (typeof process !== "undefined" && process.emitWarning)
        process.emitWarning(warning);
      else
        console.warn(warning);
    }
  }

  // node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
  var MERGE_KEY = "<<";
  function addPairToJSMap(ctx, map2, { key, value }) {
    if (ctx?.doc.schema.merge && isMergeKey(key)) {
      value = isAlias(value) ? value.resolve(ctx.doc) : value;
      if (isSeq(value))
        for (const it of value.items)
          mergeToJSMap(ctx, map2, it);
      else if (Array.isArray(value))
        for (const it of value)
          mergeToJSMap(ctx, map2, it);
      else
        mergeToJSMap(ctx, map2, value);
    } else {
      const jsKey = toJS(key, "", ctx);
      if (map2 instanceof Map) {
        map2.set(jsKey, toJS(value, jsKey, ctx));
      } else if (map2 instanceof Set) {
        map2.add(jsKey);
      } else {
        const stringKey = stringifyKey(key, jsKey, ctx);
        const jsValue = toJS(value, stringKey, ctx);
        if (stringKey in map2)
          Object.defineProperty(map2, stringKey, {
            value: jsValue,
            writable: true,
            enumerable: true,
            configurable: true
          });
        else
          map2[stringKey] = jsValue;
      }
    }
    return map2;
  }
  var isMergeKey = (key) => key === MERGE_KEY || isScalar(key) && key.value === MERGE_KEY && (!key.type || key.type === Scalar.PLAIN);
  function mergeToJSMap(ctx, map2, value) {
    const source = ctx && isAlias(value) ? value.resolve(ctx.doc) : value;
    if (!isMap(source))
      throw new Error("Merge sources must be maps or map aliases");
    const srcMap = source.toJSON(null, ctx, Map);
    for (const [key, value2] of srcMap) {
      if (map2 instanceof Map) {
        if (!map2.has(key))
          map2.set(key, value2);
      } else if (map2 instanceof Set) {
        map2.add(key);
      } else if (!Object.prototype.hasOwnProperty.call(map2, key)) {
        Object.defineProperty(map2, key, {
          value: value2,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    }
    return map2;
  }
  function stringifyKey(key, jsKey, ctx) {
    if (jsKey === null)
      return "";
    if (typeof jsKey !== "object")
      return String(jsKey);
    if (isNode(key) && ctx && ctx.doc) {
      const strCtx = createStringifyContext(ctx.doc, {});
      strCtx.anchors = /* @__PURE__ */ new Set();
      for (const node of ctx.anchors.keys())
        strCtx.anchors.add(node.anchor);
      strCtx.inFlow = true;
      strCtx.inStringifyKey = true;
      const strKey = key.toString(strCtx);
      if (!ctx.mapKeyWarned) {
        let jsonStr = JSON.stringify(strKey);
        if (jsonStr.length > 40)
          jsonStr = jsonStr.substring(0, 36) + '..."';
        warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
        ctx.mapKeyWarned = true;
      }
      return strKey;
    }
    return JSON.stringify(jsKey);
  }

  // node_modules/yaml/browser/dist/nodes/Pair.js
  function createPair(key, value, ctx) {
    const k = createNode(key, void 0, ctx);
    const v = createNode(value, void 0, ctx);
    return new Pair(k, v);
  }
  var Pair = class {
    constructor(key, value = null) {
      Object.defineProperty(this, NODE_TYPE, { value: PAIR });
      this.key = key;
      this.value = value;
    }
    clone(schema4) {
      let { key, value } = this;
      if (isNode(key))
        key = key.clone(schema4);
      if (isNode(value))
        value = value.clone(schema4);
      return new Pair(key, value);
    }
    toJSON(_, ctx) {
      const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
      return addPairToJSMap(ctx, pair, this);
    }
    toString(ctx, onComment, onChompKeep) {
      return ctx?.doc ? stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
    }
  };

  // node_modules/yaml/browser/dist/stringify/stringifyCollection.js
  function stringifyCollection(collection, ctx, options) {
    const flow = ctx.inFlow ?? collection.flow;
    const stringify4 = flow ? stringifyFlowCollection : stringifyBlockCollection;
    return stringify4(collection, ctx, options);
  }
  function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
    const { indent, options: { commentString } } = ctx;
    const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
    let chompKeep = false;
    const lines = [];
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      let comment2 = null;
      if (isNode(item)) {
        if (!chompKeep && item.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
        if (item.comment)
          comment2 = item.comment;
      } else if (isPair(item)) {
        const ik = isNode(item.key) ? item.key : null;
        if (ik) {
          if (!chompKeep && ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
        }
      }
      chompKeep = false;
      let str2 = stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
      if (comment2)
        str2 += lineComment(str2, itemIndent, commentString(comment2));
      if (chompKeep && comment2)
        chompKeep = false;
      lines.push(blockItemPrefix + str2);
    }
    let str;
    if (lines.length === 0) {
      str = flowChars.start + flowChars.end;
    } else {
      str = lines[0];
      for (let i = 1; i < lines.length; ++i) {
        const line = lines[i];
        str += line ? `
${indent}${line}` : "\n";
      }
    }
    if (comment) {
      str += "\n" + indentComment(commentString(comment), indent);
      if (onComment)
        onComment();
    } else if (chompKeep && onChompKeep)
      onChompKeep();
    return str;
  }
  function stringifyFlowCollection({ comment, items }, ctx, { flowChars, itemIndent, onComment }) {
    const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
    itemIndent += indentStep;
    const itemCtx = Object.assign({}, ctx, {
      indent: itemIndent,
      inFlow: true,
      type: null
    });
    let reqNewline = false;
    let linesAtValue = 0;
    const lines = [];
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      let comment2 = null;
      if (isNode(item)) {
        if (item.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, item.commentBefore, false);
        if (item.comment)
          comment2 = item.comment;
      } else if (isPair(item)) {
        const ik = isNode(item.key) ? item.key : null;
        if (ik) {
          if (ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, false);
          if (ik.comment)
            reqNewline = true;
        }
        const iv = isNode(item.value) ? item.value : null;
        if (iv) {
          if (iv.comment)
            comment2 = iv.comment;
          if (iv.commentBefore)
            reqNewline = true;
        } else if (item.value == null && ik && ik.comment) {
          comment2 = ik.comment;
        }
      }
      if (comment2)
        reqNewline = true;
      let str2 = stringify(item, itemCtx, () => comment2 = null);
      if (i < items.length - 1)
        str2 += ",";
      if (comment2)
        str2 += lineComment(str2, itemIndent, commentString(comment2));
      if (!reqNewline && (lines.length > linesAtValue || str2.includes("\n")))
        reqNewline = true;
      lines.push(str2);
      linesAtValue = lines.length;
    }
    let str;
    const { start, end } = flowChars;
    if (lines.length === 0) {
      str = start + end;
    } else {
      if (!reqNewline) {
        const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
        reqNewline = len > Collection.maxFlowStringSingleLineLength;
      }
      if (reqNewline) {
        str = start;
        for (const line of lines)
          str += line ? `
${indentStep}${indent}${line}` : "\n";
        str += `
${indent}${end}`;
      } else {
        str = `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
      }
    }
    if (comment) {
      str += lineComment(str, commentString(comment), indent);
      if (onComment)
        onComment();
    }
    return str;
  }
  function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
    if (comment && chompKeep)
      comment = comment.replace(/^\n+/, "");
    if (comment) {
      const ic = indentComment(commentString(comment), indent);
      lines.push(ic.trimStart());
    }
  }

  // node_modules/yaml/browser/dist/nodes/YAMLMap.js
  function findPair(items, key) {
    const k = isScalar(key) ? key.value : key;
    for (const it of items) {
      if (isPair(it)) {
        if (it.key === key || it.key === k)
          return it;
        if (isScalar(it.key) && it.key.value === k)
          return it;
      }
    }
    return void 0;
  }
  var YAMLMap = class extends Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(schema4) {
      super(MAP, schema4);
      this.items = [];
    }
    /**
     * Adds a value to the collection.
     *
     * @param overwrite - If not set `true`, using a key that is already in the
     *   collection will throw. Otherwise, overwrites the previous value.
     */
    add(pair, overwrite) {
      let _pair;
      if (isPair(pair))
        _pair = pair;
      else if (!pair || typeof pair !== "object" || !("key" in pair)) {
        _pair = new Pair(pair, pair?.value);
      } else
        _pair = new Pair(pair.key, pair.value);
      const prev = findPair(this.items, _pair.key);
      const sortEntries = this.schema?.sortMapEntries;
      if (prev) {
        if (!overwrite)
          throw new Error(`Key ${_pair.key} already set`);
        if (isScalar(prev.value) && isScalarValue(_pair.value))
          prev.value.value = _pair.value;
        else
          prev.value = _pair.value;
      } else if (sortEntries) {
        const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
        if (i === -1)
          this.items.push(_pair);
        else
          this.items.splice(i, 0, _pair);
      } else {
        this.items.push(_pair);
      }
    }
    delete(key) {
      const it = findPair(this.items, key);
      if (!it)
        return false;
      const del = this.items.splice(this.items.indexOf(it), 1);
      return del.length > 0;
    }
    get(key, keepScalar) {
      const it = findPair(this.items, key);
      const node = it?.value;
      return (!keepScalar && isScalar(node) ? node.value : node) ?? void 0;
    }
    has(key) {
      return !!findPair(this.items, key);
    }
    set(key, value) {
      this.add(new Pair(key, value), true);
    }
    /**
     * @param ctx - Conversion context, originally set in Document#toJS()
     * @param {Class} Type - If set, forces the returned collection type
     * @returns Instance of Type, Map, or Object
     */
    toJSON(_, ctx, Type) {
      const map2 = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
      if (ctx?.onCreate)
        ctx.onCreate(map2);
      for (const item of this.items)
        addPairToJSMap(ctx, map2, item);
      return map2;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      for (const item of this.items) {
        if (!isPair(item))
          throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
      }
      if (!ctx.allNullValues && this.hasAllNullValues(false))
        ctx = Object.assign({}, ctx, { allNullValues: true });
      return stringifyCollection(this, ctx, {
        blockItemPrefix: "",
        flowChars: { start: "{", end: "}" },
        itemIndent: ctx.indent || "",
        onChompKeep,
        onComment
      });
    }
  };

  // node_modules/yaml/browser/dist/schema/common/map.js
  function createMap(schema4, obj, ctx) {
    const { keepUndefined, replacer } = ctx;
    const map2 = new YAMLMap(schema4);
    const add = (key, value) => {
      if (typeof replacer === "function")
        value = replacer.call(obj, key, value);
      else if (Array.isArray(replacer) && !replacer.includes(key))
        return;
      if (value !== void 0 || keepUndefined)
        map2.items.push(createPair(key, value, ctx));
    };
    if (obj instanceof Map) {
      for (const [key, value] of obj)
        add(key, value);
    } else if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj))
        add(key, obj[key]);
    }
    if (typeof schema4.sortMapEntries === "function") {
      map2.items.sort(schema4.sortMapEntries);
    }
    return map2;
  }
  var map = {
    collection: "map",
    createNode: createMap,
    default: true,
    nodeClass: YAMLMap,
    tag: "tag:yaml.org,2002:map",
    resolve(map2, onError) {
      if (!isMap(map2))
        onError("Expected a mapping for this tag");
      return map2;
    }
  };

  // node_modules/yaml/browser/dist/nodes/YAMLSeq.js
  var YAMLSeq = class extends Collection {
    static get tagName() {
      return "tag:yaml.org,2002:seq";
    }
    constructor(schema4) {
      super(SEQ, schema4);
      this.items = [];
    }
    add(value) {
      this.items.push(value);
    }
    /**
     * Removes a value from the collection.
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     *
     * @returns `true` if the item was found and removed.
     */
    delete(key) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        return false;
      const del = this.items.splice(idx, 1);
      return del.length > 0;
    }
    get(key, keepScalar) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        return void 0;
      const it = this.items[idx];
      return !keepScalar && isScalar(it) ? it.value : it;
    }
    /**
     * Checks if the collection includes a value with the key `key`.
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     */
    has(key) {
      const idx = asItemIndex(key);
      return typeof idx === "number" && idx < this.items.length;
    }
    /**
     * Sets a value in this collection. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     *
     * If `key` does not contain a representation of an integer, this will throw.
     * It may be wrapped in a `Scalar`.
     */
    set(key, value) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        throw new Error(`Expected a valid index, not ${key}.`);
      const prev = this.items[idx];
      if (isScalar(prev) && isScalarValue(value))
        prev.value = value;
      else
        this.items[idx] = value;
    }
    toJSON(_, ctx) {
      const seq2 = [];
      if (ctx?.onCreate)
        ctx.onCreate(seq2);
      let i = 0;
      for (const item of this.items)
        seq2.push(toJS(item, String(i++), ctx));
      return seq2;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      return stringifyCollection(this, ctx, {
        blockItemPrefix: "- ",
        flowChars: { start: "[", end: "]" },
        itemIndent: (ctx.indent || "") + "  ",
        onChompKeep,
        onComment
      });
    }
  };
  function asItemIndex(key) {
    let idx = isScalar(key) ? key.value : key;
    if (idx && typeof idx === "string")
      idx = Number(idx);
    return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
  }

  // node_modules/yaml/browser/dist/schema/common/seq.js
  function createSeq(schema4, obj, ctx) {
    const { replacer } = ctx;
    const seq2 = new YAMLSeq(schema4);
    if (obj && Symbol.iterator in Object(obj)) {
      let i = 0;
      for (let it of obj) {
        if (typeof replacer === "function") {
          const key = obj instanceof Set ? it : String(i++);
          it = replacer.call(obj, key, it);
        }
        seq2.items.push(createNode(it, void 0, ctx));
      }
    }
    return seq2;
  }
  var seq = {
    collection: "seq",
    createNode: createSeq,
    default: true,
    nodeClass: YAMLSeq,
    tag: "tag:yaml.org,2002:seq",
    resolve(seq2, onError) {
      if (!isSeq(seq2))
        onError("Expected a sequence for this tag");
      return seq2;
    }
  };

  // node_modules/yaml/browser/dist/schema/common/string.js
  var string = {
    identify: (value) => typeof value === "string",
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: (str) => str,
    stringify(item, ctx, onComment, onChompKeep) {
      ctx = Object.assign({ actualString: true }, ctx);
      return stringifyString(item, ctx, onComment, onChompKeep);
    }
  };

  // node_modules/yaml/browser/dist/schema/common/null.js
  var nullTag = {
    identify: (value) => value == null,
    createNode: () => new Scalar(null),
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => new Scalar(null),
    stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
  };

  // node_modules/yaml/browser/dist/schema/core/bool.js
  var boolTag = {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: (str) => new Scalar(str[0] === "t" || str[0] === "T"),
    stringify({ source, value }, ctx) {
      if (source && boolTag.test.test(source)) {
        const sv = source[0] === "t" || source[0] === "T";
        if (value === sv)
          return source;
      }
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
  };

  // node_modules/yaml/browser/dist/stringify/stringifyNumber.js
  function stringifyNumber({ format, minFractionDigits, tag, value }) {
    if (typeof value === "bigint")
      return String(value);
    const num = typeof value === "number" ? value : Number(value);
    if (!isFinite(num))
      return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
    let n = JSON.stringify(value);
    if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^\d/.test(n)) {
      let i = n.indexOf(".");
      if (i < 0) {
        i = n.length;
        n += ".";
      }
      let d = minFractionDigits - (n.length - i - 1);
      while (d-- > 0)
        n += "0";
    }
    return n;
  }

  // node_modules/yaml/browser/dist/schema/core/float.js
  var floatNaN = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN))$/,
    resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber
  };
  var floatExp = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str),
    stringify(node) {
      const num = Number(node.value);
      return isFinite(num) ? num.toExponential() : stringifyNumber(node);
    }
  };
  var float = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
    resolve(str) {
      const node = new Scalar(parseFloat(str));
      const dot = str.indexOf(".");
      if (dot !== -1 && str[str.length - 1] === "0")
        node.minFractionDigits = str.length - dot - 1;
      return node;
    },
    stringify: stringifyNumber
  };

  // node_modules/yaml/browser/dist/schema/core/int.js
  var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
  var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
  function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value) && value >= 0)
      return prefix + value.toString(radix);
    return stringifyNumber(node);
  }
  var intOct = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^0o[0-7]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
    stringify: (node) => intStringify(node, 8, "0o")
  };
  var int = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber
  };
  var intHex = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^0x[0-9a-fA-F]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: (node) => intStringify(node, 16, "0x")
  };

  // node_modules/yaml/browser/dist/schema/core/schema.js
  var schema = [
    map,
    seq,
    string,
    nullTag,
    boolTag,
    intOct,
    int,
    intHex,
    floatNaN,
    floatExp,
    float
  ];

  // node_modules/yaml/browser/dist/schema/json/schema.js
  function intIdentify2(value) {
    return typeof value === "bigint" || Number.isInteger(value);
  }
  var stringifyJSON = ({ value }) => JSON.stringify(value);
  var jsonScalars = [
    {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify: stringifyJSON
    },
    {
      identify: (value) => value == null,
      createNode: () => new Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^null$/,
      resolve: () => null,
      stringify: stringifyJSON
    },
    {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^true|false$/,
      resolve: (str) => str === "true",
      stringify: stringifyJSON
    },
    {
      identify: intIdentify2,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^-?(?:0|[1-9][0-9]*)$/,
      resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
      stringify: ({ value }) => intIdentify2(value) ? value.toString() : JSON.stringify(value)
    },
    {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
      resolve: (str) => parseFloat(str),
      stringify: stringifyJSON
    }
  ];
  var jsonError = {
    default: true,
    tag: "",
    test: /^/,
    resolve(str, onError) {
      onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
      return str;
    }
  };
  var schema2 = [map, seq].concat(jsonScalars, jsonError);

  // node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js
  var binary = {
    identify: (value) => value instanceof Uint8Array,
    default: false,
    tag: "tag:yaml.org,2002:binary",
    /**
     * Returns a Buffer in node and an Uint8Array in browsers
     *
     * To use the resulting buffer as an image, you'll want to do something like:
     *
     *   const blob = new Blob([buffer], { type: 'image/jpeg' })
     *   document.querySelector('#photo').src = URL.createObjectURL(blob)
     */
    resolve(src, onError) {
      if (typeof Buffer === "function") {
        return Buffer.from(src, "base64");
      } else if (typeof atob === "function") {
        const str = atob(src.replace(/[\n\r]/g, ""));
        const buffer = new Uint8Array(str.length);
        for (let i = 0; i < str.length; ++i)
          buffer[i] = str.charCodeAt(i);
        return buffer;
      } else {
        onError("This environment does not support reading binary tags; either Buffer or atob is required");
        return src;
      }
    },
    stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
      const buf = value;
      let str;
      if (typeof Buffer === "function") {
        str = buf instanceof Buffer ? buf.toString("base64") : Buffer.from(buf.buffer).toString("base64");
      } else if (typeof btoa === "function") {
        let s = "";
        for (let i = 0; i < buf.length; ++i)
          s += String.fromCharCode(buf[i]);
        str = btoa(s);
      } else {
        throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
      }
      if (!type)
        type = Scalar.BLOCK_LITERAL;
      if (type !== Scalar.QUOTE_DOUBLE) {
        const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
        const n = Math.ceil(str.length / lineWidth);
        const lines = new Array(n);
        for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
          lines[i] = str.substr(o, lineWidth);
        }
        str = lines.join(type === Scalar.BLOCK_LITERAL ? "\n" : " ");
      }
      return stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
    }
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
  function resolvePairs(seq2, onError) {
    if (isSeq(seq2)) {
      for (let i = 0; i < seq2.items.length; ++i) {
        let item = seq2.items[i];
        if (isPair(item))
          continue;
        else if (isMap(item)) {
          if (item.items.length > 1)
            onError("Each pair must have its own sequence indicator");
          const pair = item.items[0] || new Pair(new Scalar(null));
          if (item.commentBefore)
            pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
          if (item.comment) {
            const cn = pair.value ?? pair.key;
            cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
          }
          item = pair;
        }
        seq2.items[i] = isPair(item) ? item : new Pair(item);
      }
    } else
      onError("Expected a sequence for this tag");
    return seq2;
  }
  function createPairs(schema4, iterable, ctx) {
    const { replacer } = ctx;
    const pairs2 = new YAMLSeq(schema4);
    pairs2.tag = "tag:yaml.org,2002:pairs";
    let i = 0;
    if (iterable && Symbol.iterator in Object(iterable))
      for (let it of iterable) {
        if (typeof replacer === "function")
          it = replacer.call(iterable, String(i++), it);
        let key, value;
        if (Array.isArray(it)) {
          if (it.length === 2) {
            key = it[0];
            value = it[1];
          } else
            throw new TypeError(`Expected [key, value] tuple: ${it}`);
        } else if (it && it instanceof Object) {
          const keys = Object.keys(it);
          if (keys.length === 1) {
            key = keys[0];
            value = it[key];
          } else
            throw new TypeError(`Expected { key: value } tuple: ${it}`);
        } else {
          key = it;
        }
        pairs2.items.push(createPair(key, value, ctx));
      }
    return pairs2;
  }
  var pairs = {
    collection: "seq",
    default: false,
    tag: "tag:yaml.org,2002:pairs",
    resolve: resolvePairs,
    createNode: createPairs
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js
  var YAMLOMap = class extends YAMLSeq {
    constructor() {
      super();
      this.add = YAMLMap.prototype.add.bind(this);
      this.delete = YAMLMap.prototype.delete.bind(this);
      this.get = YAMLMap.prototype.get.bind(this);
      this.has = YAMLMap.prototype.has.bind(this);
      this.set = YAMLMap.prototype.set.bind(this);
      this.tag = YAMLOMap.tag;
    }
    /**
     * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
     * but TypeScript won't allow widening the signature of a child method.
     */
    toJSON(_, ctx) {
      if (!ctx)
        return super.toJSON(_);
      const map2 = /* @__PURE__ */ new Map();
      if (ctx?.onCreate)
        ctx.onCreate(map2);
      for (const pair of this.items) {
        let key, value;
        if (isPair(pair)) {
          key = toJS(pair.key, "", ctx);
          value = toJS(pair.value, key, ctx);
        } else {
          key = toJS(pair, "", ctx);
        }
        if (map2.has(key))
          throw new Error("Ordered maps must not include duplicate keys");
        map2.set(key, value);
      }
      return map2;
    }
  };
  YAMLOMap.tag = "tag:yaml.org,2002:omap";
  var omap = {
    collection: "seq",
    identify: (value) => value instanceof Map,
    nodeClass: YAMLOMap,
    default: false,
    tag: "tag:yaml.org,2002:omap",
    resolve(seq2, onError) {
      const pairs2 = resolvePairs(seq2, onError);
      const seenKeys = [];
      for (const { key } of pairs2.items) {
        if (isScalar(key)) {
          if (seenKeys.includes(key.value)) {
            onError(`Ordered maps must not include duplicate keys: ${key.value}`);
          } else {
            seenKeys.push(key.value);
          }
        }
      }
      return Object.assign(new YAMLOMap(), pairs2);
    },
    createNode(schema4, iterable, ctx) {
      const pairs2 = createPairs(schema4, iterable, ctx);
      const omap2 = new YAMLOMap();
      omap2.items = pairs2.items;
      return omap2;
    }
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
  function boolStringify({ value, source }, ctx) {
    const boolObj = value ? trueTag : falseTag;
    if (source && boolObj.test.test(source))
      return source;
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
  var trueTag = {
    identify: (value) => value === true,
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => new Scalar(true),
    stringify: boolStringify
  };
  var falseTag = {
    identify: (value) => value === false,
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
    resolve: () => new Scalar(false),
    stringify: boolStringify
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/float.js
  var floatNaN2 = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber
  };
  var floatExp2 = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str.replace(/_/g, "")),
    stringify(node) {
      const num = Number(node.value);
      return isFinite(num) ? num.toExponential() : stringifyNumber(node);
    }
  };
  var float2 = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
    resolve(str) {
      const node = new Scalar(parseFloat(str.replace(/_/g, "")));
      const dot = str.indexOf(".");
      if (dot !== -1) {
        const f = str.substring(dot + 1).replace(/_/g, "");
        if (f[f.length - 1] === "0")
          node.minFractionDigits = f.length;
      }
      return node;
    },
    stringify: stringifyNumber
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/int.js
  var intIdentify3 = (value) => typeof value === "bigint" || Number.isInteger(value);
  function intResolve2(str, offset, radix, { intAsBigInt }) {
    const sign = str[0];
    if (sign === "-" || sign === "+")
      offset += 1;
    str = str.substring(offset).replace(/_/g, "");
    if (intAsBigInt) {
      switch (radix) {
        case 2:
          str = `0b${str}`;
          break;
        case 8:
          str = `0o${str}`;
          break;
        case 16:
          str = `0x${str}`;
          break;
      }
      const n2 = BigInt(str);
      return sign === "-" ? BigInt(-1) * n2 : n2;
    }
    const n = parseInt(str, radix);
    return sign === "-" ? -1 * n : n;
  }
  function intStringify2(node, radix, prefix) {
    const { value } = node;
    if (intIdentify3(value)) {
      const str = value.toString(radix);
      return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
    }
    return stringifyNumber(node);
  }
  var intBin = {
    identify: intIdentify3,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "BIN",
    test: /^[-+]?0b[0-1_]+$/,
    resolve: (str, _onError, opt) => intResolve2(str, 2, 2, opt),
    stringify: (node) => intStringify2(node, 2, "0b")
  };
  var intOct2 = {
    identify: intIdentify3,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^[-+]?0[0-7_]+$/,
    resolve: (str, _onError, opt) => intResolve2(str, 1, 8, opt),
    stringify: (node) => intStringify2(node, 8, "0")
  };
  var int2 = {
    identify: intIdentify3,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9][0-9_]*$/,
    resolve: (str, _onError, opt) => intResolve2(str, 0, 10, opt),
    stringify: stringifyNumber
  };
  var intHex2 = {
    identify: intIdentify3,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^[-+]?0x[0-9a-fA-F_]+$/,
    resolve: (str, _onError, opt) => intResolve2(str, 2, 16, opt),
    stringify: (node) => intStringify2(node, 16, "0x")
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/set.js
  var YAMLSet = class extends YAMLMap {
    constructor(schema4) {
      super(schema4);
      this.tag = YAMLSet.tag;
    }
    add(key) {
      let pair;
      if (isPair(key))
        pair = key;
      else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
        pair = new Pair(key.key, null);
      else
        pair = new Pair(key, null);
      const prev = findPair(this.items, pair.key);
      if (!prev)
        this.items.push(pair);
    }
    /**
     * If `keepPair` is `true`, returns the Pair matching `key`.
     * Otherwise, returns the value of that Pair's key.
     */
    get(key, keepPair) {
      const pair = findPair(this.items, key);
      return !keepPair && isPair(pair) ? isScalar(pair.key) ? pair.key.value : pair.key : pair;
    }
    set(key, value) {
      if (typeof value !== "boolean")
        throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
      const prev = findPair(this.items, key);
      if (prev && !value) {
        this.items.splice(this.items.indexOf(prev), 1);
      } else if (!prev && value) {
        this.items.push(new Pair(key));
      }
    }
    toJSON(_, ctx) {
      return super.toJSON(_, ctx, Set);
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      if (this.hasAllNullValues(true))
        return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
      else
        throw new Error("Set items must all have null values");
    }
  };
  YAMLSet.tag = "tag:yaml.org,2002:set";
  var set = {
    collection: "map",
    identify: (value) => value instanceof Set,
    nodeClass: YAMLSet,
    default: false,
    tag: "tag:yaml.org,2002:set",
    resolve(map2, onError) {
      if (isMap(map2)) {
        if (map2.hasAllNullValues(true))
          return Object.assign(new YAMLSet(), map2);
        else
          onError("Set items must all have null values");
      } else
        onError("Expected a mapping for this tag");
      return map2;
    },
    createNode(schema4, iterable, ctx) {
      const { replacer } = ctx;
      const set2 = new YAMLSet(schema4);
      if (iterable && Symbol.iterator in Object(iterable))
        for (let value of iterable) {
          if (typeof replacer === "function")
            value = replacer.call(iterable, value, value);
          set2.items.push(createPair(value, null, ctx));
        }
      return set2;
    }
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
  function parseSexagesimal(str, asBigInt) {
    const sign = str[0];
    const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
    const num = (n) => asBigInt ? BigInt(n) : Number(n);
    const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
    return sign === "-" ? num(-1) * res : res;
  }
  function stringifySexagesimal(node) {
    let { value } = node;
    let num = (n) => n;
    if (typeof value === "bigint")
      num = (n) => BigInt(n);
    else if (isNaN(value) || !isFinite(value))
      return stringifyNumber(node);
    let sign = "";
    if (value < 0) {
      sign = "-";
      value *= num(-1);
    }
    const _60 = num(60);
    const parts = [value % _60];
    if (value < 60) {
      parts.unshift(0);
    } else {
      value = (value - parts[0]) / _60;
      parts.unshift(value % _60);
      if (value >= 60) {
        value = (value - parts[0]) / _60;
        parts.unshift(value);
      }
    }
    return sign + parts.map((n) => n < 10 ? "0" + String(n) : String(n)).join(":").replace(/000000\d*$/, "");
  }
  var intTime = {
    identify: (value) => typeof value === "bigint" || Number.isInteger(value),
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "TIME",
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
    resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
    stringify: stringifySexagesimal
  };
  var floatTime = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "TIME",
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
    resolve: (str) => parseSexagesimal(str, false),
    stringify: stringifySexagesimal
  };
  var timestamp = {
    identify: (value) => value instanceof Date,
    default: true,
    tag: "tag:yaml.org,2002:timestamp",
    // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
    // may be omitted altogether, resulting in a date format. In such a case, the time part is
    // assumed to be 00:00:00Z (start of day, UTC).
    test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
    resolve(str) {
      const match = str.match(timestamp.test);
      if (!match)
        throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
      const [, year, month, day, hour, minute, second] = match.map(Number);
      const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
      let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
      const tz = match[8];
      if (tz && tz !== "Z") {
        let d = parseSexagesimal(tz, false);
        if (Math.abs(d) < 30)
          d *= 60;
        date -= 6e4 * d;
      }
      return new Date(date);
    },
    stringify: ({ value }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, "")
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/schema.js
  var schema3 = [
    map,
    seq,
    string,
    nullTag,
    trueTag,
    falseTag,
    intBin,
    intOct2,
    int2,
    intHex2,
    floatNaN2,
    floatExp2,
    float2,
    binary,
    omap,
    pairs,
    set,
    intTime,
    floatTime,
    timestamp
  ];

  // node_modules/yaml/browser/dist/schema/tags.js
  var schemas = /* @__PURE__ */ new Map([
    ["core", schema],
    ["failsafe", [map, seq, string]],
    ["json", schema2],
    ["yaml11", schema3],
    ["yaml-1.1", schema3]
  ]);
  var tagsByName = {
    binary,
    bool: boolTag,
    float,
    floatExp,
    floatNaN,
    floatTime,
    int,
    intHex,
    intOct,
    intTime,
    map,
    null: nullTag,
    omap,
    pairs,
    seq,
    set,
    timestamp
  };
  var coreKnownTags = {
    "tag:yaml.org,2002:binary": binary,
    "tag:yaml.org,2002:omap": omap,
    "tag:yaml.org,2002:pairs": pairs,
    "tag:yaml.org,2002:set": set,
    "tag:yaml.org,2002:timestamp": timestamp
  };
  function getTags(customTags, schemaName) {
    let tags = schemas.get(schemaName);
    if (!tags) {
      if (Array.isArray(customTags))
        tags = [];
      else {
        const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
        throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
      }
    }
    if (Array.isArray(customTags)) {
      for (const tag of customTags)
        tags = tags.concat(tag);
    } else if (typeof customTags === "function") {
      tags = customTags(tags.slice());
    }
    return tags.map((tag) => {
      if (typeof tag !== "string")
        return tag;
      const tagObj = tagsByName[tag];
      if (tagObj)
        return tagObj;
      const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
    });
  }

  // node_modules/yaml/browser/dist/schema/Schema.js
  var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  var Schema = class {
    constructor({ compat, customTags, merge, resolveKnownTags, schema: schema4, sortMapEntries, toStringDefaults }) {
      this.compat = Array.isArray(compat) ? getTags(compat, "compat") : compat ? getTags(null, compat) : null;
      this.merge = !!merge;
      this.name = typeof schema4 === "string" && schema4 || "core";
      this.knownTags = resolveKnownTags ? coreKnownTags : {};
      this.tags = getTags(customTags, this.name);
      this.toStringOptions = toStringDefaults ?? null;
      Object.defineProperty(this, MAP, { value: map });
      Object.defineProperty(this, SCALAR, { value: string });
      Object.defineProperty(this, SEQ, { value: seq });
      this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
    }
    clone() {
      const copy = Object.create(Schema.prototype, Object.getOwnPropertyDescriptors(this));
      copy.tags = this.tags.slice();
      return copy;
    }
  };

  // node_modules/yaml/browser/dist/stringify/stringifyDocument.js
  function stringifyDocument(doc, options) {
    const lines = [];
    let hasDirectives = options.directives === true;
    if (options.directives !== false && doc.directives) {
      const dir = doc.directives.toString(doc);
      if (dir) {
        lines.push(dir);
        hasDirectives = true;
      } else if (doc.directives.docStart)
        hasDirectives = true;
    }
    if (hasDirectives)
      lines.push("---");
    const ctx = createStringifyContext(doc, options);
    const { commentString } = ctx.options;
    if (doc.commentBefore) {
      if (lines.length !== 1)
        lines.unshift("");
      const cs = commentString(doc.commentBefore);
      lines.unshift(indentComment(cs, ""));
    }
    let chompKeep = false;
    let contentComment = null;
    if (doc.contents) {
      if (isNode(doc.contents)) {
        if (doc.contents.spaceBefore && hasDirectives)
          lines.push("");
        if (doc.contents.commentBefore) {
          const cs = commentString(doc.contents.commentBefore);
          lines.push(indentComment(cs, ""));
        }
        ctx.forceBlockIndent = !!doc.comment;
        contentComment = doc.contents.comment;
      }
      const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
      let body = stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
      if (contentComment)
        body += lineComment(body, "", commentString(contentComment));
      if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
        lines[lines.length - 1] = `--- ${body}`;
      } else
        lines.push(body);
    } else {
      lines.push(stringify(doc.contents, ctx));
    }
    if (doc.directives?.docEnd) {
      if (doc.comment) {
        const cs = commentString(doc.comment);
        if (cs.includes("\n")) {
          lines.push("...");
          lines.push(indentComment(cs, ""));
        } else {
          lines.push(`... ${cs}`);
        }
      } else {
        lines.push("...");
      }
    } else {
      let dc = doc.comment;
      if (dc && chompKeep)
        dc = dc.replace(/^\n+/, "");
      if (dc) {
        if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
          lines.push("");
        lines.push(indentComment(commentString(dc), ""));
      }
    }
    return lines.join("\n") + "\n";
  }

  // node_modules/yaml/browser/dist/doc/applyReviver.js
  function applyReviver(reviver, obj, key, val) {
    if (val && typeof val === "object") {
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; ++i) {
          const v0 = val[i];
          const v1 = applyReviver(reviver, val, String(i), v0);
          if (v1 === void 0)
            delete val[i];
          else if (v1 !== v0)
            val[i] = v1;
        }
      } else if (val instanceof Map) {
        for (const k of Array.from(val.keys())) {
          const v0 = val.get(k);
          const v1 = applyReviver(reviver, val, k, v0);
          if (v1 === void 0)
            val.delete(k);
          else if (v1 !== v0)
            val.set(k, v1);
        }
      } else if (val instanceof Set) {
        for (const v0 of Array.from(val)) {
          const v1 = applyReviver(reviver, val, v0, v0);
          if (v1 === void 0)
            val.delete(v0);
          else if (v1 !== v0) {
            val.delete(v0);
            val.add(v1);
          }
        }
      } else {
        for (const [k, v0] of Object.entries(val)) {
          const v1 = applyReviver(reviver, val, k, v0);
          if (v1 === void 0)
            delete val[k];
          else if (v1 !== v0)
            val[k] = v1;
        }
      }
    }
    return reviver.call(obj, key, val);
  }

  // node_modules/yaml/browser/dist/doc/Document.js
  var Document = class {
    constructor(value, replacer, options) {
      this.commentBefore = null;
      this.comment = null;
      this.errors = [];
      this.warnings = [];
      Object.defineProperty(this, NODE_TYPE, { value: DOC });
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
        replacer = void 0;
      }
      const opt = Object.assign({
        intAsBigInt: false,
        keepSourceTokens: false,
        logLevel: "warn",
        prettyErrors: true,
        strict: true,
        uniqueKeys: true,
        version: "1.2"
      }, options);
      this.options = opt;
      let { version } = opt;
      if (options?._directives) {
        this.directives = options._directives.atDocument();
        if (this.directives.yaml.explicit)
          version = this.directives.yaml.version;
      } else
        this.directives = new Directives({ version });
      this.setSchema(version, options);
      if (value === void 0)
        this.contents = null;
      else {
        this.contents = this.createNode(value, _replacer, options);
      }
    }
    /**
     * Create a deep copy of this Document and its contents.
     *
     * Custom Node values that inherit from `Object` still refer to their original instances.
     */
    clone() {
      const copy = Object.create(Document.prototype, {
        [NODE_TYPE]: { value: DOC }
      });
      copy.commentBefore = this.commentBefore;
      copy.comment = this.comment;
      copy.errors = this.errors.slice();
      copy.warnings = this.warnings.slice();
      copy.options = Object.assign({}, this.options);
      if (this.directives)
        copy.directives = this.directives.clone();
      copy.schema = this.schema.clone();
      copy.contents = isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    /** Adds a value to the document. */
    add(value) {
      if (assertCollection(this.contents))
        this.contents.add(value);
    }
    /** Adds a value to the document. */
    addIn(path, value) {
      if (assertCollection(this.contents))
        this.contents.addIn(path, value);
    }
    /**
     * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
     *
     * If `node` already has an anchor, `name` is ignored.
     * Otherwise, the `node.anchor` value will be set to `name`,
     * or if an anchor with that name is already present in the document,
     * `name` will be used as a prefix for a new unique anchor.
     * If `name` is undefined, the generated anchor will use 'a' as a prefix.
     */
    createAlias(node, name) {
      if (!node.anchor) {
        const prev = anchorNames(this);
        node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        !name || prev.has(name) ? findNewAnchor(name || "a", prev) : name;
      }
      return new Alias(node.anchor);
    }
    createNode(value, replacer, options) {
      let _replacer = void 0;
      if (typeof replacer === "function") {
        value = replacer.call({ "": value }, "", value);
        _replacer = replacer;
      } else if (Array.isArray(replacer)) {
        const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
        const asStr = replacer.filter(keyToStr).map(String);
        if (asStr.length > 0)
          replacer = replacer.concat(asStr);
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
        replacer = void 0;
      }
      const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
      const { onAnchor, setAnchors, sourceObjects } = createNodeAnchors(
        this,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        anchorPrefix || "a"
      );
      const ctx = {
        aliasDuplicateObjects: aliasDuplicateObjects ?? true,
        keepUndefined: keepUndefined ?? false,
        onAnchor,
        onTagObj,
        replacer: _replacer,
        schema: this.schema,
        sourceObjects
      };
      const node = createNode(value, tag, ctx);
      if (flow && isCollection(node))
        node.flow = true;
      setAnchors();
      return node;
    }
    /**
     * Convert a key and a value into a `Pair` using the current schema,
     * recursively wrapping all values as `Scalar` or `Collection` nodes.
     */
    createPair(key, value, options = {}) {
      const k = this.createNode(key, null, options);
      const v = this.createNode(value, null, options);
      return new Pair(k, v);
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    delete(key) {
      return assertCollection(this.contents) ? this.contents.delete(key) : false;
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    deleteIn(path) {
      if (isEmptyPath(path)) {
        if (this.contents == null)
          return false;
        this.contents = null;
        return true;
      }
      return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    get(key, keepScalar) {
      return isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
    }
    /**
     * Returns item at `path`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn(path, keepScalar) {
      if (isEmptyPath(path))
        return !keepScalar && isScalar(this.contents) ? this.contents.value : this.contents;
      return isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
    }
    /**
     * Checks if the document includes a value with the key `key`.
     */
    has(key) {
      return isCollection(this.contents) ? this.contents.has(key) : false;
    }
    /**
     * Checks if the document includes a value at `path`.
     */
    hasIn(path) {
      if (isEmptyPath(path))
        return this.contents !== void 0;
      return isCollection(this.contents) ? this.contents.hasIn(path) : false;
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    set(key, value) {
      if (this.contents == null) {
        this.contents = collectionFromPath(this.schema, [key], value);
      } else if (assertCollection(this.contents)) {
        this.contents.set(key, value);
      }
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn(path, value) {
      if (isEmptyPath(path))
        this.contents = value;
      else if (this.contents == null) {
        this.contents = collectionFromPath(this.schema, Array.from(path), value);
      } else if (assertCollection(this.contents)) {
        this.contents.setIn(path, value);
      }
    }
    /**
     * Change the YAML version and schema used by the document.
     * A `null` version disables support for directives, explicit tags, anchors, and aliases.
     * It also requires the `schema` option to be given as a `Schema` instance value.
     *
     * Overrides all previously set schema options.
     */
    setSchema(version, options = {}) {
      if (typeof version === "number")
        version = String(version);
      let opt;
      switch (version) {
        case "1.1":
          if (this.directives)
            this.directives.yaml.version = "1.1";
          else
            this.directives = new Directives({ version: "1.1" });
          opt = { merge: true, resolveKnownTags: false, schema: "yaml-1.1" };
          break;
        case "1.2":
        case "next":
          if (this.directives)
            this.directives.yaml.version = version;
          else
            this.directives = new Directives({ version });
          opt = { merge: false, resolveKnownTags: true, schema: "core" };
          break;
        case null:
          if (this.directives)
            delete this.directives;
          opt = null;
          break;
        default: {
          const sv = JSON.stringify(version);
          throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
        }
      }
      if (options.schema instanceof Object)
        this.schema = options.schema;
      else if (opt)
        this.schema = new Schema(Object.assign(opt, options));
      else
        throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
    }
    // json & jsonArg are only used from toJSON()
    toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
      const ctx = {
        anchors: /* @__PURE__ */ new Map(),
        doc: this,
        keep: !json,
        mapAsMap: mapAsMap === true,
        mapKeyWarned: false,
        maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100,
        stringify
      };
      const res = toJS(this.contents, jsonArg ?? "", ctx);
      if (typeof onAnchor === "function")
        for (const { count, res: res2 } of ctx.anchors.values())
          onAnchor(res2, count);
      return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
    }
    /**
     * A JSON representation of the document `contents`.
     *
     * @param jsonArg Used by `JSON.stringify` to indicate the array index or
     *   property name.
     */
    toJSON(jsonArg, onAnchor) {
      return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
    }
    /** A YAML representation of the document. */
    toString(options = {}) {
      if (this.errors.length > 0)
        throw new Error("Document with errors cannot be stringified");
      if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
        const s = JSON.stringify(options.indent);
        throw new Error(`"indent" option must be a positive integer, not ${s}`);
      }
      return stringifyDocument(this, options);
    }
  };
  function assertCollection(contents) {
    if (isCollection(contents))
      return true;
    throw new Error("Expected a YAML collection as document contents");
  }

  // node_modules/yaml/browser/dist/errors.js
  var YAMLError = class extends Error {
    constructor(name, pos, code, message) {
      super();
      this.name = name;
      this.code = code;
      this.message = message;
      this.pos = pos;
    }
  };
  var YAMLParseError = class extends YAMLError {
    constructor(pos, code, message) {
      super("YAMLParseError", pos, code, message);
    }
  };
  var YAMLWarning = class extends YAMLError {
    constructor(pos, code, message) {
      super("YAMLWarning", pos, code, message);
    }
  };
  var prettifyError = (src, lc) => (error) => {
    if (error.pos[0] === -1)
      return;
    error.linePos = error.pos.map((pos) => lc.linePos(pos));
    const { line, col } = error.linePos[0];
    error.message += ` at line ${line}, column ${col}`;
    let ci = col - 1;
    let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
    if (ci >= 60 && lineStr.length > 80) {
      const trimStart = Math.min(ci - 39, lineStr.length - 79);
      lineStr = "\u2026" + lineStr.substring(trimStart);
      ci -= trimStart - 1;
    }
    if (lineStr.length > 80)
      lineStr = lineStr.substring(0, 79) + "\u2026";
    if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
      let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
      if (prev.length > 80)
        prev = prev.substring(0, 79) + "\u2026\n";
      lineStr = prev + lineStr;
    }
    if (/[^ ]/.test(lineStr)) {
      let count = 1;
      const end = error.linePos[1];
      if (end && end.line === line && end.col > col) {
        count = Math.min(end.col - col, 80 - ci);
      }
      const pointer = " ".repeat(ci) + "^".repeat(count);
      error.message += `:

${lineStr}
${pointer}
`;
    }
  };

  // node_modules/yaml/browser/dist/compose/resolve-props.js
  function resolveProps(tokens, { flow, indicator, next, offset, onError, startOnNewline }) {
    let spaceBefore = false;
    let atNewline = startOnNewline;
    let hasSpace = startOnNewline;
    let comment = "";
    let commentSep = "";
    let hasNewline = false;
    let hasNewlineAfterProp = false;
    let reqSpace = false;
    let anchor = null;
    let tag = null;
    let comma = null;
    let found = null;
    let start = null;
    for (const token of tokens) {
      if (reqSpace) {
        if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
          onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
        reqSpace = false;
      }
      switch (token.type) {
        case "space":
          if (!flow && atNewline && indicator !== "doc-start" && token.source[0] === "	")
            onError(token, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          hasSpace = true;
          break;
        case "comment": {
          if (!hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const cb = token.source.substring(1) || " ";
          if (!comment)
            comment = cb;
          else
            comment += commentSep + cb;
          commentSep = "";
          atNewline = false;
          break;
        }
        case "newline":
          if (atNewline) {
            if (comment)
              comment += token.source;
            else
              spaceBefore = true;
          } else
            commentSep += token.source;
          atNewline = true;
          hasNewline = true;
          if (anchor || tag)
            hasNewlineAfterProp = true;
          hasSpace = true;
          break;
        case "anchor":
          if (anchor)
            onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
          if (token.source.endsWith(":"))
            onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
          anchor = token;
          if (start === null)
            start = token.offset;
          atNewline = false;
          hasSpace = false;
          reqSpace = true;
          break;
        case "tag": {
          if (tag)
            onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
          tag = token;
          if (start === null)
            start = token.offset;
          atNewline = false;
          hasSpace = false;
          reqSpace = true;
          break;
        }
        case indicator:
          if (anchor || tag)
            onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
          if (found)
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
          found = token;
          atNewline = false;
          hasSpace = false;
          break;
        case "comma":
          if (flow) {
            if (comma)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
            comma = token;
            atNewline = false;
            hasSpace = false;
            break;
          }
        default:
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
          atNewline = false;
          hasSpace = false;
      }
    }
    const last = tokens[tokens.length - 1];
    const end = last ? last.offset + last.source.length : offset;
    if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== ""))
      onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
    return {
      comma,
      found,
      spaceBefore,
      comment,
      hasNewline,
      hasNewlineAfterProp,
      anchor,
      tag,
      end,
      start: start ?? end
    };
  }

  // node_modules/yaml/browser/dist/compose/util-contains-newline.js
  function containsNewline(key) {
    if (!key)
      return null;
    switch (key.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (key.source.includes("\n"))
          return true;
        if (key.end) {
          for (const st of key.end)
            if (st.type === "newline")
              return true;
        }
        return false;
      case "flow-collection":
        for (const it of key.items) {
          for (const st of it.start)
            if (st.type === "newline")
              return true;
          if (it.sep) {
            for (const st of it.sep)
              if (st.type === "newline")
                return true;
          }
          if (containsNewline(it.key) || containsNewline(it.value))
            return true;
        }
        return false;
      default:
        return true;
    }
  }

  // node_modules/yaml/browser/dist/compose/util-flow-indent-check.js
  function flowIndentCheck(indent, fc, onError) {
    if (fc?.type === "flow-collection") {
      const end = fc.end[0];
      if (end.indent === indent && (end.source === "]" || end.source === "}") && containsNewline(fc)) {
        const msg = "Flow end indicator should be more indented than parent";
        onError(end, "BAD_INDENT", msg, true);
      }
    }
  }

  // node_modules/yaml/browser/dist/compose/util-map-includes.js
  function mapIncludes(ctx, items, search) {
    const { uniqueKeys } = ctx.options;
    if (uniqueKeys === false)
      return false;
    const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || isScalar(a) && isScalar(b) && a.value === b.value && !(a.value === "<<" && ctx.schema.merge);
    return items.some((pair) => isEqual(pair.key, search));
  }

  // node_modules/yaml/browser/dist/compose/resolve-block-map.js
  var startColMsg = "All mapping items must start at the same column";
  function resolveBlockMap({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bm, onError) {
    const map2 = new YAMLMap(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = false;
    let offset = bm.offset;
    let commentEnd = null;
    for (const collItem of bm.items) {
      const { start, key, sep, value } = collItem;
      const keyProps = resolveProps(start, {
        indicator: "explicit-key-ind",
        next: key ?? sep?.[0],
        offset,
        onError,
        startOnNewline: true
      });
      const implicitKey = !keyProps.found;
      if (implicitKey) {
        if (key) {
          if (key.type === "block-seq")
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
          else if ("indent" in key && key.indent !== bm.indent)
            onError(offset, "BAD_INDENT", startColMsg);
        }
        if (!keyProps.anchor && !keyProps.tag && !sep) {
          commentEnd = keyProps.end;
          if (keyProps.comment) {
            if (map2.comment)
              map2.comment += "\n" + keyProps.comment;
            else
              map2.comment = keyProps.comment;
          }
          continue;
        }
        if (keyProps.hasNewlineAfterProp || containsNewline(key)) {
          onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
        }
      } else if (keyProps.found?.indent !== bm.indent) {
        onError(offset, "BAD_INDENT", startColMsg);
      }
      const keyStart = keyProps.end;
      const keyNode = key ? composeNode2(ctx, key, keyProps, onError) : composeEmptyNode2(ctx, keyStart, start, null, keyProps, onError);
      if (ctx.schema.compat)
        flowIndentCheck(bm.indent, key, onError);
      if (mapIncludes(ctx, map2.items, keyNode))
        onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
      const valueProps = resolveProps(sep ?? [], {
        indicator: "map-value-ind",
        next: value,
        offset: keyNode.range[2],
        onError,
        startOnNewline: !key || key.type === "block-scalar"
      });
      offset = valueProps.end;
      if (valueProps.found) {
        if (implicitKey) {
          if (value?.type === "block-map" && !valueProps.hasNewline)
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
          if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
            onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
        }
        const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : composeEmptyNode2(ctx, offset, sep, null, valueProps, onError);
        if (ctx.schema.compat)
          flowIndentCheck(bm.indent, value, onError);
        offset = valueNode.range[2];
        const pair = new Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map2.items.push(pair);
      } else {
        if (implicitKey)
          onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
        if (valueProps.comment) {
          if (keyNode.comment)
            keyNode.comment += "\n" + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        }
        const pair = new Pair(keyNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map2.items.push(pair);
      }
    }
    if (commentEnd && commentEnd < offset)
      onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
    map2.range = [bm.offset, offset, commentEnd ?? offset];
    return map2;
  }

  // node_modules/yaml/browser/dist/compose/resolve-block-seq.js
  function resolveBlockSeq({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bs, onError) {
    const seq2 = new YAMLSeq(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = false;
    let offset = bs.offset;
    let commentEnd = null;
    for (const { start, value } of bs.items) {
      const props = resolveProps(start, {
        indicator: "seq-item-ind",
        next: value,
        offset,
        onError,
        startOnNewline: true
      });
      if (!props.found) {
        if (props.anchor || props.tag || value) {
          if (value && value.type === "block-seq")
            onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
          else
            onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
        } else {
          commentEnd = props.end;
          if (props.comment)
            seq2.comment = props.comment;
          continue;
        }
      }
      const node = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, start, null, props, onError);
      if (ctx.schema.compat)
        flowIndentCheck(bs.indent, value, onError);
      offset = node.range[2];
      seq2.items.push(node);
    }
    seq2.range = [bs.offset, offset, commentEnd ?? offset];
    return seq2;
  }

  // node_modules/yaml/browser/dist/compose/resolve-end.js
  function resolveEnd(end, offset, reqSpace, onError) {
    let comment = "";
    if (end) {
      let hasSpace = false;
      let sep = "";
      for (const token of end) {
        const { source, type } = token;
        switch (type) {
          case "space":
            hasSpace = true;
            break;
          case "comment": {
            if (reqSpace && !hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += sep + cb;
            sep = "";
            break;
          }
          case "newline":
            if (comment)
              sep += source;
            hasSpace = true;
            break;
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
        }
        offset += source.length;
      }
    }
    return { comment, offset };
  }

  // node_modules/yaml/browser/dist/compose/resolve-flow-collection.js
  var blockMsg = "Block collections are not allowed within flow collections";
  var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
  function resolveFlowCollection({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, fc, onError) {
    const isMap2 = fc.start.source === "{";
    const fcName = isMap2 ? "flow map" : "flow sequence";
    const coll = isMap2 ? new YAMLMap(ctx.schema) : new YAMLSeq(ctx.schema);
    coll.flow = true;
    const atRoot = ctx.atRoot;
    if (atRoot)
      ctx.atRoot = false;
    let offset = fc.offset + fc.start.source.length;
    for (let i = 0; i < fc.items.length; ++i) {
      const collItem = fc.items[i];
      const { start, key, sep, value } = collItem;
      const props = resolveProps(start, {
        flow: fcName,
        indicator: "explicit-key-ind",
        next: key ?? sep?.[0],
        offset,
        onError,
        startOnNewline: false
      });
      if (!props.found) {
        if (!props.anchor && !props.tag && !sep && !value) {
          if (i === 0 && props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
          else if (i < fc.items.length - 1)
            onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
          if (props.comment) {
            if (coll.comment)
              coll.comment += "\n" + props.comment;
            else
              coll.comment = props.comment;
          }
          offset = props.end;
          continue;
        }
        if (!isMap2 && ctx.options.strict && containsNewline(key))
          onError(
            key,
            // checked by containsNewline()
            "MULTILINE_IMPLICIT_KEY",
            "Implicit keys of flow sequence pairs need to be on a single line"
          );
      }
      if (i === 0) {
        if (props.comma)
          onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
      } else {
        if (!props.comma)
          onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
        if (props.comment) {
          let prevItemComment = "";
          loop:
            for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
          if (prevItemComment) {
            let prev = coll.items[coll.items.length - 1];
            if (isPair(prev))
              prev = prev.value ?? prev.key;
            if (prev.comment)
              prev.comment += "\n" + prevItemComment;
            else
              prev.comment = prevItemComment;
            props.comment = props.comment.substring(prevItemComment.length + 1);
          }
        }
      }
      if (!isMap2 && !sep && !props.found) {
        const valueNode = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, sep, null, props, onError);
        coll.items.push(valueNode);
        offset = valueNode.range[2];
        if (isBlock(value))
          onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
      } else {
        const keyStart = props.end;
        const keyNode = key ? composeNode2(ctx, key, props, onError) : composeEmptyNode2(ctx, keyStart, start, null, props, onError);
        if (isBlock(key))
          onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
        const valueProps = resolveProps(sep ?? [], {
          flow: fcName,
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          startOnNewline: false
        });
        if (valueProps.found) {
          if (!isMap2 && !props.found && ctx.options.strict) {
            if (sep)
              for (const st of sep) {
                if (st === valueProps.found)
                  break;
                if (st.type === "newline") {
                  onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            if (props.start < valueProps.found.offset - 1024)
              onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
          }
        } else if (value) {
          if ("source" in value && value.source && value.source[0] === ":")
            onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
          else
            onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
        }
        const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode2(ctx, valueProps.end, sep, null, valueProps, onError) : null;
        if (valueNode) {
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else if (valueProps.comment) {
          if (keyNode.comment)
            keyNode.comment += "\n" + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        }
        const pair = new Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        if (isMap2) {
          const map2 = coll;
          if (mapIncludes(ctx, map2.items, keyNode))
            onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
          map2.items.push(pair);
        } else {
          const map2 = new YAMLMap(ctx.schema);
          map2.flow = true;
          map2.items.push(pair);
          coll.items.push(map2);
        }
        offset = valueNode ? valueNode.range[2] : valueProps.end;
      }
    }
    const expectedEnd = isMap2 ? "}" : "]";
    const [ce, ...ee] = fc.end;
    let cePos = offset;
    if (ce && ce.source === expectedEnd)
      cePos = ce.offset + ce.source.length;
    else {
      const name = fcName[0].toUpperCase() + fcName.substring(1);
      const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
      onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
      if (ce && ce.source.length !== 1)
        ee.unshift(ce);
    }
    if (ee.length > 0) {
      const end = resolveEnd(ee, cePos, ctx.options.strict, onError);
      if (end.comment) {
        if (coll.comment)
          coll.comment += "\n" + end.comment;
        else
          coll.comment = end.comment;
      }
      coll.range = [fc.offset, cePos, end.offset];
    } else {
      coll.range = [fc.offset, cePos, cePos];
    }
    return coll;
  }

  // node_modules/yaml/browser/dist/compose/compose-collection.js
  function composeCollection(CN2, ctx, token, tagToken, onError) {
    let coll;
    switch (token.type) {
      case "block-map": {
        coll = resolveBlockMap(CN2, ctx, token, onError);
        break;
      }
      case "block-seq": {
        coll = resolveBlockSeq(CN2, ctx, token, onError);
        break;
      }
      case "flow-collection": {
        coll = resolveFlowCollection(CN2, ctx, token, onError);
        break;
      }
    }
    if (!tagToken)
      return coll;
    const tagName = ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
    if (!tagName)
      return coll;
    const Coll = coll.constructor;
    if (tagName === "!" || tagName === Coll.tagName) {
      coll.tag = Coll.tagName;
      return coll;
    }
    const expType = isMap(coll) ? "map" : "seq";
    let tag = ctx.schema.tags.find((t) => t.collection === expType && t.tag === tagName);
    if (!tag) {
      const kt = ctx.schema.knownTags[tagName];
      if (kt && kt.collection === expType) {
        ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
        tag = kt;
      } else {
        onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
        coll.tag = tagName;
        return coll;
      }
    }
    const res = tag.resolve(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options);
    const node = isNode(res) ? res : new Scalar(res);
    node.range = coll.range;
    node.tag = tagName;
    if (tag?.format)
      node.format = tag.format;
    return node;
  }

  // node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
  function resolveBlockScalar(scalar, strict, onError) {
    const start = scalar.offset;
    const header = parseBlockScalarHeader(scalar, strict, onError);
    if (!header)
      return { value: "", type: null, comment: "", range: [start, start, start] };
    const type = header.mode === ">" ? Scalar.BLOCK_FOLDED : Scalar.BLOCK_LITERAL;
    const lines = scalar.source ? splitLines(scalar.source) : [];
    let chompStart = lines.length;
    for (let i = lines.length - 1; i >= 0; --i) {
      const content = lines[i][1];
      if (content === "" || content === "\r")
        chompStart = i;
      else
        break;
    }
    if (chompStart === 0) {
      const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
      let end2 = start + header.length;
      if (scalar.source)
        end2 += scalar.source.length;
      return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
    }
    let trimIndent = scalar.indent + header.indent;
    let offset = scalar.offset + header.length;
    let contentStart = 0;
    for (let i = 0; i < chompStart; ++i) {
      const [indent, content] = lines[i];
      if (content === "" || content === "\r") {
        if (header.indent === 0 && indent.length > trimIndent)
          trimIndent = indent.length;
      } else {
        if (indent.length < trimIndent) {
          const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
          onError(offset + indent.length, "MISSING_CHAR", message);
        }
        if (header.indent === 0)
          trimIndent = indent.length;
        contentStart = i;
        break;
      }
      offset += indent.length + content.length + 1;
    }
    for (let i = lines.length - 1; i >= chompStart; --i) {
      if (lines[i][0].length > trimIndent)
        chompStart = i + 1;
    }
    let value = "";
    let sep = "";
    let prevMoreIndented = false;
    for (let i = 0; i < contentStart; ++i)
      value += lines[i][0].slice(trimIndent) + "\n";
    for (let i = contentStart; i < chompStart; ++i) {
      let [indent, content] = lines[i];
      offset += indent.length + content.length + 1;
      const crlf = content[content.length - 1] === "\r";
      if (crlf)
        content = content.slice(0, -1);
      if (content && indent.length < trimIndent) {
        const src = header.indent ? "explicit indentation indicator" : "first line";
        const message = `Block scalar lines must not be less indented than their ${src}`;
        onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
        indent = "";
      }
      if (type === Scalar.BLOCK_LITERAL) {
        value += sep + indent.slice(trimIndent) + content;
        sep = "\n";
      } else if (indent.length > trimIndent || content[0] === "	") {
        if (sep === " ")
          sep = "\n";
        else if (!prevMoreIndented && sep === "\n")
          sep = "\n\n";
        value += sep + indent.slice(trimIndent) + content;
        sep = "\n";
        prevMoreIndented = true;
      } else if (content === "") {
        if (sep === "\n")
          value += "\n";
        else
          sep = "\n";
      } else {
        value += sep + content;
        sep = " ";
        prevMoreIndented = false;
      }
    }
    switch (header.chomp) {
      case "-":
        break;
      case "+":
        for (let i = chompStart; i < lines.length; ++i)
          value += "\n" + lines[i][0].slice(trimIndent);
        if (value[value.length - 1] !== "\n")
          value += "\n";
        break;
      default:
        value += "\n";
    }
    const end = start + header.length + scalar.source.length;
    return { value, type, comment: header.comment, range: [start, end, end] };
  }
  function parseBlockScalarHeader({ offset, props }, strict, onError) {
    if (props[0].type !== "block-scalar-header") {
      onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
      return null;
    }
    const { source } = props[0];
    const mode = source[0];
    let indent = 0;
    let chomp = "";
    let error = -1;
    for (let i = 1; i < source.length; ++i) {
      const ch = source[i];
      if (!chomp && (ch === "-" || ch === "+"))
        chomp = ch;
      else {
        const n = Number(ch);
        if (!indent && n)
          indent = n;
        else if (error === -1)
          error = offset + i;
      }
    }
    if (error !== -1)
      onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
    let hasSpace = false;
    let comment = "";
    let length = source.length;
    for (let i = 1; i < props.length; ++i) {
      const token = props[i];
      switch (token.type) {
        case "space":
          hasSpace = true;
        case "newline":
          length += token.source.length;
          break;
        case "comment":
          if (strict && !hasSpace) {
            const message = "Comments must be separated from other tokens by white space characters";
            onError(token, "MISSING_CHAR", message);
          }
          length += token.source.length;
          comment = token.source.substring(1);
          break;
        case "error":
          onError(token, "UNEXPECTED_TOKEN", token.message);
          length += token.source.length;
          break;
        default: {
          const message = `Unexpected token in block scalar header: ${token.type}`;
          onError(token, "UNEXPECTED_TOKEN", message);
          const ts = token.source;
          if (ts && typeof ts === "string")
            length += ts.length;
        }
      }
    }
    return { mode, indent, chomp, comment, length };
  }
  function splitLines(source) {
    const split = source.split(/\n( *)/);
    const first = split[0];
    const m = first.match(/^( *)/);
    const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
    const lines = [line0];
    for (let i = 1; i < split.length; i += 2)
      lines.push([split[i], split[i + 1]]);
    return lines;
  }

  // node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
  function resolveFlowScalar(scalar, strict, onError) {
    const { offset, type, source, end } = scalar;
    let _type;
    let value;
    const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
    switch (type) {
      case "scalar":
        _type = Scalar.PLAIN;
        value = plainValue(source, _onError);
        break;
      case "single-quoted-scalar":
        _type = Scalar.QUOTE_SINGLE;
        value = singleQuotedValue(source, _onError);
        break;
      case "double-quoted-scalar":
        _type = Scalar.QUOTE_DOUBLE;
        value = doubleQuotedValue(source, _onError);
        break;
      default:
        onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
        return {
          value: "",
          type: null,
          comment: "",
          range: [offset, offset + source.length, offset + source.length]
        };
    }
    const valueEnd = offset + source.length;
    const re = resolveEnd(end, valueEnd, strict, onError);
    return {
      value,
      type: _type,
      comment: re.comment,
      range: [offset, valueEnd, re.offset]
    };
  }
  function plainValue(source, onError) {
    let badChar = "";
    switch (source[0]) {
      case "	":
        badChar = "a tab character";
        break;
      case ",":
        badChar = "flow indicator character ,";
        break;
      case "%":
        badChar = "directive indicator character %";
        break;
      case "|":
      case ">": {
        badChar = `block scalar indicator ${source[0]}`;
        break;
      }
      case "@":
      case "`": {
        badChar = `reserved character ${source[0]}`;
        break;
      }
    }
    if (badChar)
      onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
    return foldLines(source);
  }
  function singleQuotedValue(source, onError) {
    if (source[source.length - 1] !== "'" || source.length === 1)
      onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
    return foldLines(source.slice(1, -1)).replace(/''/g, "'");
  }
  function foldLines(source) {
    let first, line;
    try {
      first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
      line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
    } catch (_) {
      first = /(.*?)[ \t]*\r?\n/sy;
      line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
    }
    let match = first.exec(source);
    if (!match)
      return source;
    let res = match[1];
    let sep = " ";
    let pos = first.lastIndex;
    line.lastIndex = pos;
    while (match = line.exec(source)) {
      if (match[1] === "") {
        if (sep === "\n")
          res += sep;
        else
          sep = "\n";
      } else {
        res += sep + match[1];
        sep = " ";
      }
      pos = line.lastIndex;
    }
    const last = /[ \t]*(.*)/sy;
    last.lastIndex = pos;
    match = last.exec(source);
    return res + sep + (match?.[1] ?? "");
  }
  function doubleQuotedValue(source, onError) {
    let res = "";
    for (let i = 1; i < source.length - 1; ++i) {
      const ch = source[i];
      if (ch === "\r" && source[i + 1] === "\n")
        continue;
      if (ch === "\n") {
        const { fold, offset } = foldNewline(source, i);
        res += fold;
        i = offset;
      } else if (ch === "\\") {
        let next = source[++i];
        const cc = escapeCodes[next];
        if (cc)
          res += cc;
        else if (next === "\n") {
          next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
        } else if (next === "\r" && source[i + 1] === "\n") {
          next = source[++i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
        } else if (next === "x" || next === "u" || next === "U") {
          const length = { x: 2, u: 4, U: 8 }[next];
          res += parseCharCode(source, i + 1, length, onError);
          i += length;
        } else {
          const raw = source.substr(i - 1, 2);
          onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
          res += raw;
        }
      } else if (ch === " " || ch === "	") {
        const wsStart = i;
        let next = source[i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
        if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
          res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
      } else {
        res += ch;
      }
    }
    if (source[source.length - 1] !== '"' || source.length === 1)
      onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
    return res;
  }
  function foldNewline(source, offset) {
    let fold = "";
    let ch = source[offset + 1];
    while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
      if (ch === "\r" && source[offset + 2] !== "\n")
        break;
      if (ch === "\n")
        fold += "\n";
      offset += 1;
      ch = source[offset + 1];
    }
    if (!fold)
      fold = " ";
    return { fold, offset };
  }
  var escapeCodes = {
    "0": "\0",
    a: "\x07",
    b: "\b",
    e: "\x1B",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "	",
    v: "\v",
    N: "\x85",
    _: "\xA0",
    L: "\u2028",
    P: "\u2029",
    " ": " ",
    '"': '"',
    "/": "/",
    "\\": "\\",
    "	": "	"
  };
  function parseCharCode(source, offset, length, onError) {
    const cc = source.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;
    if (isNaN(code)) {
      const raw = source.substr(offset - 2, length + 2);
      onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
      return raw;
    }
    return String.fromCodePoint(code);
  }

  // node_modules/yaml/browser/dist/compose/compose-scalar.js
  function composeScalar(ctx, token, tagToken, onError) {
    const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar(token, ctx.options.strict, onError) : resolveFlowScalar(token, ctx.options.strict, onError);
    const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
    const tag = tagToken && tagName ? findScalarTagByName(ctx.schema, value, tagName, tagToken, onError) : token.type === "scalar" ? findScalarTagByTest(ctx, value, token, onError) : ctx.schema[SCALAR];
    let scalar;
    try {
      const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
      scalar = isScalar(res) ? res : new Scalar(res);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
      scalar = new Scalar(value);
    }
    scalar.range = range;
    scalar.source = value;
    if (type)
      scalar.type = type;
    if (tagName)
      scalar.tag = tagName;
    if (tag.format)
      scalar.format = tag.format;
    if (comment)
      scalar.comment = comment;
    return scalar;
  }
  function findScalarTagByName(schema4, value, tagName, tagToken, onError) {
    if (tagName === "!")
      return schema4[SCALAR];
    const matchWithTest = [];
    for (const tag of schema4.tags) {
      if (!tag.collection && tag.tag === tagName) {
        if (tag.default && tag.test)
          matchWithTest.push(tag);
        else
          return tag;
      }
    }
    for (const tag of matchWithTest)
      if (tag.test?.test(value))
        return tag;
    const kt = schema4.knownTags[tagName];
    if (kt && !kt.collection) {
      schema4.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
      return kt;
    }
    onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
    return schema4[SCALAR];
  }
  function findScalarTagByTest({ directives, schema: schema4 }, value, token, onError) {
    const tag = schema4.tags.find((tag2) => tag2.default && tag2.test?.test(value)) || schema4[SCALAR];
    if (schema4.compat) {
      const compat = schema4.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema4[SCALAR];
      if (tag.tag !== compat.tag) {
        const ts = directives.tagString(tag.tag);
        const cs = directives.tagString(compat.tag);
        const msg = `Value may be parsed as either ${ts} or ${cs}`;
        onError(token, "TAG_RESOLVE_FAILED", msg, true);
      }
    }
    return tag;
  }

  // node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js
  function emptyScalarPosition(offset, before, pos) {
    if (before) {
      if (pos === null)
        pos = before.length;
      for (let i = pos - 1; i >= 0; --i) {
        let st = before[i];
        switch (st.type) {
          case "space":
          case "comment":
          case "newline":
            offset -= st.source.length;
            continue;
        }
        st = before[++i];
        while (st?.type === "space") {
          offset += st.source.length;
          st = before[++i];
        }
        break;
      }
    }
    return offset;
  }

  // node_modules/yaml/browser/dist/compose/compose-node.js
  var CN = { composeNode, composeEmptyNode };
  function composeNode(ctx, token, props, onError) {
    const { spaceBefore, comment, anchor, tag } = props;
    let node;
    let isSrcToken = true;
    switch (token.type) {
      case "alias":
        node = composeAlias(ctx, token, onError);
        if (anchor || tag)
          onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        node = composeScalar(ctx, token, tag, onError);
        if (anchor)
          node.anchor = anchor.source.substring(1);
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        node = composeCollection(CN, ctx, token, tag, onError);
        if (anchor)
          node.anchor = anchor.source.substring(1);
        break;
      default: {
        const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
        onError(token, "UNEXPECTED_TOKEN", message);
        node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError);
        isSrcToken = false;
      }
    }
    if (anchor && node.anchor === "")
      onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    if (spaceBefore)
      node.spaceBefore = true;
    if (comment) {
      if (token.type === "scalar" && token.source === "")
        node.comment = comment;
      else
        node.commentBefore = comment;
    }
    if (ctx.options.keepSourceTokens && isSrcToken)
      node.srcToken = token;
    return node;
  }
  function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
    const token = {
      type: "scalar",
      offset: emptyScalarPosition(offset, before, pos),
      indent: -1,
      source: ""
    };
    const node = composeScalar(ctx, token, tag, onError);
    if (anchor) {
      node.anchor = anchor.source.substring(1);
      if (node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    }
    if (spaceBefore)
      node.spaceBefore = true;
    if (comment) {
      node.comment = comment;
      node.range[2] = end;
    }
    return node;
  }
  function composeAlias({ options }, { offset, source, end }, onError) {
    const alias = new Alias(source.substring(1));
    if (alias.source === "")
      onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
    if (alias.source.endsWith(":"))
      onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
    const valueEnd = offset + source.length;
    const re = resolveEnd(end, valueEnd, options.strict, onError);
    alias.range = [offset, valueEnd, re.offset];
    if (re.comment)
      alias.comment = re.comment;
    return alias;
  }

  // node_modules/yaml/browser/dist/compose/compose-doc.js
  function composeDoc(options, directives, { offset, start, value, end }, onError) {
    const opts = Object.assign({ _directives: directives }, options);
    const doc = new Document(void 0, opts);
    const ctx = {
      atRoot: true,
      directives: doc.directives,
      options: doc.options,
      schema: doc.schema
    };
    const props = resolveProps(start, {
      indicator: "doc-start",
      next: value ?? end?.[0],
      offset,
      onError,
      startOnNewline: true
    });
    if (props.found) {
      doc.directives.docStart = true;
      if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
        onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
    }
    doc.contents = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
    const contentEnd = doc.contents.range[2];
    const re = resolveEnd(end, contentEnd, false, onError);
    if (re.comment)
      doc.comment = re.comment;
    doc.range = [offset, contentEnd, re.offset];
    return doc;
  }

  // node_modules/yaml/browser/dist/compose/composer.js
  function getErrorPos(src) {
    if (typeof src === "number")
      return [src, src + 1];
    if (Array.isArray(src))
      return src.length === 2 ? src : [src[0], src[1]];
    const { offset, source } = src;
    return [offset, offset + (typeof source === "string" ? source.length : 1)];
  }
  function parsePrelude(prelude) {
    let comment = "";
    let atComment = false;
    let afterEmptyLine = false;
    for (let i = 0; i < prelude.length; ++i) {
      const source = prelude[i];
      switch (source[0]) {
        case "#":
          comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
          atComment = true;
          afterEmptyLine = false;
          break;
        case "%":
          if (prelude[i + 1]?.[0] !== "#")
            i += 1;
          atComment = false;
          break;
        default:
          if (!atComment)
            afterEmptyLine = true;
          atComment = false;
      }
    }
    return { comment, afterEmptyLine };
  }
  var Composer = class {
    constructor(options = {}) {
      this.doc = null;
      this.atDirectives = false;
      this.prelude = [];
      this.errors = [];
      this.warnings = [];
      this.onError = (source, code, message, warning) => {
        const pos = getErrorPos(source);
        if (warning)
          this.warnings.push(new YAMLWarning(pos, code, message));
        else
          this.errors.push(new YAMLParseError(pos, code, message));
      };
      this.directives = new Directives({ version: options.version || "1.2" });
      this.options = options;
    }
    decorate(doc, afterDoc) {
      const { comment, afterEmptyLine } = parsePrelude(this.prelude);
      if (comment) {
        const dc = doc.contents;
        if (afterDoc) {
          doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
        } else if (afterEmptyLine || doc.directives.docStart || !dc) {
          doc.commentBefore = comment;
        } else if (isCollection(dc) && !dc.flow && dc.items.length > 0) {
          let it = dc.items[0];
          if (isPair(it))
            it = it.key;
          const cb = it.commentBefore;
          it.commentBefore = cb ? `${comment}
${cb}` : comment;
        } else {
          const cb = dc.commentBefore;
          dc.commentBefore = cb ? `${comment}
${cb}` : comment;
        }
      }
      if (afterDoc) {
        Array.prototype.push.apply(doc.errors, this.errors);
        Array.prototype.push.apply(doc.warnings, this.warnings);
      } else {
        doc.errors = this.errors;
        doc.warnings = this.warnings;
      }
      this.prelude = [];
      this.errors = [];
      this.warnings = [];
    }
    /**
     * Current stream status information.
     *
     * Mostly useful at the end of input for an empty stream.
     */
    streamInfo() {
      return {
        comment: parsePrelude(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings
      };
    }
    /**
     * Compose tokens into documents.
     *
     * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
     * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
     */
    *compose(tokens, forceDoc = false, endOffset = -1) {
      for (const token of tokens)
        yield* this.next(token);
      yield* this.end(forceDoc, endOffset);
    }
    /** Advance the composer by one CST token. */
    *next(token) {
      switch (token.type) {
        case "directive":
          this.directives.add(token.source, (offset, message, warning) => {
            const pos = getErrorPos(token);
            pos[0] += offset;
            this.onError(pos, "BAD_DIRECTIVE", message, warning);
          });
          this.prelude.push(token.source);
          this.atDirectives = true;
          break;
        case "document": {
          const doc = composeDoc(this.options, this.directives, token, this.onError);
          if (this.atDirectives && !doc.directives.docStart)
            this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
          this.decorate(doc, false);
          if (this.doc)
            yield this.doc;
          this.doc = doc;
          this.atDirectives = false;
          break;
        }
        case "byte-order-mark":
        case "space":
          break;
        case "comment":
        case "newline":
          this.prelude.push(token.source);
          break;
        case "error": {
          const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
          const error = new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
          if (this.atDirectives || !this.doc)
            this.errors.push(error);
          else
            this.doc.errors.push(error);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            const msg = "Unexpected doc-end without preceding document";
            this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
            break;
          }
          this.doc.directives.docEnd = true;
          const end = resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
          this.decorate(this.doc, true);
          if (end.comment) {
            const dc = this.doc.comment;
            this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
          }
          this.doc.range[2] = end.offset;
          break;
        }
        default:
          this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
      }
    }
    /**
     * Call at end of input to yield any remaining document.
     *
     * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
     * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
     */
    *end(forceDoc = false, endOffset = -1) {
      if (this.doc) {
        this.decorate(this.doc, true);
        yield this.doc;
        this.doc = null;
      } else if (forceDoc) {
        const opts = Object.assign({ _directives: this.directives }, this.options);
        const doc = new Document(void 0, opts);
        if (this.atDirectives)
          this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
        doc.range = [0, endOffset, endOffset];
        this.decorate(doc, false);
        yield doc;
      }
    }
  };

  // node_modules/yaml/browser/dist/parse/cst.js
  var cst_exports = {};
  __export(cst_exports, {
    BOM: () => BOM,
    DOCUMENT: () => DOCUMENT,
    FLOW_END: () => FLOW_END,
    SCALAR: () => SCALAR2,
    createScalarToken: () => createScalarToken,
    isCollection: () => isCollection2,
    isScalar: () => isScalar2,
    prettyToken: () => prettyToken,
    resolveAsScalar: () => resolveAsScalar,
    setScalarValue: () => setScalarValue,
    stringify: () => stringify2,
    tokenType: () => tokenType,
    visit: () => visit2
  });

  // node_modules/yaml/browser/dist/parse/cst-scalar.js
  function resolveAsScalar(token, strict = true, onError) {
    if (token) {
      const _onError = (pos, code, message) => {
        const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
        if (onError)
          onError(offset, code, message);
        else
          throw new YAMLParseError([offset, offset + 1], code, message);
      };
      switch (token.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return resolveFlowScalar(token, strict, _onError);
        case "block-scalar":
          return resolveBlockScalar(token, strict, _onError);
      }
    }
    return null;
  }
  function createScalarToken(value, context) {
    const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
    const source = stringifyString({ type, value }, {
      implicitKey,
      indent: indent > 0 ? " ".repeat(indent) : "",
      inFlow,
      options: { blockQuote: true, lineWidth: -1 }
    });
    const end = context.end ?? [
      { type: "newline", offset: -1, indent, source: "\n" }
    ];
    switch (source[0]) {
      case "|":
      case ">": {
        const he = source.indexOf("\n");
        const head = source.substring(0, he);
        const body = source.substring(he + 1) + "\n";
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, end))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        return { type: "block-scalar", offset, indent, props, source: body };
      }
      case '"':
        return { type: "double-quoted-scalar", offset, indent, source, end };
      case "'":
        return { type: "single-quoted-scalar", offset, indent, source, end };
      default:
        return { type: "scalar", offset, indent, source, end };
    }
  }
  function setScalarValue(token, value, context = {}) {
    let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
    let indent = "indent" in token ? token.indent : null;
    if (afterKey && typeof indent === "number")
      indent += 2;
    if (!type)
      switch (token.type) {
        case "single-quoted-scalar":
          type = "QUOTE_SINGLE";
          break;
        case "double-quoted-scalar":
          type = "QUOTE_DOUBLE";
          break;
        case "block-scalar": {
          const header = token.props[0];
          if (header.type !== "block-scalar-header")
            throw new Error("Invalid block scalar header");
          type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
          break;
        }
        default:
          type = "PLAIN";
      }
    const source = stringifyString({ type, value }, {
      implicitKey: implicitKey || indent === null,
      indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
      inFlow,
      options: { blockQuote: true, lineWidth: -1 }
    });
    switch (source[0]) {
      case "|":
      case ">":
        setBlockScalarValue(token, source);
        break;
      case '"':
        setFlowScalarValue(token, source, "double-quoted-scalar");
        break;
      case "'":
        setFlowScalarValue(token, source, "single-quoted-scalar");
        break;
      default:
        setFlowScalarValue(token, source, "scalar");
    }
  }
  function setBlockScalarValue(token, source) {
    const he = source.indexOf("\n");
    const head = source.substring(0, he);
    const body = source.substring(he + 1) + "\n";
    if (token.type === "block-scalar") {
      const header = token.props[0];
      if (header.type !== "block-scalar-header")
        throw new Error("Invalid block scalar header");
      header.source = head;
      token.source = body;
    } else {
      const { offset } = token;
      const indent = "indent" in token ? token.indent : -1;
      const props = [
        { type: "block-scalar-header", offset, indent, source: head }
      ];
      if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
        props.push({ type: "newline", offset: -1, indent, source: "\n" });
      for (const key of Object.keys(token))
        if (key !== "type" && key !== "offset")
          delete token[key];
      Object.assign(token, { type: "block-scalar", indent, props, source: body });
    }
  }
  function addEndtoBlockProps(props, end) {
    if (end)
      for (const st of end)
        switch (st.type) {
          case "space":
          case "comment":
            props.push(st);
            break;
          case "newline":
            props.push(st);
            return true;
        }
    return false;
  }
  function setFlowScalarValue(token, source, type) {
    switch (token.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        token.type = type;
        token.source = source;
        break;
      case "block-scalar": {
        const end = token.props.slice(1);
        let oa = source.length;
        if (token.props[0].type === "block-scalar-header")
          oa -= token.props[0].source.length;
        for (const tok of end)
          tok.offset += oa;
        delete token.props;
        Object.assign(token, { type, source, end });
        break;
      }
      case "block-map":
      case "block-seq": {
        const offset = token.offset + source.length;
        const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
        delete token.items;
        Object.assign(token, { type, source, end: [nl] });
        break;
      }
      default: {
        const indent = "indent" in token ? token.indent : -1;
        const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type, indent, source, end });
      }
    }
  }

  // node_modules/yaml/browser/dist/parse/cst-stringify.js
  var stringify2 = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
  function stringifyToken(token) {
    switch (token.type) {
      case "block-scalar": {
        let res = "";
        for (const tok of token.props)
          res += stringifyToken(tok);
        return res + token.source;
      }
      case "block-map":
      case "block-seq": {
        let res = "";
        for (const item of token.items)
          res += stringifyItem(item);
        return res;
      }
      case "flow-collection": {
        let res = token.start.source;
        for (const item of token.items)
          res += stringifyItem(item);
        for (const st of token.end)
          res += st.source;
        return res;
      }
      case "document": {
        let res = stringifyItem(token);
        if (token.end)
          for (const st of token.end)
            res += st.source;
        return res;
      }
      default: {
        let res = token.source;
        if ("end" in token && token.end)
          for (const st of token.end)
            res += st.source;
        return res;
      }
    }
  }
  function stringifyItem({ start, key, sep, value }) {
    let res = "";
    for (const st of start)
      res += st.source;
    if (key)
      res += stringifyToken(key);
    if (sep)
      for (const st of sep)
        res += st.source;
    if (value)
      res += stringifyToken(value);
    return res;
  }

  // node_modules/yaml/browser/dist/parse/cst-visit.js
  var BREAK2 = Symbol("break visit");
  var SKIP2 = Symbol("skip children");
  var REMOVE2 = Symbol("remove item");
  function visit2(cst, visitor) {
    if ("type" in cst && cst.type === "document")
      cst = { start: cst.start, value: cst.value };
    _visit(Object.freeze([]), cst, visitor);
  }
  visit2.BREAK = BREAK2;
  visit2.SKIP = SKIP2;
  visit2.REMOVE = REMOVE2;
  visit2.itemAtPath = (cst, path) => {
    let item = cst;
    for (const [field, index] of path) {
      const tok = item?.[field];
      if (tok && "items" in tok) {
        item = tok.items[index];
      } else
        return void 0;
    }
    return item;
  };
  visit2.parentCollection = (cst, path) => {
    const parent = visit2.itemAtPath(cst, path.slice(0, -1));
    const field = path[path.length - 1][0];
    const coll = parent?.[field];
    if (coll && "items" in coll)
      return coll;
    throw new Error("Parent collection not found");
  };
  function _visit(path, item, visitor) {
    let ctrl = visitor(item, path);
    if (typeof ctrl === "symbol")
      return ctrl;
    for (const field of ["key", "value"]) {
      const token = item[field];
      if (token && "items" in token) {
        for (let i = 0; i < token.items.length; ++i) {
          const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK2)
            return BREAK2;
          else if (ci === REMOVE2) {
            token.items.splice(i, 1);
            i -= 1;
          }
        }
        if (typeof ctrl === "function" && field === "key")
          ctrl = ctrl(item, path);
      }
    }
    return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
  }

  // node_modules/yaml/browser/dist/parse/cst.js
  var BOM = "\uFEFF";
  var DOCUMENT = "";
  var FLOW_END = "";
  var SCALAR2 = "";
  var isCollection2 = (token) => !!token && "items" in token;
  var isScalar2 = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
  function prettyToken(token) {
    switch (token) {
      case BOM:
        return "<BOM>";
      case DOCUMENT:
        return "<DOC>";
      case FLOW_END:
        return "<FLOW_END>";
      case SCALAR2:
        return "<SCALAR>";
      default:
        return JSON.stringify(token);
    }
  }
  function tokenType(source) {
    switch (source) {
      case BOM:
        return "byte-order-mark";
      case DOCUMENT:
        return "doc-mode";
      case FLOW_END:
        return "flow-error-end";
      case SCALAR2:
        return "scalar";
      case "---":
        return "doc-start";
      case "...":
        return "doc-end";
      case "":
      case "\n":
      case "\r\n":
        return "newline";
      case "-":
        return "seq-item-ind";
      case "?":
        return "explicit-key-ind";
      case ":":
        return "map-value-ind";
      case "{":
        return "flow-map-start";
      case "}":
        return "flow-map-end";
      case "[":
        return "flow-seq-start";
      case "]":
        return "flow-seq-end";
      case ",":
        return "comma";
    }
    switch (source[0]) {
      case " ":
      case "	":
        return "space";
      case "#":
        return "comment";
      case "%":
        return "directive-line";
      case "*":
        return "alias";
      case "&":
        return "anchor";
      case "!":
        return "tag";
      case "'":
        return "single-quoted-scalar";
      case '"':
        return "double-quoted-scalar";
      case "|":
      case ">":
        return "block-scalar-header";
    }
    return null;
  }

  // node_modules/yaml/browser/dist/parse/lexer.js
  function isEmpty(ch) {
    switch (ch) {
      case void 0:
      case " ":
      case "\n":
      case "\r":
      case "	":
        return true;
      default:
        return false;
    }
  }
  var hexDigits = "0123456789ABCDEFabcdef".split("");
  var tagChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()".split("");
  var invalidFlowScalarChars = ",[]{}".split("");
  var invalidAnchorChars = " ,[]{}\n\r	".split("");
  var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.includes(ch);
  var Lexer = class {
    constructor() {
      this.atEnd = false;
      this.blockScalarIndent = -1;
      this.blockScalarKeep = false;
      this.buffer = "";
      this.flowKey = false;
      this.flowLevel = 0;
      this.indentNext = 0;
      this.indentValue = 0;
      this.lineEndPos = null;
      this.next = null;
      this.pos = 0;
    }
    /**
     * Generate YAML tokens from the `source` string. If `incomplete`,
     * a part of the last line may be left as a buffer for the next call.
     *
     * @returns A generator of lexical tokens
     */
    *lex(source, incomplete = false) {
      if (source) {
        this.buffer = this.buffer ? this.buffer + source : source;
        this.lineEndPos = null;
      }
      this.atEnd = !incomplete;
      let next = this.next ?? "stream";
      while (next && (incomplete || this.hasChars(1)))
        next = yield* this.parseNext(next);
    }
    atLineEnd() {
      let i = this.pos;
      let ch = this.buffer[i];
      while (ch === " " || ch === "	")
        ch = this.buffer[++i];
      if (!ch || ch === "#" || ch === "\n")
        return true;
      if (ch === "\r")
        return this.buffer[i + 1] === "\n";
      return false;
    }
    charAt(n) {
      return this.buffer[this.pos + n];
    }
    continueScalar(offset) {
      let ch = this.buffer[offset];
      if (this.indentNext > 0) {
        let indent = 0;
        while (ch === " ")
          ch = this.buffer[++indent + offset];
        if (ch === "\r") {
          const next = this.buffer[indent + offset + 1];
          if (next === "\n" || !next && !this.atEnd)
            return offset + indent + 1;
        }
        return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
      }
      if (ch === "-" || ch === ".") {
        const dt = this.buffer.substr(offset, 3);
        if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
          return -1;
      }
      return offset;
    }
    getLine() {
      let end = this.lineEndPos;
      if (typeof end !== "number" || end !== -1 && end < this.pos) {
        end = this.buffer.indexOf("\n", this.pos);
        this.lineEndPos = end;
      }
      if (end === -1)
        return this.atEnd ? this.buffer.substring(this.pos) : null;
      if (this.buffer[end - 1] === "\r")
        end -= 1;
      return this.buffer.substring(this.pos, end);
    }
    hasChars(n) {
      return this.pos + n <= this.buffer.length;
    }
    setNext(state) {
      this.buffer = this.buffer.substring(this.pos);
      this.pos = 0;
      this.lineEndPos = null;
      this.next = state;
      return null;
    }
    peek(n) {
      return this.buffer.substr(this.pos, n);
    }
    *parseNext(next) {
      switch (next) {
        case "stream":
          return yield* this.parseStream();
        case "line-start":
          return yield* this.parseLineStart();
        case "block-start":
          return yield* this.parseBlockStart();
        case "doc":
          return yield* this.parseDocument();
        case "flow":
          return yield* this.parseFlowCollection();
        case "quoted-scalar":
          return yield* this.parseQuotedScalar();
        case "block-scalar":
          return yield* this.parseBlockScalar();
        case "plain-scalar":
          return yield* this.parsePlainScalar();
      }
    }
    *parseStream() {
      let line = this.getLine();
      if (line === null)
        return this.setNext("stream");
      if (line[0] === BOM) {
        yield* this.pushCount(1);
        line = line.substring(1);
      }
      if (line[0] === "%") {
        let dirEnd = line.length;
        const cs = line.indexOf("#");
        if (cs !== -1) {
          const ch = line[cs - 1];
          if (ch === " " || ch === "	")
            dirEnd = cs - 1;
        }
        while (true) {
          const ch = line[dirEnd - 1];
          if (ch === " " || ch === "	")
            dirEnd -= 1;
          else
            break;
        }
        const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
        yield* this.pushCount(line.length - n);
        this.pushNewline();
        return "stream";
      }
      if (this.atLineEnd()) {
        const sp = yield* this.pushSpaces(true);
        yield* this.pushCount(line.length - sp);
        yield* this.pushNewline();
        return "stream";
      }
      yield DOCUMENT;
      return yield* this.parseLineStart();
    }
    *parseLineStart() {
      const ch = this.charAt(0);
      if (!ch && !this.atEnd)
        return this.setNext("line-start");
      if (ch === "-" || ch === ".") {
        if (!this.atEnd && !this.hasChars(4))
          return this.setNext("line-start");
        const s = this.peek(3);
        if (s === "---" && isEmpty(this.charAt(3))) {
          yield* this.pushCount(3);
          this.indentValue = 0;
          this.indentNext = 0;
          return "doc";
        } else if (s === "..." && isEmpty(this.charAt(3))) {
          yield* this.pushCount(3);
          return "stream";
        }
      }
      this.indentValue = yield* this.pushSpaces(false);
      if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
        this.indentNext = this.indentValue;
      return yield* this.parseBlockStart();
    }
    *parseBlockStart() {
      const [ch0, ch1] = this.peek(2);
      if (!ch1 && !this.atEnd)
        return this.setNext("block-start");
      if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
        const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
        this.indentNext = this.indentValue + 1;
        this.indentValue += n;
        return yield* this.parseBlockStart();
      }
      return "doc";
    }
    *parseDocument() {
      yield* this.pushSpaces(true);
      const line = this.getLine();
      if (line === null)
        return this.setNext("doc");
      let n = yield* this.pushIndicators();
      switch (line[n]) {
        case "#":
          yield* this.pushCount(line.length - n);
        case void 0:
          yield* this.pushNewline();
          return yield* this.parseLineStart();
        case "{":
        case "[":
          yield* this.pushCount(1);
          this.flowKey = false;
          this.flowLevel = 1;
          return "flow";
        case "}":
        case "]":
          yield* this.pushCount(1);
          return "doc";
        case "*":
          yield* this.pushUntil(isNotAnchorChar);
          return "doc";
        case '"':
        case "'":
          return yield* this.parseQuotedScalar();
        case "|":
        case ">":
          n += yield* this.parseBlockScalarHeader();
          n += yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - n);
          yield* this.pushNewline();
          return yield* this.parseBlockScalar();
        default:
          return yield* this.parsePlainScalar();
      }
    }
    *parseFlowCollection() {
      let nl, sp;
      let indent = -1;
      do {
        nl = yield* this.pushNewline();
        if (nl > 0) {
          sp = yield* this.pushSpaces(false);
          this.indentValue = indent = sp;
        } else {
          sp = 0;
        }
        sp += yield* this.pushSpaces(true);
      } while (nl + sp > 0);
      const line = this.getLine();
      if (line === null)
        return this.setNext("flow");
      if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
        const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
        if (!atFlowEndMarker) {
          this.flowLevel = 0;
          yield FLOW_END;
          return yield* this.parseLineStart();
        }
      }
      let n = 0;
      while (line[n] === ",") {
        n += yield* this.pushCount(1);
        n += yield* this.pushSpaces(true);
        this.flowKey = false;
      }
      n += yield* this.pushIndicators();
      switch (line[n]) {
        case void 0:
          return "flow";
        case "#":
          yield* this.pushCount(line.length - n);
          return "flow";
        case "{":
        case "[":
          yield* this.pushCount(1);
          this.flowKey = false;
          this.flowLevel += 1;
          return "flow";
        case "}":
        case "]":
          yield* this.pushCount(1);
          this.flowKey = true;
          this.flowLevel -= 1;
          return this.flowLevel ? "flow" : "doc";
        case "*":
          yield* this.pushUntil(isNotAnchorChar);
          return "flow";
        case '"':
        case "'":
          this.flowKey = true;
          return yield* this.parseQuotedScalar();
        case ":": {
          const next = this.charAt(1);
          if (this.flowKey || isEmpty(next) || next === ",") {
            this.flowKey = false;
            yield* this.pushCount(1);
            yield* this.pushSpaces(true);
            return "flow";
          }
        }
        default:
          this.flowKey = false;
          return yield* this.parsePlainScalar();
      }
    }
    *parseQuotedScalar() {
      const quote = this.charAt(0);
      let end = this.buffer.indexOf(quote, this.pos + 1);
      if (quote === "'") {
        while (end !== -1 && this.buffer[end + 1] === "'")
          end = this.buffer.indexOf("'", end + 2);
      } else {
        while (end !== -1) {
          let n = 0;
          while (this.buffer[end - 1 - n] === "\\")
            n += 1;
          if (n % 2 === 0)
            break;
          end = this.buffer.indexOf('"', end + 1);
        }
      }
      const qb = this.buffer.substring(0, end);
      let nl = qb.indexOf("\n", this.pos);
      if (nl !== -1) {
        while (nl !== -1) {
          const cs = this.continueScalar(nl + 1);
          if (cs === -1)
            break;
          nl = qb.indexOf("\n", cs);
        }
        if (nl !== -1) {
          end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
        }
      }
      if (end === -1) {
        if (!this.atEnd)
          return this.setNext("quoted-scalar");
        end = this.buffer.length;
      }
      yield* this.pushToIndex(end + 1, false);
      return this.flowLevel ? "flow" : "doc";
    }
    *parseBlockScalarHeader() {
      this.blockScalarIndent = -1;
      this.blockScalarKeep = false;
      let i = this.pos;
      while (true) {
        const ch = this.buffer[++i];
        if (ch === "+")
          this.blockScalarKeep = true;
        else if (ch > "0" && ch <= "9")
          this.blockScalarIndent = Number(ch) - 1;
        else if (ch !== "-")
          break;
      }
      return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
    }
    *parseBlockScalar() {
      let nl = this.pos - 1;
      let indent = 0;
      let ch;
      loop:
        for (let i = this.pos; ch = this.buffer[i]; ++i) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            default:
              break loop;
          }
        }
      if (!ch && !this.atEnd)
        return this.setNext("block-scalar");
      if (indent >= this.indentNext) {
        if (this.blockScalarIndent === -1)
          this.indentNext = indent;
        else
          this.indentNext += this.blockScalarIndent;
        do {
          const cs = this.continueScalar(nl + 1);
          if (cs === -1)
            break;
          nl = this.buffer.indexOf("\n", cs);
        } while (nl !== -1);
        if (nl === -1) {
          if (!this.atEnd)
            return this.setNext("block-scalar");
          nl = this.buffer.length;
        }
      }
      if (!this.blockScalarKeep) {
        do {
          let i = nl - 1;
          let ch2 = this.buffer[i];
          if (ch2 === "\r")
            ch2 = this.buffer[--i];
          const lastChar = i;
          while (ch2 === " " || ch2 === "	")
            ch2 = this.buffer[--i];
          if (ch2 === "\n" && i >= this.pos && i + 1 + indent > lastChar)
            nl = i;
          else
            break;
        } while (true);
      }
      yield SCALAR2;
      yield* this.pushToIndex(nl + 1, true);
      return yield* this.parseLineStart();
    }
    *parsePlainScalar() {
      const inFlow = this.flowLevel > 0;
      let end = this.pos - 1;
      let i = this.pos - 1;
      let ch;
      while (ch = this.buffer[++i]) {
        if (ch === ":") {
          const next = this.buffer[i + 1];
          if (isEmpty(next) || inFlow && next === ",")
            break;
          end = i;
        } else if (isEmpty(ch)) {
          let next = this.buffer[i + 1];
          if (ch === "\r") {
            if (next === "\n") {
              i += 1;
              ch = "\n";
              next = this.buffer[i + 1];
            } else
              end = i;
          }
          if (next === "#" || inFlow && invalidFlowScalarChars.includes(next))
            break;
          if (ch === "\n") {
            const cs = this.continueScalar(i + 1);
            if (cs === -1)
              break;
            i = Math.max(i, cs - 2);
          }
        } else {
          if (inFlow && invalidFlowScalarChars.includes(ch))
            break;
          end = i;
        }
      }
      if (!ch && !this.atEnd)
        return this.setNext("plain-scalar");
      yield SCALAR2;
      yield* this.pushToIndex(end + 1, true);
      return inFlow ? "flow" : "doc";
    }
    *pushCount(n) {
      if (n > 0) {
        yield this.buffer.substr(this.pos, n);
        this.pos += n;
        return n;
      }
      return 0;
    }
    *pushToIndex(i, allowEmpty) {
      const s = this.buffer.slice(this.pos, i);
      if (s) {
        yield s;
        this.pos += s.length;
        return s.length;
      } else if (allowEmpty)
        yield "";
      return 0;
    }
    *pushIndicators() {
      switch (this.charAt(0)) {
        case "!":
          return (yield* this.pushTag()) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
        case "&":
          return (yield* this.pushUntil(isNotAnchorChar)) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
        case "-":
        case "?":
        case ":": {
          const inFlow = this.flowLevel > 0;
          const ch1 = this.charAt(1);
          if (isEmpty(ch1) || inFlow && invalidFlowScalarChars.includes(ch1)) {
            if (!inFlow)
              this.indentNext = this.indentValue + 1;
            else if (this.flowKey)
              this.flowKey = false;
            return (yield* this.pushCount(1)) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
          }
        }
      }
      return 0;
    }
    *pushTag() {
      if (this.charAt(1) === "<") {
        let i = this.pos + 2;
        let ch = this.buffer[i];
        while (!isEmpty(ch) && ch !== ">")
          ch = this.buffer[++i];
        return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
      } else {
        let i = this.pos + 1;
        let ch = this.buffer[i];
        while (ch) {
          if (tagChars.includes(ch))
            ch = this.buffer[++i];
          else if (ch === "%" && hexDigits.includes(this.buffer[i + 1]) && hexDigits.includes(this.buffer[i + 2])) {
            ch = this.buffer[i += 3];
          } else
            break;
        }
        return yield* this.pushToIndex(i, false);
      }
    }
    *pushNewline() {
      const ch = this.buffer[this.pos];
      if (ch === "\n")
        return yield* this.pushCount(1);
      else if (ch === "\r" && this.charAt(1) === "\n")
        return yield* this.pushCount(2);
      else
        return 0;
    }
    *pushSpaces(allowTabs) {
      let i = this.pos - 1;
      let ch;
      do {
        ch = this.buffer[++i];
      } while (ch === " " || allowTabs && ch === "	");
      const n = i - this.pos;
      if (n > 0) {
        yield this.buffer.substr(this.pos, n);
        this.pos = i;
      }
      return n;
    }
    *pushUntil(test) {
      let i = this.pos;
      let ch = this.buffer[i];
      while (!test(ch))
        ch = this.buffer[++i];
      return yield* this.pushToIndex(i, false);
    }
  };

  // node_modules/yaml/browser/dist/parse/line-counter.js
  var LineCounter = class {
    constructor() {
      this.lineStarts = [];
      this.addNewLine = (offset) => this.lineStarts.push(offset);
      this.linePos = (offset) => {
        let low = 0;
        let high = this.lineStarts.length;
        while (low < high) {
          const mid = low + high >> 1;
          if (this.lineStarts[mid] < offset)
            low = mid + 1;
          else
            high = mid;
        }
        if (this.lineStarts[low] === offset)
          return { line: low + 1, col: 1 };
        if (low === 0)
          return { line: 0, col: offset };
        const start = this.lineStarts[low - 1];
        return { line: low, col: offset - start + 1 };
      };
    }
  };

  // node_modules/yaml/browser/dist/parse/parser.js
  function includesToken(list, type) {
    for (let i = 0; i < list.length; ++i)
      if (list[i].type === type)
        return true;
    return false;
  }
  function findNonEmptyIndex(list) {
    for (let i = 0; i < list.length; ++i) {
      switch (list[i].type) {
        case "space":
        case "comment":
        case "newline":
          break;
        default:
          return i;
      }
    }
    return -1;
  }
  function isFlowToken(token) {
    switch (token?.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "flow-collection":
        return true;
      default:
        return false;
    }
  }
  function getPrevProps(parent) {
    switch (parent.type) {
      case "document":
        return parent.start;
      case "block-map": {
        const it = parent.items[parent.items.length - 1];
        return it.sep ?? it.start;
      }
      case "block-seq":
        return parent.items[parent.items.length - 1].start;
      default:
        return [];
    }
  }
  function getFirstKeyStartProps(prev) {
    if (prev.length === 0)
      return [];
    let i = prev.length;
    loop:
      while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
    while (prev[++i]?.type === "space") {
    }
    return prev.splice(i, prev.length);
  }
  function fixFlowSeqItems(fc) {
    if (fc.start.type === "flow-seq-start") {
      for (const it of fc.items) {
        if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
          if (it.key)
            it.value = it.key;
          delete it.key;
          if (isFlowToken(it.value)) {
            if (it.value.end)
              Array.prototype.push.apply(it.value.end, it.sep);
            else
              it.value.end = it.sep;
          } else
            Array.prototype.push.apply(it.start, it.sep);
          delete it.sep;
        }
      }
    }
  }
  var Parser = class {
    /**
     * @param onNewLine - If defined, called separately with the start position of
     *   each new line (in `parse()`, including the start of input).
     */
    constructor(onNewLine) {
      this.atNewLine = true;
      this.atScalar = false;
      this.indent = 0;
      this.offset = 0;
      this.onKeyLine = false;
      this.stack = [];
      this.source = "";
      this.type = "";
      this.lexer = new Lexer();
      this.onNewLine = onNewLine;
    }
    /**
     * Parse `source` as a YAML stream.
     * If `incomplete`, a part of the last line may be left as a buffer for the next call.
     *
     * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
     *
     * @returns A generator of tokens representing each directive, document, and other structure.
     */
    *parse(source, incomplete = false) {
      if (this.onNewLine && this.offset === 0)
        this.onNewLine(0);
      for (const lexeme of this.lexer.lex(source, incomplete))
        yield* this.next(lexeme);
      if (!incomplete)
        yield* this.end();
    }
    /**
     * Advance the parser by the `source` of one lexical token.
     */
    *next(source) {
      this.source = source;
      if (this.atScalar) {
        this.atScalar = false;
        yield* this.step();
        this.offset += source.length;
        return;
      }
      const type = tokenType(source);
      if (!type) {
        const message = `Not a YAML token: ${source}`;
        yield* this.pop({ type: "error", offset: this.offset, message, source });
        this.offset += source.length;
      } else if (type === "scalar") {
        this.atNewLine = false;
        this.atScalar = true;
        this.type = "scalar";
      } else {
        this.type = type;
        yield* this.step();
        switch (type) {
          case "newline":
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine)
              this.onNewLine(this.offset + source.length);
            break;
          case "space":
            if (this.atNewLine && source[0] === " ")
              this.indent += source.length;
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            if (this.atNewLine)
              this.indent += source.length;
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = false;
        }
        this.offset += source.length;
      }
    }
    /** Call at end of input to push out any remaining constructions */
    *end() {
      while (this.stack.length > 0)
        yield* this.pop();
    }
    get sourceToken() {
      const st = {
        type: this.type,
        offset: this.offset,
        indent: this.indent,
        source: this.source
      };
      return st;
    }
    *step() {
      const top = this.peek(1);
      if (this.type === "doc-end" && (!top || top.type !== "doc-end")) {
        while (this.stack.length > 0)
          yield* this.pop();
        this.stack.push({
          type: "doc-end",
          offset: this.offset,
          source: this.source
        });
        return;
      }
      if (!top)
        return yield* this.stream();
      switch (top.type) {
        case "document":
          return yield* this.document(top);
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return yield* this.scalar(top);
        case "block-scalar":
          return yield* this.blockScalar(top);
        case "block-map":
          return yield* this.blockMap(top);
        case "block-seq":
          return yield* this.blockSequence(top);
        case "flow-collection":
          return yield* this.flowCollection(top);
        case "doc-end":
          return yield* this.documentEnd(top);
      }
      yield* this.pop();
    }
    peek(n) {
      return this.stack[this.stack.length - n];
    }
    *pop(error) {
      const token = error ?? this.stack.pop();
      if (!token) {
        const message = "Tried to pop an empty stack";
        yield { type: "error", offset: this.offset, source: "", message };
      } else if (this.stack.length === 0) {
        yield token;
      } else {
        const top = this.peek(1);
        if (token.type === "block-scalar") {
          token.indent = "indent" in top ? top.indent : 0;
        } else if (token.type === "flow-collection" && top.type === "document") {
          token.indent = 0;
        }
        if (token.type === "flow-collection")
          fixFlowSeqItems(token);
        switch (top.type) {
          case "document":
            top.value = token;
            break;
          case "block-scalar":
            top.props.push(token);
            break;
          case "block-map": {
            const it = top.items[top.items.length - 1];
            if (it.value) {
              top.items.push({ start: [], key: token, sep: [] });
              this.onKeyLine = true;
              return;
            } else if (it.sep) {
              it.value = token;
            } else {
              Object.assign(it, { key: token, sep: [] });
              this.onKeyLine = !includesToken(it.start, "explicit-key-ind");
              return;
            }
            break;
          }
          case "block-seq": {
            const it = top.items[top.items.length - 1];
            if (it.value)
              top.items.push({ start: [], value: token });
            else
              it.value = token;
            break;
          }
          case "flow-collection": {
            const it = top.items[top.items.length - 1];
            if (!it || it.value)
              top.items.push({ start: [], key: token, sep: [] });
            else if (it.sep)
              it.value = token;
            else
              Object.assign(it, { key: token, sep: [] });
            return;
          }
          default:
            yield* this.pop();
            yield* this.pop(token);
        }
        if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
          const last = token.items[token.items.length - 1];
          if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
            if (top.type === "document")
              top.end = last.start;
            else
              top.items.push({ start: last.start });
            token.items.splice(-1, 1);
          }
        }
      }
    }
    *stream() {
      switch (this.type) {
        case "directive-line":
          yield { type: "directive", offset: this.offset, source: this.source };
          return;
        case "byte-order-mark":
        case "space":
        case "comment":
        case "newline":
          yield this.sourceToken;
          return;
        case "doc-mode":
        case "doc-start": {
          const doc = {
            type: "document",
            offset: this.offset,
            start: []
          };
          if (this.type === "doc-start")
            doc.start.push(this.sourceToken);
          this.stack.push(doc);
          return;
        }
      }
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML stream`,
        source: this.source
      };
    }
    *document(doc) {
      if (doc.value)
        return yield* this.lineEnd(doc);
      switch (this.type) {
        case "doc-start": {
          if (findNonEmptyIndex(doc.start) !== -1) {
            yield* this.pop();
            yield* this.step();
          } else
            doc.start.push(this.sourceToken);
          return;
        }
        case "anchor":
        case "tag":
        case "space":
        case "comment":
        case "newline":
          doc.start.push(this.sourceToken);
          return;
      }
      const bv = this.startBlockValue(doc);
      if (bv)
        this.stack.push(bv);
      else {
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML document`,
          source: this.source
        };
      }
    }
    *scalar(scalar) {
      if (this.type === "map-value-ind") {
        const prev = getPrevProps(this.peek(2));
        const start = getFirstKeyStartProps(prev);
        let sep;
        if (scalar.end) {
          sep = scalar.end;
          sep.push(this.sourceToken);
          delete scalar.end;
        } else
          sep = [this.sourceToken];
        const map2 = {
          type: "block-map",
          offset: scalar.offset,
          indent: scalar.indent,
          items: [{ start, key: scalar, sep }]
        };
        this.onKeyLine = true;
        this.stack[this.stack.length - 1] = map2;
      } else
        yield* this.lineEnd(scalar);
    }
    *blockScalar(scalar) {
      switch (this.type) {
        case "space":
        case "comment":
        case "newline":
          scalar.props.push(this.sourceToken);
          return;
        case "scalar":
          scalar.source = this.source;
          this.atNewLine = true;
          this.indent = 0;
          if (this.onNewLine) {
            let nl = this.source.indexOf("\n") + 1;
            while (nl !== 0) {
              this.onNewLine(this.offset + nl);
              nl = this.source.indexOf("\n", nl) + 1;
            }
          }
          yield* this.pop();
          break;
        default:
          yield* this.pop();
          yield* this.step();
      }
    }
    *blockMap(map2) {
      const it = map2.items[map2.items.length - 1];
      switch (this.type) {
        case "newline":
          this.onKeyLine = false;
          if (it.value) {
            const end = "end" in it.value ? it.value.end : void 0;
            const last = Array.isArray(end) ? end[end.length - 1] : void 0;
            if (last?.type === "comment")
              end?.push(this.sourceToken);
            else
              map2.items.push({ start: [this.sourceToken] });
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            it.start.push(this.sourceToken);
          }
          return;
        case "space":
        case "comment":
          if (it.value) {
            map2.items.push({ start: [this.sourceToken] });
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            if (this.atIndentedComment(it.start, map2.indent)) {
              const prev = map2.items[map2.items.length - 2];
              const end = prev?.value?.end;
              if (Array.isArray(end)) {
                Array.prototype.push.apply(end, it.start);
                end.push(this.sourceToken);
                map2.items.pop();
                return;
              }
            }
            it.start.push(this.sourceToken);
          }
          return;
      }
      if (this.indent >= map2.indent) {
        const atNextItem = !this.onKeyLine && this.indent === map2.indent && it.sep;
        let start = [];
        if (atNextItem && it.sep && !it.value) {
          const nl = [];
          for (let i = 0; i < it.sep.length; ++i) {
            const st = it.sep[i];
            switch (st.type) {
              case "newline":
                nl.push(i);
                break;
              case "space":
                break;
              case "comment":
                if (st.indent > map2.indent)
                  nl.length = 0;
                break;
              default:
                nl.length = 0;
            }
          }
          if (nl.length >= 2)
            start = it.sep.splice(nl[1]);
        }
        switch (this.type) {
          case "anchor":
          case "tag":
            if (atNextItem || it.value) {
              start.push(this.sourceToken);
              map2.items.push({ start });
              this.onKeyLine = true;
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "explicit-key-ind":
            if (!it.sep && !includesToken(it.start, "explicit-key-ind")) {
              it.start.push(this.sourceToken);
            } else if (atNextItem || it.value) {
              start.push(this.sourceToken);
              map2.items.push({ start });
            } else {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [this.sourceToken] }]
              });
            }
            this.onKeyLine = true;
            return;
          case "map-value-ind":
            if (includesToken(it.start, "explicit-key-ind")) {
              if (!it.sep) {
                if (includesToken(it.start, "newline")) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else {
                  const start2 = getFirstKeyStartProps(it.start);
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                  });
                }
              } else if (it.value) {
                map2.items.push({ start: [], key: null, sep: [this.sourceToken] });
              } else if (includesToken(it.sep, "map-value-ind")) {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start, key: null, sep: [this.sourceToken] }]
                });
              } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                const start2 = getFirstKeyStartProps(it.start);
                const key = it.key;
                const sep = it.sep;
                sep.push(this.sourceToken);
                delete it.key, delete it.sep;
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: start2, key, sep }]
                });
              } else if (start.length > 0) {
                it.sep = it.sep.concat(start, this.sourceToken);
              } else {
                it.sep.push(this.sourceToken);
              }
            } else {
              if (!it.sep) {
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              } else if (it.value || atNextItem) {
                map2.items.push({ start, key: null, sep: [this.sourceToken] });
              } else if (includesToken(it.sep, "map-value-ind")) {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [], key: null, sep: [this.sourceToken] }]
                });
              } else {
                it.sep.push(this.sourceToken);
              }
            }
            this.onKeyLine = true;
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            const fs = this.flowScalar(this.type);
            if (atNextItem || it.value) {
              map2.items.push({ start, key: fs, sep: [] });
              this.onKeyLine = true;
            } else if (it.sep) {
              this.stack.push(fs);
            } else {
              Object.assign(it, { key: fs, sep: [] });
              this.onKeyLine = true;
            }
            return;
          }
          default: {
            const bv = this.startBlockValue(map2);
            if (bv) {
              if (atNextItem && bv.type !== "block-seq" && includesToken(it.start, "explicit-key-ind")) {
                map2.items.push({ start });
              }
              this.stack.push(bv);
              return;
            }
          }
        }
      }
      yield* this.pop();
      yield* this.step();
    }
    *blockSequence(seq2) {
      const it = seq2.items[seq2.items.length - 1];
      switch (this.type) {
        case "newline":
          if (it.value) {
            const end = "end" in it.value ? it.value.end : void 0;
            const last = Array.isArray(end) ? end[end.length - 1] : void 0;
            if (last?.type === "comment")
              end?.push(this.sourceToken);
            else
              seq2.items.push({ start: [this.sourceToken] });
          } else
            it.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (it.value)
            seq2.items.push({ start: [this.sourceToken] });
          else {
            if (this.atIndentedComment(it.start, seq2.indent)) {
              const prev = seq2.items[seq2.items.length - 2];
              const end = prev?.value?.end;
              if (Array.isArray(end)) {
                Array.prototype.push.apply(end, it.start);
                end.push(this.sourceToken);
                seq2.items.pop();
                return;
              }
            }
            it.start.push(this.sourceToken);
          }
          return;
        case "anchor":
        case "tag":
          if (it.value || this.indent <= seq2.indent)
            break;
          it.start.push(this.sourceToken);
          return;
        case "seq-item-ind":
          if (this.indent !== seq2.indent)
            break;
          if (it.value || includesToken(it.start, "seq-item-ind"))
            seq2.items.push({ start: [this.sourceToken] });
          else
            it.start.push(this.sourceToken);
          return;
      }
      if (this.indent > seq2.indent) {
        const bv = this.startBlockValue(seq2);
        if (bv) {
          this.stack.push(bv);
          return;
        }
      }
      yield* this.pop();
      yield* this.step();
    }
    *flowCollection(fc) {
      const it = fc.items[fc.items.length - 1];
      if (this.type === "flow-error-end") {
        let top;
        do {
          yield* this.pop();
          top = this.peek(1);
        } while (top && top.type === "flow-collection");
      } else if (fc.end.length === 0) {
        switch (this.type) {
          case "comma":
          case "explicit-key-ind":
            if (!it || it.sep)
              fc.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
          case "map-value-ind":
            if (!it || it.value)
              fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              Object.assign(it, { key: null, sep: [this.sourceToken] });
            return;
          case "space":
          case "comment":
          case "newline":
          case "anchor":
          case "tag":
            if (!it || it.value)
              fc.items.push({ start: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              it.start.push(this.sourceToken);
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            const fs = this.flowScalar(this.type);
            if (!it || it.value)
              fc.items.push({ start: [], key: fs, sep: [] });
            else if (it.sep)
              this.stack.push(fs);
            else
              Object.assign(it, { key: fs, sep: [] });
            return;
          }
          case "flow-map-end":
          case "flow-seq-end":
            fc.end.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(fc);
        if (bv)
          this.stack.push(bv);
        else {
          yield* this.pop();
          yield* this.step();
        }
      } else {
        const parent = this.peek(2);
        if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
          yield* this.pop();
          yield* this.step();
        } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          fixFlowSeqItems(fc);
          const sep = fc.end.splice(1, fc.end.length);
          sep.push(this.sourceToken);
          const map2 = {
            type: "block-map",
            offset: fc.offset,
            indent: fc.indent,
            items: [{ start, key: fc, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map2;
        } else {
          yield* this.lineEnd(fc);
        }
      }
    }
    flowScalar(type) {
      if (this.onNewLine) {
        let nl = this.source.indexOf("\n") + 1;
        while (nl !== 0) {
          this.onNewLine(this.offset + nl);
          nl = this.source.indexOf("\n", nl) + 1;
        }
      }
      return {
        type,
        offset: this.offset,
        indent: this.indent,
        source: this.source
      };
    }
    startBlockValue(parent) {
      switch (this.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return this.flowScalar(this.type);
        case "block-scalar-header":
          return {
            type: "block-scalar",
            offset: this.offset,
            indent: this.indent,
            props: [this.sourceToken],
            source: ""
          };
        case "flow-map-start":
        case "flow-seq-start":
          return {
            type: "flow-collection",
            offset: this.offset,
            indent: this.indent,
            start: this.sourceToken,
            items: [],
            end: []
          };
        case "seq-item-ind":
          return {
            type: "block-seq",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken] }]
          };
        case "explicit-key-ind": {
          this.onKeyLine = true;
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          start.push(this.sourceToken);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start }]
          };
        }
        case "map-value-ind": {
          this.onKeyLine = true;
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start, key: null, sep: [this.sourceToken] }]
          };
        }
      }
      return null;
    }
    atIndentedComment(start, indent) {
      if (this.type !== "comment")
        return false;
      if (this.indent <= indent)
        return false;
      return start.every((st) => st.type === "newline" || st.type === "space");
    }
    *documentEnd(docEnd) {
      if (this.type !== "doc-mode") {
        if (docEnd.end)
          docEnd.end.push(this.sourceToken);
        else
          docEnd.end = [this.sourceToken];
        if (this.type === "newline")
          yield* this.pop();
      }
    }
    *lineEnd(token) {
      switch (this.type) {
        case "comma":
        case "doc-start":
        case "doc-end":
        case "flow-seq-end":
        case "flow-map-end":
        case "map-value-ind":
          yield* this.pop();
          yield* this.step();
          break;
        case "newline":
          this.onKeyLine = false;
        case "space":
        case "comment":
        default:
          if (token.end)
            token.end.push(this.sourceToken);
          else
            token.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
      }
    }
  };

  // node_modules/yaml/browser/dist/public-api.js
  function parseOptions(options) {
    const prettyErrors = options.prettyErrors !== false;
    const lineCounter = options.lineCounter || prettyErrors && new LineCounter() || null;
    return { lineCounter, prettyErrors };
  }
  function parseAllDocuments(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser = new Parser(lineCounter?.addNewLine);
    const composer = new Composer(options);
    const docs = Array.from(composer.compose(parser.parse(source)));
    if (prettyErrors && lineCounter)
      for (const doc of docs) {
        doc.errors.forEach(prettifyError(source, lineCounter));
        doc.warnings.forEach(prettifyError(source, lineCounter));
      }
    if (docs.length > 0)
      return docs;
    return Object.assign([], { empty: true }, composer.streamInfo());
  }
  function parseDocument(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser = new Parser(lineCounter?.addNewLine);
    const composer = new Composer(options);
    let doc = null;
    for (const _doc of composer.compose(parser.parse(source), true, source.length)) {
      if (!doc)
        doc = _doc;
      else if (doc.options.logLevel !== "silent") {
        doc.errors.push(new YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
        break;
      }
    }
    if (prettyErrors && lineCounter) {
      doc.errors.forEach(prettifyError(source, lineCounter));
      doc.warnings.forEach(prettifyError(source, lineCounter));
    }
    return doc;
  }
  function parse(src, reviver, options) {
    let _reviver = void 0;
    if (typeof reviver === "function") {
      _reviver = reviver;
    } else if (options === void 0 && reviver && typeof reviver === "object") {
      options = reviver;
    }
    const doc = parseDocument(src, options);
    if (!doc)
      return null;
    doc.warnings.forEach((warning) => warn(doc.options.logLevel, warning));
    if (doc.errors.length > 0) {
      if (doc.options.logLevel !== "silent")
        throw doc.errors[0];
      else
        doc.errors = [];
    }
    return doc.toJS(Object.assign({ reviver: _reviver }, options));
  }
  function stringify3(value, replacer, options) {
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer)) {
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
    }
    if (typeof options === "string")
      options = options.length;
    if (typeof options === "number") {
      const indent = Math.round(options);
      options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
    }
    if (value === void 0) {
      const { keepUndefined } = options ?? replacer ?? {};
      if (!keepUndefined)
        return void 0;
    }
    return new Document(value, _replacer, options).toString(options);
  }

  // node_modules/yaml/browser/index.js
  var browser_default = dist_exports;

  // src/docUtils/capitalizeFirstLetter.ts
  function capitalizeFirstLetter(string2) {
    return string2.charAt(0).toUpperCase() + string2.slice(1);
  }

  // src/stardewMode/index.ts
  async function getCharacterData(characterName) {
    const charDataRaw = await fetch(`dialog/${characterName}/character.yaml`).then((response) => {
      if (!response.ok) {
        console.error("Could not load character data for " + characterName);
        throw new Error("HTTP error " + response.status);
      }
      return response.text();
    });
    return browser_default.parse(charDataRaw);
  }
  function invokeStardew(characterData) {
    const [pronoun, _obj, _poss] = getPronouns(characterData.gender.toLowerCase());
    return `${characterData.name} is a ${characterData.gender.toLowerCase()} ${characterData.age} year old ${characterData.occupation.toLowerCase()}.  ${capitalizeFirstLetter(pronoun)} talks in a ${joinWithAnd(
      characterData.speech_style
    ).toLowerCase()}.  ${capitalizeFirstLetter(pronoun)} likes ${joinWithAnd(
      characterData.likes
    ).toLowerCase()}.  ${capitalizeFirstLetter(pronoun)} dislikes ${joinWithAnd(characterData.dislikes).toLowerCase()}.`;
  }
  function joinWithAnd(arr) {
    if (arr.length === 1)
      return arr[0];
    const firsts = arr.slice(0, arr.length - 1);
    const last = arr[arr.length - 1];
    return firsts.join(", ") + " and " + last;
  }
  function getPronouns(gender) {
    if (gender == "male") {
      return ["he", "him", "his"];
    }
    if (gender == "female") {
      return ["she", "her", "hers"];
    }
    return ["they", "them", "theirs"];
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
  PluginManager.registerCommand("pixelmapYarnSpinner", "stardew", stardewCaller);
  async function stardewCaller(args) {
    const characterData = await getCharacterData(args["Character Name"]);
    invokeStardew(characterData);
  }
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
