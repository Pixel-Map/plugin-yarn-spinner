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
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/yarn-bound/dist/yarn-bound.js
  var require_yarn_bound = __commonJS({
    "node_modules/yarn-bound/dist/yarn-bound.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define([], factory);
        else if (typeof exports === "object")
          exports["YarnBound"] = factory();
        else
          root["YarnBound"] = factory();
      })(exports, function() {
        return (() => {
          "use strict";
          var __webpack_modules__ = {
            144: (module2, exports2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = convertYarnToJS;
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
                    obj.body += "".concat(lines[i].replace(leadingSpace, ""), "\n");
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
                        throw new Error("Duplicate tag on node: ".concat(trimmedKey));
                      }
                      obj[trimmedKey] = trimmedValue;
                    }
                  }
                }
                return objects;
              }
              module2.exports = exports2.default;
            },
            131: (module2, exports2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              class DefaultVariableStorage {
                constructor() {
                  this.data = {};
                }
                set(name, value) {
                  this.data[name] = value;
                }
                get(name) {
                  return this.data[name];
                }
              }
              var _default = DefaultVariableStorage;
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            167: (module2, exports2, __webpack_require__2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              var _runner = _interopRequireDefault(__webpack_require__2(159));
              var _results = _interopRequireDefault(__webpack_require__2(34));
              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }
              _runner.default.OptionsResult = _results.default.OptionsResult;
              _runner.default.TextResult = _results.default.TextResult;
              _runner.default.CommandResult = _results.default.CommandResult;
              var _default = _runner.default;
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            367: (module2, exports2, __webpack_require__2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              var _tokens = _interopRequireDefault(__webpack_require__2(197));
              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }
              class LexerState {
                constructor() {
                  this.transitions = [];
                  this.textRule = null;
                  this.isTrackingNextIndentation = false;
                }
                addTransition(token, state, delimitsText) {
                  this.transitions.push({
                    token,
                    regex: _tokens.default[token],
                    state: state || null,
                    delimitsText: delimitsText || false
                  });
                  return this;
                }
                addTextRule(type, state) {
                  if (this.textRule) {
                    throw new Error("Cannot add more than one text rule to a state.");
                  }
                  const rules = [];
                  this.transitions.forEach((transition) => {
                    if (transition.delimitsText) {
                      rules.push("(".concat(transition.regex.source, ")"));
                    }
                  });
                  const textPattern = "((?!".concat(rules.join("|"), ").)+");
                  this.addTransition(type, state);
                  this.textRule = this.transitions[this.transitions.length - 1];
                  this.textRule.regex = new RegExp(textPattern);
                  return this;
                }
                setTrackNextIndentation(track) {
                  this.isTrackingNextIndentation = track;
                  return this;
                }
              }
              var _default = LexerState;
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            525: (module2, exports2, __webpack_require__2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              var _states = _interopRequireDefault(__webpack_require__2(404));
              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }
              class Lexer {
                constructor() {
                  this.states = _states.default.makeStates();
                  this.state = "base";
                  this.originalText = "";
                  this.lines = [];
                  this.indentation = [[0, false]];
                  this.shouldTrackNextIndentation = false;
                  this.previousLevelOfIndentation = 0;
                  this.reset();
                }
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
                        if (this.shouldTrackNextIndentation) {
                          if (this.getLastRecordedIndentation()[0] < thisIndentation) {
                            this.indentation.push([thisIndentation, false]);
                          }
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
                  throw new Error("Invalid syntax in: ".concat(this.getCurrentLine()));
                }
                setState(state) {
                  if (this.states[state] === void 0) {
                    throw new Error("Cannot set the unknown state [".concat(state, "]"));
                  }
                  this.state = state;
                  if (this.getState().isTrackingNextIndentation) {
                    this.shouldTrackNextIndentation = true;
                  }
                }
                setInput(text) {
                  this.originalText = text.replace(/(\r\n)/g, "\n").replace(/\r/g, "\n").replace(/[\n\r]+$/, "");
                  this.lines = this.originalText.split("\n");
                  this.reset();
                }
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
                isAtTheEndOfText() {
                  return this.isAtTheEndOfLine() && this.yylloc.first_line >= this.lines.length;
                }
                isAtTheEndOfLine() {
                  return this.yylloc.last_column > this.getCurrentLine().length;
                }
              }
              var _default = Lexer;
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            404: (module2, exports2, __webpack_require__2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              var _lexerState = _interopRequireDefault(__webpack_require__2(367));
              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }
              function makeStates() {
                return {
                  base: new _lexerState.default().addTransition("EscapedCharacter", null, true).addTransition("Comment", null, true).addTransition("Hashtag", null, true).addTransition("BeginCommand", "command", true).addTransition("BeginInlineExp", "inlineExpression", true).addTransition("ShortcutOption", "shortcutOption").addTextRule("Text"),
                  shortcutOption: new _lexerState.default().setTrackNextIndentation(true).addTransition("EscapedCharacter", null, true).addTransition("Comment", null, true).addTransition("Hashtag", null, true).addTransition("BeginCommand", "expression", true).addTransition("BeginInlineExp", "inlineExpressionInShortcut", true).addTextRule("Text", "base"),
                  command: new _lexerState.default().addTransition("If", "expression").addTransition("Else").addTransition("ElseIf", "expression").addTransition("EndIf").addTransition("Set", "assignment").addTransition("Declare", "declare").addTransition("Jump", "jump").addTransition("Stop", "stop").addTransition("BeginInlineExp", "inlineExpressionInCommand", true).addTransition("EndCommand", "base", true).addTextRule("Text"),
                  commandArg: new _lexerState.default().addTextRule("Text"),
                  commandParenArgOrExpression: new _lexerState.default().addTransition("EndCommand", "base", true).addTransition("LeftParen", "expression").addTransition("Variable", "expression").addTransition("Number", "expression").addTransition("String").addTransition("True").addTransition("False").addTransition("Null").addTransition("RightParen"),
                  assignment: new _lexerState.default().addTransition("Variable").addTransition("EqualToOrAssign", "expression"),
                  declare: new _lexerState.default().addTransition("Variable").addTransition("EndCommand", "base").addTransition("EqualToOrAssign", "expression"),
                  jump: new _lexerState.default().addTransition("Identifier").addTransition("BeginInlineExp", "inlineExpressionInCommand", true).addTransition("EndCommand", "base", true),
                  stop: new _lexerState.default().addTransition("EndCommand", "base", true),
                  expression: new _lexerState.default().addTransition("As").addTransition("ExplicitType").addTransition("EndCommand", "base").addTransition("Number").addTransition("String").addTransition("LeftParen").addTransition("RightParen").addTransition("EqualTo").addTransition("EqualToOrAssign").addTransition("NotEqualTo").addTransition("GreaterThanOrEqualTo").addTransition("GreaterThan").addTransition("LessThanOrEqualTo").addTransition("LessThan").addTransition("Add").addTransition("UnaryMinus").addTransition("Minus").addTransition("Exponent").addTransition("Multiply").addTransition("Divide").addTransition("Modulo").addTransition("And").addTransition("Or").addTransition("Xor").addTransition("Not").addTransition("Variable").addTransition("Comma").addTransition("True").addTransition("False").addTransition("Null").addTransition("Identifier").addTextRule(),
                  inlineExpression: new _lexerState.default().addTransition("EndInlineExp", "base").addTransition("Number").addTransition("String").addTransition("LeftParen").addTransition("RightParen").addTransition("EqualTo").addTransition("EqualToOrAssign").addTransition("NotEqualTo").addTransition("GreaterThanOrEqualTo").addTransition("GreaterThan").addTransition("LessThanOrEqualTo").addTransition("LessThan").addTransition("Add").addTransition("UnaryMinus").addTransition("Minus").addTransition("Exponent").addTransition("Multiply").addTransition("Divide").addTransition("Modulo").addTransition("And").addTransition("Or").addTransition("Xor").addTransition("Not").addTransition("Variable").addTransition("Comma").addTransition("True").addTransition("False").addTransition("Null").addTransition("Identifier").addTextRule("Text", "base"),
                  inlineExpressionInCommand: new _lexerState.default().addTransition("EndInlineExp", "command").addTransition("Number").addTransition("String").addTransition("LeftParen").addTransition("RightParen").addTransition("EqualTo").addTransition("EqualToOrAssign").addTransition("NotEqualTo").addTransition("GreaterThanOrEqualTo").addTransition("GreaterThan").addTransition("LessThanOrEqualTo").addTransition("LessThan").addTransition("Add").addTransition("UnaryMinus").addTransition("Minus").addTransition("Exponent").addTransition("Multiply").addTransition("Divide").addTransition("Modulo").addTransition("And").addTransition("Or").addTransition("Xor").addTransition("Not").addTransition("Variable").addTransition("Comma").addTransition("True").addTransition("False").addTransition("Null").addTransition("Identifier").addTextRule("Text", "base"),
                  inlineExpressionInShortcut: new _lexerState.default().addTransition("EndInlineExp", "shortcutOption").addTransition("Number").addTransition("String").addTransition("LeftParen").addTransition("RightParen").addTransition("EqualTo").addTransition("EqualToOrAssign").addTransition("NotEqualTo").addTransition("GreaterThanOrEqualTo").addTransition("GreaterThan").addTransition("LessThanOrEqualTo").addTransition("LessThan").addTransition("Add").addTransition("UnaryMinus").addTransition("Minus").addTransition("Exponent").addTransition("Multiply").addTransition("Divide").addTransition("Modulo").addTransition("And").addTransition("Or").addTransition("Xor").addTransition("Not").addTransition("Variable").addTransition("Comma").addTransition("True").addTransition("False").addTransition("Null").addTransition("Identifier").addTextRule("Text", "base")
                };
              }
              var _default = {
                makeStates
              };
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            197: (module2, exports2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              const Tokens = {
                Whitespace: null,
                Indent: null,
                Dedent: null,
                EndOfLine: /\n/,
                EndOfInput: null,
                Number: /-?[0-9]+(\.[0-9+])?/,
                String: /"([^"\\]*(?:\\.[^"\\]*)*)"/,
                BeginCommand: /<</,
                EndCommand: />>/,
                Variable: /\$([A-Za-z0-9_.])+/,
                ShortcutOption: /->/,
                Hashtag: /#([^(\s|#|//)]+)/,
                Comment: /\/\/.*/,
                OptionStart: /\[\[/,
                OptionDelimit: /\|/,
                OptionEnd: /\]\]/,
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
                True: /true(?!\w)/,
                False: /false(?!\w)/,
                Null: /null(?!\w)/,
                LeftParen: /\(/,
                RightParen: /\)/,
                Comma: /,/,
                UnaryMinus: /-(?!\s)/,
                EqualTo: /(==|is(?!\w)|eq(?!\w))/,
                GreaterThan: /(>|gt(?!\w))/,
                GreaterThanOrEqualTo: /(>=|gte(?!\w))/,
                LessThan: /(<|lt(?!\w))/,
                LessThanOrEqualTo: /(<=|lte(?!\w))/,
                NotEqualTo: /(!=|neq(?!\w))/,
                Or: /(\|\||or(?!\w))/,
                And: /(&&|and(?!\w))/,
                Xor: /(\^|xor(?!\w))/,
                Not: /(!|not(?!\w))/,
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
                BeginInlineExp: /{/,
                EndInlineExp: /}/
              };
              var _default = Tokens;
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            348: (__unused_webpack_module, exports2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2.Parser = Parser;
              exports2.parser = void 0;
              function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                  var symbols = Object.getOwnPropertySymbols(object);
                  enumerableOnly && (symbols = symbols.filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                  })), keys.push.apply(keys, symbols);
                }
                return keys;
              }
              function _objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                  var source = null != arguments[i] ? arguments[i] : {};
                  i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
                    _defineProperty(target, key, source[key]);
                  }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                  });
                }
                return target;
              }
              function _defineProperty(obj, key, value) {
                if (key in obj) {
                  Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
                } else {
                  obj[key] = value;
                }
                return obj;
              }
              var o = function o2(k, v, _o, l) {
                for (_o = _o || {}, l = k.length; l--; _o[k[l]] = v)
                  ;
                return _o;
              }, $V0 = [1, 16], $V1 = [1, 17], $V2 = [1, 12], $V3 = [1, 19], $V4 = [1, 18], $V5 = [5, 18, 19, 23, 34, 36, 77], $V6 = [1, 23], $V7 = [1, 24], $V8 = [1, 26], $V9 = [1, 27], $Va = [5, 14, 16, 18, 19, 21, 23, 34, 36, 77], $Vb = [1, 30], $Vc = [1, 34], $Vd = [1, 35], $Ve = [1, 36], $Vf = [1, 37], $Vg = [5, 14, 16, 18, 19, 21, 23, 26, 34, 36, 77], $Vh = [1, 50], $Vi = [1, 49], $Vj = [1, 44], $Vk = [1, 45], $Vl = [1, 46], $Vm = [1, 51], $Vn = [1, 52], $Vo = [1, 53], $Vp = [1, 54], $Vq = [1, 55], $Vr = [5, 16, 18, 19, 23, 34, 36, 77], $Vs = [1, 71], $Vt = [1, 72], $Vu = [1, 73], $Vv = [1, 74], $Vw = [1, 75], $Vx = [1, 76], $Vy = [1, 77], $Vz = [1, 78], $VA = [1, 79], $VB = [1, 80], $VC = [1, 81], $VD = [1, 82], $VE = [1, 83], $VF = [1, 84], $VG = [1, 85], $VH = [26, 46, 51, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78], $VI = [26, 46, 51, 53, 54, 55, 56, 57, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78], $VJ = [26, 46, 51, 70, 78], $VK = [1, 122], $VL = [1, 123], $VM = [26, 46, 51, 53, 54, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78], $VN = [26, 46, 51, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78], $VO = [51, 70], $VP = [16, 18, 19, 23, 34, 77];
              var parser = {
                trace: function trace() {
                },
                yy: {},
                symbols_: {
                  "error": 2,
                  "node": 3,
                  "statements": 4,
                  "EndOfInput": 5,
                  "conditionalBlock": 6,
                  "statement": 7,
                  "text": 8,
                  "shortcut": 9,
                  "genericCommand": 10,
                  "assignmentCommand": 11,
                  "jumpCommand": 12,
                  "stopCommand": 13,
                  "Comment": 14,
                  "hashtags": 15,
                  "EndOfLine": 16,
                  "textNode": 17,
                  "Text": 18,
                  "EscapedCharacter": 19,
                  "inlineExpression": 20,
                  "Hashtag": 21,
                  "conditional": 22,
                  "BeginCommand": 23,
                  "If": 24,
                  "expression": 25,
                  "EndCommand": 26,
                  "EndIf": 27,
                  "additionalConditionalBlocks": 28,
                  "else": 29,
                  "Else": 30,
                  "elseif": 31,
                  "ElseIf": 32,
                  "shortcutOption": 33,
                  "ShortcutOption": 34,
                  "Indent": 35,
                  "Dedent": 36,
                  "Jump": 37,
                  "Identifier": 38,
                  "Stop": 39,
                  "setCommandInner": 40,
                  "declareCommandInner": 41,
                  "Set": 42,
                  "Variable": 43,
                  "EqualToOrAssign": 44,
                  "Declare": 45,
                  "As": 46,
                  "ExplicitType": 47,
                  "functionArgument": 48,
                  "functionCall": 49,
                  "LeftParen": 50,
                  "RightParen": 51,
                  "UnaryMinus": 52,
                  "Add": 53,
                  "Minus": 54,
                  "Exponent": 55,
                  "Multiply": 56,
                  "Divide": 57,
                  "Modulo": 58,
                  "Not": 59,
                  "Or": 60,
                  "And": 61,
                  "Xor": 62,
                  "EqualTo": 63,
                  "NotEqualTo": 64,
                  "GreaterThan": 65,
                  "GreaterThanOrEqualTo": 66,
                  "LessThan": 67,
                  "LessThanOrEqualTo": 68,
                  "parenExpressionArgs": 69,
                  "Comma": 70,
                  "literal": 71,
                  "True": 72,
                  "False": 73,
                  "Number": 74,
                  "String": 75,
                  "Null": 76,
                  "BeginInlineExp": 77,
                  "EndInlineExp": 78,
                  "$accept": 0,
                  "$end": 1
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
                productions_: [0, [3, 2], [4, 1], [4, 2], [4, 1], [4, 2], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 2], [7, 2], [7, 2], [17, 1], [17, 1], [8, 1], [8, 1], [8, 2], [15, 1], [15, 2], [22, 4], [6, 6], [6, 4], [6, 2], [29, 3], [29, 2], [31, 4], [31, 2], [28, 5], [28, 5], [28, 3], [33, 2], [33, 3], [33, 2], [33, 2], [33, 3], [33, 2], [9, 1], [9, 5], [10, 3], [12, 4], [12, 4], [13, 3], [11, 3], [11, 3], [40, 4], [41, 4], [41, 6], [25, 1], [25, 1], [25, 3], [25, 2], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 2], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [49, 3], [49, 4], [69, 3], [69, 1], [48, 1], [48, 1], [48, 1], [71, 1], [71, 1], [71, 1], [71, 1], [71, 1], [20, 3]],
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
                      this.$ = $$[$0 - 1].map((s) => Object.assign(s, {
                        hashtags: $$[$0]
                      }));
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
                      this.$ = {
                        text: $$[$0]
                      };
                      break;
                    case 34:
                      this.$ = {
                        text: $$[$0 - 1],
                        conditional: $$[$0]
                      };
                      break;
                    case 35:
                      this.$ = _objectSpread(_objectSpread({}, $$[$0 - 1]), {}, {
                        hashtags: $$[$0]
                      });
                      break;
                    case 37:
                      this.$ = _objectSpread(_objectSpread({}, $$[$0 - 2]), {}, {
                        hashtags: $$[$0 - 1]
                      });
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
                table: [{
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
                }, {
                  1: [3]
                }, {
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
                }, o($V5, [2, 2], {
                  16: $V6
                }), o($V5, [2, 4], {
                  15: 25,
                  14: $V7,
                  16: $V8,
                  21: $V9
                }), {
                  16: [1, 28]
                }, o([5, 14, 16, 21, 23, 34, 36], [2, 6], {
                  17: 13,
                  20: 14,
                  8: 29,
                  18: $V0,
                  19: $V1,
                  77: $V4
                }), o($Va, [2, 7]), o($Va, [2, 8]), o($Va, [2, 9]), o($Va, [2, 10]), o($Va, [2, 11]), {
                  8: 31,
                  17: 13,
                  18: $V0,
                  19: $V1,
                  20: 14,
                  24: $Vb,
                  37: $Vc,
                  39: $Vd,
                  40: 32,
                  41: 33,
                  42: $Ve,
                  45: $Vf,
                  77: $V4
                }, o($Vg, [2, 17]), o($Vg, [2, 18]), o($V5, [2, 39], {
                  15: 39,
                  14: [1, 40],
                  16: [1, 38],
                  21: $V9
                }), o($Vg, [2, 15]), o($Vg, [2, 16]), {
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
                }, {
                  8: 56,
                  17: 13,
                  18: $V0,
                  19: $V1,
                  20: 14,
                  77: $V4
                }, {
                  1: [2, 1]
                }, o($V5, [2, 3], {
                  16: $V6
                }), o($V5, [2, 5], {
                  15: 25,
                  14: $V7,
                  16: $V8,
                  21: $V9
                }), o($Vr, [2, 25]), o($Va, [2, 12]), o($Va, [2, 13]), o($Va, [2, 14]), o([5, 14, 16, 18, 19, 23, 34, 36, 77], [2, 20], {
                  15: 57,
                  21: $V9
                }), {
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
                }, o([5, 14, 16, 21, 23, 26, 34, 36], [2, 19], {
                  17: 13,
                  20: 14,
                  8: 29,
                  18: $V0,
                  19: $V1,
                  77: $V4
                }), {
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
                }, {
                  8: 29,
                  17: 13,
                  18: $V0,
                  19: $V1,
                  20: 14,
                  26: [1, 60],
                  77: $V4
                }, {
                  26: [1, 61]
                }, {
                  26: [1, 62]
                }, {
                  20: 64,
                  38: [1, 63],
                  77: $V4
                }, {
                  26: [1, 65]
                }, {
                  43: [1, 66]
                }, {
                  43: [1, 67]
                }, o($Va, [2, 38], {
                  35: [1, 68]
                }), o([5, 16, 18, 19, 21, 23, 34, 36, 77], [2, 35], {
                  14: [1, 69]
                }), o($Va, [2, 36]), {
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
                }, o($VH, [2, 50]), o($VH, [2, 51]), {
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
                }, {
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
                }, {
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
                }, o($VH, [2, 74]), o($VH, [2, 75]), o($VH, [2, 76]), {
                  50: [1, 89]
                }, o($VH, [2, 77]), o($VH, [2, 78]), o($VH, [2, 79]), o($VH, [2, 80]), o($VH, [2, 81]), o([5, 14, 16, 21, 34, 36], [2, 33], {
                  17: 13,
                  20: 14,
                  8: 29,
                  22: 90,
                  18: $V0,
                  19: $V1,
                  23: [1, 91],
                  77: $V4
                }), o($Va, [2, 21]), {
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
                }, {
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
                }, o($Va, [2, 41]), o($Va, [2, 45]), o($Va, [2, 46]), {
                  26: [1, 97]
                }, {
                  26: [1, 98]
                }, o($Va, [2, 44]), {
                  44: [1, 99]
                }, {
                  44: [1, 100]
                }, {
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
                }, o($Va, [2, 37]), o([5, 14, 16, 18, 19, 21, 23, 26, 34, 36, 46, 51, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 77, 78], [2, 82]), {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, {
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
                }, o($VI, [2, 53], {
                  58: $Vx
                }), o($VJ, [2, 60], {
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
                }), {
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
                }, o($Va, [2, 34]), {
                  24: $Vb
                }, {
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
                }, o($Vr, [2, 24]), {
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
                }, {
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
                }, o($Va, [2, 22]), o($Va, [2, 42]), o($Va, [2, 43]), {
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
                }, {
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
                }, {
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
                }, o($VM, [2, 54], {
                  55: $Vu,
                  56: $Vv,
                  57: $Vw,
                  58: $Vx
                }), o($VM, [2, 55], {
                  55: $Vu,
                  56: $Vv,
                  57: $Vw,
                  58: $Vx
                }), o($VI, [2, 56], {
                  58: $Vx
                }), o($VI, [2, 57], {
                  58: $Vx
                }), o($VI, [2, 58], {
                  58: $Vx
                }), o($VJ, [2, 59], {
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
                }), o([26, 46, 51, 60, 70, 78], [2, 61], {
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
                }), o([26, 46, 51, 60, 61, 70, 78], [2, 62], {
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
                }), o([26, 46, 51, 60, 61, 62, 70, 78], [2, 63], {
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
                }), o($VN, [2, 64], {
                  53: $Vs,
                  54: $Vt,
                  55: $Vu,
                  56: $Vv,
                  57: $Vw,
                  58: $Vx
                }), o($VN, [2, 65], {
                  53: $Vs,
                  54: $Vt,
                  55: $Vu,
                  56: $Vv,
                  57: $Vw,
                  58: $Vx
                }), o($VN, [2, 66], {
                  53: $Vs,
                  54: $Vt,
                  55: $Vu,
                  56: $Vv,
                  57: $Vw,
                  58: $Vx
                }), o($VN, [2, 67], {
                  53: $Vs,
                  54: $Vt,
                  55: $Vu,
                  56: $Vv,
                  57: $Vw,
                  58: $Vx
                }), o($VN, [2, 68], {
                  53: $Vs,
                  54: $Vt,
                  55: $Vu,
                  56: $Vv,
                  57: $Vw,
                  58: $Vx
                }), o($VN, [2, 69], {
                  53: $Vs,
                  54: $Vt,
                  55: $Vu,
                  56: $Vv,
                  57: $Vw,
                  58: $Vx
                }), o($VH, [2, 52]), o($VH, [2, 70]), {
                  51: [1, 131],
                  70: [1, 132]
                }, o($VO, [2, 73], {
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
                }), {
                  26: [1, 133]
                }, {
                  26: [1, 134]
                }, {
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
                }, {
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
                }, o($VP, [2, 27]), {
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
                }, o($VP, [2, 29]), {
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
                }, {
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
                }, o($Va, [2, 40]), o($VH, [2, 71]), {
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
                }, o($Vr, [2, 23]), o($VP, [2, 26]), {
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
                }, {
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
                }, {
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
                }, o($Vr, [2, 32]), {
                  47: [1, 144]
                }, o($VO, [2, 72], {
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
                }), o($VP, [2, 28]), {
                  26: [1, 145]
                }, {
                  26: [1, 146]
                }, {
                  26: [2, 49]
                }, o($Vr, [2, 30]), o($Vr, [2, 31])],
                defaultActions: {
                  20: [2, 1],
                  144: [2, 49]
                },
                parseError: function parseError(str, hash) {
                  if (hash.recoverable) {
                    this.trace(str);
                  } else {
                    var error = new Error(str);
                    error.hash = hash;
                    throw error;
                  }
                },
                parse: function parse(input) {
                  var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
                  var args = lstack.slice.call(arguments, 1);
                  var lexer = Object.create(this.lexer);
                  var sharedState = {
                    yy: {}
                  };
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
                    var lex = function lex2() {
                      var token;
                      token = lexer.lex() || EOF;
                      if (typeof token !== "number") {
                        token = self.symbols_[token] || token;
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
              exports2.parser = parser;
              function Parser() {
                this.yy = {};
              }
              ;
              Parser.prototype = parser;
              parser.Parser = Parser;
            },
            748: (module2, exports2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              class Text {
              }
              class Shortcut {
              }
              class Conditional {
              }
              class Assignment {
              }
              class Literal {
              }
              class Expression {
              }
              class FunctionCall {
              }
              class Command {
              }
              var _default = {
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
                DialogShortcutNode: class extends Shortcut {
                  constructor(text, content, lineNo) {
                    let hashtags = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : [];
                    let conditionalExpression = arguments.length > 4 ? arguments[4] : void 0;
                    super();
                    this.type = "DialogShortcutNode";
                    this.text = text;
                    this.content = content;
                    this.lineNum = lineNo.first_line;
                    this.hashtags = hashtags;
                    this.conditionalExpression = conditionalExpression;
                  }
                },
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
                GenericCommandNode: class extends Command {
                  constructor(command, lineNo) {
                    let hashtags = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
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
                TextNode: class extends Text {
                  constructor(text, lineNo) {
                    let hashtags = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
                    super();
                    this.type = "TextNode";
                    this.text = text;
                    this.lineNum = lineNo.first_line;
                    this.hashtags = hashtags;
                  }
                },
                EscapedCharacterNode: class extends Text {
                  constructor(text, lineNo) {
                    let hashtags = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
                    super();
                    this.type = "EscapedCharacterNode";
                    this.text = text;
                    this.lineNum = lineNo.first_line;
                    this.hashtags = hashtags;
                  }
                },
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
                UnaryMinusExpressionNode: class extends Expression {
                  constructor(expression) {
                    super();
                    this.type = "UnaryMinusExpressionNode";
                    this.expression = expression;
                  }
                },
                ArithmeticExpressionAddNode: class extends Expression {
                  constructor(expression1, expression2) {
                    super();
                    this.type = "ArithmeticExpressionAddNode";
                    this.expression1 = expression1;
                    this.expression2 = expression2;
                  }
                },
                ArithmeticExpressionMinusNode: class extends Expression {
                  constructor(expression1, expression2) {
                    super();
                    this.type = "ArithmeticExpressionMinusNode";
                    this.expression1 = expression1;
                    this.expression2 = expression2;
                  }
                },
                ArithmeticExpressionMultiplyNode: class extends Expression {
                  constructor(expression1, expression2) {
                    super();
                    this.type = "ArithmeticExpressionMultiplyNode";
                    this.expression1 = expression1;
                    this.expression2 = expression2;
                  }
                },
                ArithmeticExpressionExponentNode: class extends Expression {
                  constructor(expression1, expression2) {
                    super();
                    this.type = "ArithmeticExpressionExponentNode";
                    this.expression1 = expression1;
                    this.expression2 = expression2;
                  }
                },
                ArithmeticExpressionDivideNode: class extends Expression {
                  constructor(expression1, expression2) {
                    super();
                    this.type = "ArithmeticExpressionDivideNode";
                    this.expression1 = expression1;
                    this.expression2 = expression2;
                  }
                },
                ArithmeticExpressionModuloNode: class extends Expression {
                  constructor(expression1, expression2) {
                    super();
                    this.type = "ArithmeticExpressionModuloNode";
                    this.expression1 = expression1;
                    this.expression2 = expression2;
                  }
                },
                NegatedBooleanExpressionNode: class extends Expression {
                  constructor(expression) {
                    super();
                    this.type = "NegatedBooleanExpressionNode";
                    this.expression = expression;
                  }
                },
                BooleanOrExpressionNode: class extends Expression {
                  constructor(expression1, expression2) {
                    super();
                    this.type = "BooleanOrExpressionNode";
                    this.expression1 = expression1;
                    this.expression2 = expression2;
                  }
                },
                BooleanAndExpressionNode: class extends Expression {
                  constructor(expression1, expression2) {
                    super();
                    this.type = "BooleanAndExpressionNode";
                    this.expression1 = expression1;
                    this.expression2 = expression2;
                  }
                },
                BooleanXorExpressionNode: class extends Expression {
                  constructor(expression1, expression2) {
                    super();
                    this.type = "BooleanXorExpressionNode";
                    this.expression1 = expression1;
                    this.expression2 = expression2;
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
                SetVariableEqualToNode: class extends Assignment {
                  constructor(variableName, expression) {
                    super();
                    this.type = "SetVariableEqualToNode";
                    this.variableName = variableName;
                    this.expression = expression;
                  }
                },
                FunctionCallNode: class extends FunctionCall {
                  constructor(functionName, args, lineNo) {
                    let hashtags = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : [];
                    super();
                    this.type = "FunctionCallNode";
                    this.functionName = functionName;
                    this.args = args;
                    this.lineNum = lineNo.first_line;
                    this.hashtags = hashtags;
                  }
                },
                InlineExpressionNode: class extends Expression {
                  constructor(expression, lineNo) {
                    let hashtags = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
                    super();
                    this.type = "InlineExpressionNode";
                    this.expression = expression;
                    this.lineNum = lineNo.first_line;
                    this.hashtags = hashtags;
                  }
                }
              };
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            173: (module2, exports2, __webpack_require__2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              var _nodes = _interopRequireDefault(__webpack_require__2(748));
              var _lexer = _interopRequireDefault(__webpack_require__2(525));
              var _compiledParser = __webpack_require__2(348);
              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }
              _compiledParser.parser.lexer = new _lexer.default();
              _compiledParser.parser.yy = _nodes.default;
              _compiledParser.parser.yy.declarations = {};
              _compiledParser.parser.yy.parseError = function parseError(e) {
                throw e;
              };
              _compiledParser.parser.yy.registerDeclaration = function registerDeclaration(variableName, expression, explicitType) {
                if (!this.areDeclarationsHandled) {
                  if (this.declarations[variableName]) {
                    throw new Error("Duplicate declaration found for variable: ".concat(variableName));
                  }
                  this.declarations[variableName] = {
                    variableName,
                    expression,
                    explicitType
                  };
                }
              };
              var _default = _compiledParser.parser;
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            34: (module2, exports2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              class Result {
              }
              class TextResult extends Result {
                constructor(text, hashtags, metadata) {
                  super();
                  this.text = text;
                  this.hashtags = hashtags;
                  this.metadata = metadata;
                }
              }
              class CommandResult extends Result {
                constructor(command, hashtags, metadata) {
                  super();
                  this.command = command;
                  this.hashtags = hashtags;
                  this.metadata = metadata;
                }
              }
              class OptionResult extends Result {
                constructor(text) {
                  let isAvailable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                  let hashtags = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
                  let metadata = arguments.length > 3 ? arguments[3] : void 0;
                  super();
                  this.text = text;
                  this.isAvailable = isAvailable;
                  this.hashtags = hashtags;
                  this.metadata = metadata;
                }
              }
              class OptionsResult extends Result {
                constructor(options, metadata) {
                  super();
                  this.options = options.map((s) => {
                    return new OptionResult(s.text, s.isAvailable, s.hashtags);
                  });
                  this.metadata = metadata;
                }
                select() {
                  let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
                  if (index < 0 || index >= this.options.length) {
                    throw new Error("Cannot select option #".concat(index, ", there are ").concat(this.options.length, " options"));
                  }
                  this.selected = index;
                }
              }
              var _default = {
                Result,
                TextResult,
                CommandResult,
                OptionsResult
              };
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            159: (module2, exports2, __webpack_require__2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              var _parser = _interopRequireDefault(__webpack_require__2(173));
              var _results = _interopRequireDefault(__webpack_require__2(34));
              var _defaultVariableStorage = _interopRequireDefault(__webpack_require__2(131));
              var _convertYarnToJs = _interopRequireDefault(__webpack_require__2(144));
              var _nodes = _interopRequireDefault(__webpack_require__2(748));
              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }
              function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                  var symbols = Object.getOwnPropertySymbols(object);
                  enumerableOnly && (symbols = symbols.filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                  })), keys.push.apply(keys, symbols);
                }
                return keys;
              }
              function _objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                  var source = null != arguments[i] ? arguments[i] : {};
                  i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
                    _defineProperty(target, key, source[key]);
                  }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                  });
                }
                return target;
              }
              function _defineProperty(obj, key, value) {
                if (key in obj) {
                  Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
                } else {
                  obj[key] = value;
                }
                return obj;
              }
              const nodeTypes = _nodes.default.types;
              class Runner {
                constructor() {
                  this.noEscape = false;
                  this.yarnNodes = {};
                  this.variables = new _defaultVariableStorage.default();
                  this.functions = {};
                }
                load(dialogue) {
                  if (!dialogue) {
                    throw new Error("No dialogue supplied");
                  }
                  let nodes;
                  if (typeof dialogue === "string") {
                    nodes = (0, _convertYarnToJs.default)(dialogue);
                  } else {
                    nodes = dialogue;
                  }
                  nodes.forEach((node) => {
                    if (!node.title) {
                      throw new Error("Node needs a title: ".concat(JSON.stringify(node)));
                    } else if (node.title.split(".").length > 1) {
                      throw new Error("Node title cannot contain a dot: ".concat(node.title));
                    }
                    if (!node.body) {
                      throw new Error("Node needs a body: ".concat(JSON.stringify(node)));
                    }
                    if (this.yarnNodes[node.title]) {
                      throw new Error("Duplicate node title: ".concat(node.title));
                    }
                    this.yarnNodes[node.title] = node;
                  });
                  _parser.default.yy.areDeclarationsHandled = false;
                  _parser.default.yy.declarations = {};
                  this.handleDeclarations(nodes);
                  _parser.default.yy.areDeclarationsHandled = true;
                }
                setVariableStorage(storage) {
                  if (typeof storage.set !== "function" || typeof storage.get !== "function") {
                    throw new Error('Variable Storage object must contain both a "set" and "get" function');
                  }
                  this.variables = storage;
                }
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
                    _parser.default.parse(declareLines.join("\n"));
                  }
                  Object.entries(_parser.default.yy.declarations).forEach((_ref) => {
                    let [variableName, {
                      expression,
                      explicitType
                    }] = _ref;
                    const value = this.evaluateExpressionOrLiteral(expression);
                    if (explicitType && typeof value !== typeof exampleValues[explicitType]) {
                      throw new Error("Cannot declare value ".concat(value, " as type ").concat(explicitType, " for variable ").concat(variableName));
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
                *run(startNode) {
                  let jumpTo = startNode;
                  while (jumpTo) {
                    const yarnNode = this.yarnNodes[jumpTo];
                    if (yarnNode === void 0) {
                      throw new Error('Node "'.concat(startNode, '" does not exist'));
                    }
                    const parserNodes = Array.from(_parser.default.parse(yarnNode.body));
                    const metadata = _objectSpread({}, yarnNode);
                    delete metadata.body;
                    const result = yield* this.evalNodes(parserNodes, metadata);
                    jumpTo = result && result.jump;
                  }
                }
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
                        yield new _results.default.TextResult(textRun, node.hashtags, metadata);
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
                    } else if (node instanceof _nodes.default.JumpCommandNode) {
                      return {
                        jump: node.destination
                      };
                    } else if (node instanceof _nodes.default.StopCommandNode) {
                      return {
                        stop: true
                      };
                    } else {
                      const command = this.evaluateExpressionOrLiteral(node.command);
                      yield new _results.default.CommandResult(command, node.hashtags, metadata);
                    }
                  }
                  return void 0;
                }
                *handleShortcuts(selections, metadata) {
                  const transformedSelections = selections.map((s) => {
                    let isAvailable = true;
                    if (s.conditionalExpression && !this.evaluateExpressionOrLiteral(s.conditionalExpression)) {
                      isAvailable = false;
                    }
                    const text = this.evaluateExpressionOrLiteral(s.text);
                    return Object.assign(s, {
                      isAvailable,
                      text
                    });
                  });
                  const optionsResult = new _results.default.OptionsResult(transformedSelections, metadata);
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
                evaluateAssignment(node) {
                  const result = this.evaluateExpressionOrLiteral(node.expression);
                  const oldValue = this.variables.get(node.variableName);
                  if (oldValue && typeof oldValue !== typeof result) {
                    throw new Error("Variable ".concat(node.variableName, " is already type ").concat(typeof oldValue, "; cannot set equal to ").concat(result, " of type ").concat(typeof result));
                  }
                  this.variables.set(node.variableName, result);
                }
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
                  throw new Error('Function "'.concat(node.functionName, '" not found'));
                }
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
                      return "".concat(a.stringLiteral);
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
                    throw new Error("node type not recognized: ".concat(node.type));
                  }
                  return handler(node instanceof nodeTypes.Expression ? this.evaluateExpressionOrLiteral(node.expression || node.expression1) : node, node.expression2 ? this.evaluateExpressionOrLiteral(node.expression2) : node);
                }
              }
              var _default = {
                Runner,
                TextResult: _results.default.TextResult,
                CommandResult: _results.default.CommandResult,
                OptionsResult: _results.default.OptionsResult
              };
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            352: (module2, exports2, __webpack_require__2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              var _yarnBound = _interopRequireDefault(__webpack_require__2(424));
              var _index = _interopRequireDefault(__webpack_require__2(167));
              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }
              const {
                OptionsResult,
                TextResult,
                CommandResult
              } = _index.default;
              _yarnBound.default.OptionsResult = OptionsResult;
              _yarnBound.default.TextResult = TextResult;
              _yarnBound.default.CommandResult = CommandResult;
              var _default = _yarnBound.default;
              exports2["default"] = _default;
              module2.exports = exports2.default;
            },
            279: (module2, exports2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = parseLine;
              function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                  var symbols = Object.getOwnPropertySymbols(object);
                  enumerableOnly && (symbols = symbols.filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                  })), keys.push.apply(keys, symbols);
                }
                return keys;
              }
              function _objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                  var source = null != arguments[i] ? arguments[i] : {};
                  i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
                    _defineProperty(target, key, source[key]);
                  }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                  });
                }
                return target;
              }
              function _defineProperty(obj, key, value) {
                if (key in obj) {
                  Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
                } else {
                  obj[key] = value;
                }
                return obj;
              }
              function parseLine(node, locale) {
                node.markup = [];
                parseCharacterLabel(node);
                parseMarkup(node, locale);
                node.text = node.text.replace(/(?:\\(.))/g, "$1");
              }
              function parseCharacterLabel(node) {
                const match = node.text.match(/^(\S+):\s+/);
                if (match) {
                  node.text = node.text.replace(match[0], "");
                  node.markup.push({
                    name: "character",
                    properties: {
                      name: match[1]
                    }
                  });
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
                  const {
                    index
                  } = match;
                  const [wholeMatch, charBefore, contents, charAfter] = match;
                  const hasLeadingSpace = /\s/.test(charBefore);
                  const hasTrailingSpace = /\s/.test(charAfter);
                  const attribute = _objectSpread(_objectSpread({}, parseAttributeContents(contents, locale)), {}, {
                    position: resultText.length + index + charBefore.length
                  });
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
                    throw new Error("Encountered closing ".concat(attr.name, " tag before opening tag"));
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
                  return {
                    name: "closeall",
                    isCloseAll: true
                  };
                } else if (isClosing) {
                  return {
                    name: nameMatch[1],
                    isClosing: true
                  };
                } else {
                  const propertyAssignmentsText = nameMatch ? contents.replace(nameMatch[0], "") : contents;
                  const propertyAssignments = propertyAssignmentsText.match(/(\S+?".*?"|[^\s/]+)/g);
                  let properties = {};
                  if (propertyAssignments) {
                    properties = propertyAssignments.reduce((acc, propAss) => {
                      return _objectSpread(_objectSpread({}, acc), parsePropertyAssignment(propAss));
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
                  throw new Error("Invalid markup property assignment: ".concat(propAss));
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
                return {
                  [propName]: value
                };
              }
              function processSelectAttribute(properties) {
                return properties[properties.value];
              }
              function processPluralAttribute(properties, locale) {
                return properties[new Intl.PluralRules(locale).select(properties.value)].replace(/%/g, properties.value);
              }
              function processOrdinalAttribute(properties, locale) {
                return properties[new Intl.PluralRules(locale, {
                  type: "ordinal"
                }).select(properties.value)].replace(/%/g, properties.value);
              }
              module2.exports = exports2.default;
            },
            424: (module2, exports2, __webpack_require__2) => {
              Object.defineProperty(exports2, "__esModule", {
                value: true
              });
              exports2["default"] = void 0;
              var _index = _interopRequireDefault(__webpack_require__2(167));
              var _lineParser = _interopRequireDefault(__webpack_require__2(279));
              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }
              class YarnBound2 {
                constructor(_ref) {
                  let {
                    dialogue,
                    variableStorage,
                    functions: functions2,
                    handleCommand,
                    combineTextAndOptionsResults,
                    locale,
                    startAt = "Start"
                  } = _ref;
                  this.handleCommand = handleCommand;
                  this.combineTextAndOptionsResults = combineTextAndOptionsResults;
                  this.bondage = _index.default;
                  this.bufferedNode = null;
                  this.currentResult = null;
                  this.history = [];
                  this.locale = locale;
                  this.runner = new _index.default.Runner();
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
                advance(optionIndex) {
                  if (typeof optionIndex !== "undefined" && this.currentResult && this.currentResult.select) {
                    this.currentResult.select(optionIndex);
                  }
                  let next = this.bufferedNode || this.generator.next().value;
                  let buffered = null;
                  if (this.handleCommand) {
                    while (next instanceof _index.default.CommandResult) {
                      this.handleCommand(next);
                      next = this.generator.next().value;
                    }
                  }
                  if (!(next instanceof _index.default.OptionsResult)) {
                    const upcoming = this.generator.next();
                    buffered = upcoming.value;
                    if (next instanceof _index.default.TextResult && this.combineTextAndOptionsResults && buffered instanceof _index.default.OptionsResult) {
                      next = Object.assign(buffered, next);
                      buffered = null;
                    } else if (next && upcoming.done) {
                      next = Object.assign(next, {
                        isDialogueEnd: true
                      });
                    }
                  }
                  if (this.currentResult) {
                    this.history.push(this.currentResult);
                  }
                  if (next instanceof _index.default.TextResult) {
                    (0, _lineParser.default)(next, this.locale);
                  } else if (next instanceof _index.default.OptionsResult) {
                    if (next.text) {
                      (0, _lineParser.default)(next, this.locale);
                    }
                    next.options.forEach((option) => {
                      (0, _lineParser.default)(option, this.locale);
                    });
                  }
                  this.currentResult = next;
                  this.bufferedNode = buffered;
                }
                registerFunction(name, func) {
                  this.runner.registerFunction(name, func);
                }
              }
              exports2["default"] = YarnBound2;
              module2.exports = exports2.default;
            }
          };
          var __webpack_module_cache__ = {};
          function __webpack_require__(moduleId) {
            var cachedModule = __webpack_module_cache__[moduleId];
            if (cachedModule !== void 0) {
              return cachedModule.exports;
            }
            var module2 = __webpack_module_cache__[moduleId] = {
              exports: {}
            };
            __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
            return module2.exports;
          }
          var __webpack_exports__ = __webpack_require__(352);
          return __webpack_exports__;
        })();
      });
    }
  });

  // src/index.ts
  var import_yarn_bound = __toESM(require_yarn_bound());

  // src/commands/addGold.ts
  function addGold(args) {
    if (args.length != 1) {
      throw new Error("Invalid number of arguments");
    }
    $gameParty.gainGold(parseInt(args[0]));
  }

  // src/commands/utils.ts
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
      if ((event == null ? void 0 : event.name) == name) {
        return event.id;
      }
    }
    throw new Error("Could not locate an event with name: " + name);
  }

  // src/commands/addItem.ts
  function addItem(args) {
    if (args.length < 1 || args.length > 2) {
      throw new Error("Invalid number of arguments");
    }
    const [itemName, quantity = "1"] = args;
    $gameParty.gainItem($dataItems[getItemIdFromName(itemName)], parseInt(quantity), false);
  }

  // src/commands/fadeIn.ts
  function fadeIn(args) {
    if (args.length > 1) {
      throw new Error("Invalid number of arguments");
    }
    const [duration = 24] = args;
    $gameScreen.startTint([0, 0, 0, 0], duration);
    $gameScreen.startFadeIn(duration);
  }

  // src/commands/fadeOut.ts
  function fadeOut(args) {
    if (args.length > 6) {
      throw new Error("Invalid number of arguments");
    }
    const [duration = 24, red = 0, green = 0, blue = 0, grey = 0, alpha = 1] = args;
    if (args.length <= 1) {
      $gameScreen.startFadeOut(duration);
    } else {
      $gameScreen.startTint([red * alpha, green * alpha, blue * alpha, grey * alpha], duration);
    }
  }

  // src/commands/flashScreen.ts
  function flashScreen(args) {
    if (args.length > 6) {
      throw new Error("Invalid number of arguments");
    }
    const [duration = 8, red = 0, green = 0, blue = 0, intensity = 255] = args;
    $gameScreen.startFlash([red, green, blue, intensity], duration);
  }

  // src/commands/hideEntity.ts
  function hideEntity(args, _callingEventId) {
    var _a;
    if (args.length > 1) {
      throw new Error("Invalid number of arguments");
    }
    const targetEventId = (_a = getEventIdByName(args[0])) != null ? _a : _callingEventId;
    const gameEvent = $gameMap.event(targetEventId);
    gameEvent.setOpacity(0);
  }

  // src/commands/enums.ts
  var DIRECTION = /* @__PURE__ */ ((DIRECTION2) => {
    DIRECTION2[DIRECTION2["UP"] = 8] = "UP";
    DIRECTION2[DIRECTION2["DOWN"] = 2] = "DOWN";
    DIRECTION2[DIRECTION2["LEFT"] = 4] = "LEFT";
    DIRECTION2[DIRECTION2["RIGHT"] = 6] = "RIGHT";
    return DIRECTION2;
  })(DIRECTION || {});

  // src/commands/moveEvent.ts
  function moveEvent(args, _callingEventId) {
    if (args.length < 3 || args.length > 4) {
      throw new Error("Invalid number of arguments");
    }
    const [directionName, distanceAsStr, speed, eventName = null] = args;
    const targetEventId = eventName ? getEventIdByName(eventName) : _callingEventId;
    const event = $gameMap._events[targetEventId];
    const distance = parseInt(distanceAsStr);
    const direction = DIRECTION[directionName.toUpperCase()];
    event.setThrough(true);
    if (event.isMoving()) {
      setTimeout(() => {
        moveEvent(args, _callingEventId);
      }, 60);
    } else {
      event.moveStraight(direction);
      const distanceRemaining = distance - 1;
      setTimeout(() => {
        event.setThrough(false);
        if (distanceRemaining > 0) {
          moveEvent([args[0], distanceRemaining.toString(), speed, args[3]], _callingEventId);
        }
      }, 60);
    }
  }

  // src/commands/playMusic.ts
  function playMusic(args) {
    if (args.length < 1 || args.length > 2) {
      throw new Error("Invalid number of arguments");
    }
    const musicName = args[0];
    const volume = args[1] ? parseInt(args[1]) : 100;
    AudioManager.playBgm({
      name: musicName,
      pos: 0,
      pan: 0,
      pitch: 100,
      volume
    });
  }

  // src/commands/playSound.ts
  function playSound(args) {
    if (args.length != 2) {
      throw new Error("Invalid number of arguments");
    }
    const soundName = args[0];
    const volume = parseInt(args[1]);
    AudioManager.playSe({
      name: soundName,
      pan: 0,
      pitch: 100,
      volume,
      pos: 0
    });
  }

  // src/commands/removeGold.ts
  function removeGold(args) {
    if (args.length != 1) {
      throw new Error("Invalid number of arguments");
    }
    $gameParty.loseGold(parseInt(args[0]));
  }

  // src/commands/removeItem.ts
  function removeItem(args) {
    if (args.length != 2) {
      throw new Error("Invalid number of arguments");
    }
    $gameParty.loseItem($dataItems[getItemIdFromName(args[0])], parseInt(args[1]), false);
  }

  // src/commands/setBackground.ts
  function setBackground(args) {
    if (args.length != 1) {
      throw new Error("Invalid number of arguments");
    }
    const opacity = parseInt(args[0]);
    if (opacity < 0 || opacity > 2) {
      throw new Error("Invalid opacity level, must be between 0 and two");
    }
    $gameMessage.setBackground(opacity);
  }

  // src/commands/setFacing.ts
  function setFacing(args, _callingEventId) {
    if (args.length < 1 || args.length > 2) {
      throw new Error("Invalid number of arguments");
    }
    const targetEventId = args[1] ? getEventIdByName(args[1]) : _callingEventId;
    const direction = DIRECTION[args[0].toUpperCase()];
    $gameMap._events[targetEventId].setDirection(direction);
  }

  // src/commands/showEntity.ts
  function showEntity(args) {
    if (args.length > 2) {
      throw new Error("Invalid number of arguments");
    }
    let opacity = 1;
    if (args.length > 1) {
      opacity = parseFloat(args[1]);
    }
    const gameEvent = $gameMap.event(getEventIdByName(args[0]));
    if (opacity > 1) {
      throw new Error("Opacity greater than 1, please use a value between 0 and 1");
    }
    if (opacity < 0) {
      throw new Error("Opacity less than 0, please use a value between 0 and 1");
    }
    const opacityInHexFormat = opacity * 255;
    gameEvent.setOpacity(opacityInHexFormat);
  }

  // src/commands/wait.ts
  async function wait(args) {
    if (args.length > 1) {
      throw new Error("Invalid number of arguments");
    }
    await new Promise((r) => setTimeout(r, parseInt(args[0])));
  }

  // src/commands/index.ts
  var commands = {
    add_item: addItem,
    add_gold: addGold,
    fade_out: fadeOut,
    fade_in: fadeIn,
    flash_screen: flashScreen,
    hide_entity: hideEntity,
    move_event: moveEvent,
    play_music: playMusic,
    play_sound: playSound,
    remove_item: removeItem,
    remove_gold: removeGold,
    set_facing: setFacing,
    show_entity: showEntity,
    wait,
    set_background: setBackground
  };
  function getCommand(command, args, callingEventId) {
    if (commands[command]) {
      return commands[command](args, callingEventId);
    }
    throw new Error("Invalid command");
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

  // src/functions/hasItem.ts
  function hasItem(itemName) {
    return playerHasItemByName(itemName);
  }

  // src/functions/randomRange.ts
  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // src/functions/index.ts
  var functions = {
    has_item: hasItem,
    random_range: randomRange
  };

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
      ).a;
    }
  }

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
    const runner = new import_yarn_bound.default({
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
    const tempRunner = new import_yarn_bound.default({
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
  function updateCharacterPortrait(currentResult) {
    const character = currentResult.markup.find((markup) => {
      return markup.name === "character";
    });
    if (character) {
      $gameMessage.setFaceImage(character.properties.name.toLowerCase(), 0);
    }
  }
  function addFormattedGameMessage(currentResult) {
    if (currentResult.text.trim().length > 0) {
      let text = currentResult.text;
      const special = currentResult.markup.find((markup) => {
        return markup.name === "special";
      });
      if (special) {
        text = currentResult.text.slice(0, special.position) + "\\C[1]" + currentResult.text.slice(special.position, special.position + special.length) + "\\C[0]" + currentResult.text.slice(special.position + special.length);
      }
      $gameMessage.add(wrap(text, { width: 58 }));
    }
  }
  async function processYarnDialog(runner, callingEventId) {
    const currentResult = runner.currentResult;
    switch (currentResult.constructor) {
      case import_yarn_bound.default.TextResult:
        updateCharacterPortrait(currentResult);
        addFormattedGameMessage(currentResult);
        if (!currentResult.isDialogueEnd) {
          if (currentResult.text.trim().length > 0) {
          }
          runner.advance();
          await processYarnDialog(runner, callingEventId);
        }
        break;
      case import_yarn_bound.default.OptionsResult:
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
      case import_yarn_bound.default.CommandResult:
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
    await getCommand(cmd, splitCmd.slice(1), callingEventId);
  }
  var VariableStorage = class {
    constructor(prefix) {
      this.storage = /* @__PURE__ */ new Map();
      this.prefix = prefix;
    }
    getExhaustion() {
      return this.storage.get(this.prefix + "_dialog_exhaustion");
    }
    get(key) {
      if (key.startsWith("dynamic_")) {
        return getDynamicValue(key.replace("dynamic_", ""));
      }
      const retrievalKey = key.startsWith("global_") ? key : this.prefix + "_" + key;
      return this.storage.get(retrievalKey);
    }
    set(key, value) {
      const retrievalKey = key.startsWith("global_") ? key : this.prefix + "_" + key;
      this.storage.set(retrievalKey, value);
    }
  };
  function getDynamicValue(variableName) {
    console.log(variableName);
    return true;
  }
  Window_ChoiceList.prototype.callOkHandler = function() {
    const callback = $gameMessage._choiceCallback;
    const index = this.index();
    this._messageWindow.terminateMessage();
    this.close();
    if (callback) {
      callback(index);
    }
  };
  Window_ChoiceList.prototype.callCancelHandler = function() {
    const callback = $gameMessage._choiceCallback;
    const index = $gameMessage.choiceCancelType();
    this._messageWindow.terminateMessage();
    this.close();
    if (callback) {
      callback(index);
    }
  };
})();
//# sourceMappingURL=pixelmapYarnSpinner.js.map
