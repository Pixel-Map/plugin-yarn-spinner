"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var tsdoc_1 = require("@microsoft/tsdoc");
var path_1 = __importDefault(require("path"));
var colors_1 = __importDefault(require("colors"));
var os = __importStar(require("os"));
var fs = __importStar(require("fs"));
var Formatter = /** @class */ (function () {
    function Formatter() {
    }
    Formatter.renderDocNode = function (docNode) {
        var result = '';
        if (docNode) {
            if (docNode instanceof tsdoc_1.DocExcerpt) {
                result += docNode.content.toString();
            }
            for (var _i = 0, _a = docNode.getChildNodes(); _i < _a.length; _i++) {
                var childNode = _a[_i];
                result += Formatter.renderDocNode(childNode);
            }
        }
        return result;
    };
    Formatter.renderDocNodes = function (docNodes) {
        var result = '';
        for (var _i = 0, docNodes_1 = docNodes; _i < docNodes_1.length; _i++) {
            var docNode = docNodes_1[_i];
            result += Formatter.renderDocNode(docNode);
        }
        return result;
    };
    return Formatter;
}());
console.log('BHI');
var inputFilename = path_1["default"].resolve(path_1["default"].join(__dirname, 'commands', 'addGold.ts'));
var inputBuffer = fs.readFileSync(inputFilename).toString();
var tsdocParser = new tsdoc_1.TSDocParser();
var parserContext = tsdocParser.parseString(inputBuffer);
console.log(os.EOL + colors_1["default"].green('Input Buffer:') + os.EOL);
console.log(colors_1["default"].gray('<<<<<<'));
console.log(inputBuffer);
console.log(colors_1["default"].gray('>>>>>>'));
console.log(os.EOL + colors_1["default"].green('Extracted Lines:') + os.EOL);
console.log(JSON.stringify(parserContext.lines.map(function (x) { return x.toString(); }), undefined, '  '));
console.log(os.EOL + colors_1["default"].green('Parser Log Messages:') + os.EOL);
if (parserContext.log.messages.length === 0) {
    console.log('No errors or warnings.');
}
else {
    for (var _i = 0, _a = parserContext.log.messages; _i < _a.length; _i++) {
        var message = _a[_i];
        console.log(inputFilename + message.toString());
    }
}
console.log(os.EOL + colors_1["default"].green('DocComment parts:') + os.EOL);
var docComment = parserContext.docComment;
console.log(colors_1["default"].cyan('Summary: ') + JSON.stringify(Formatter.renderDocNode(docComment.summarySection)));
if (docComment.remarksBlock) {
    console.log(colors_1["default"].cyan('Remarks: ') + JSON.stringify(Formatter.renderDocNode(docComment.remarksBlock.content)));
}
for (var _b = 0, _c = docComment.params.blocks; _b < _c.length; _b++) {
    var paramBlock = _c[_b];
    console.log(colors_1["default"].cyan("Parameter \"".concat(paramBlock.parameterName, "\": ")) +
        JSON.stringify(Formatter.renderDocNode(paramBlock.content)));
}
if (docComment.returnsBlock) {
    console.log(colors_1["default"].cyan('Returns: ') + JSON.stringify(Formatter.renderDocNode(docComment.returnsBlock.content)));
}
console.log(colors_1["default"].cyan('Modifiers: ') + docComment.modifierTagSet.nodes.map(function (x) { return x.tagName; }).join(', '));
