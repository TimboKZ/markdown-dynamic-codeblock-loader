"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSymbolLinesFromFile = void 0;
var parser_1 = require("@babel/parser");
var fs_1 = __importDefault(require("fs"));
var loader_1 = require("./loader");
exports.extractSymbolLinesFromFile = function (filePath, symbol) {
    var fileSource = fs_1.default.readFileSync(filePath).toString();
    var tree = parser_1.parse(fileSource, {
        sourceType: 'module',
        plugins: ['typescript'],
    });
    // Walk through all nodes in a program
    var programNodes = tree.program.body;
    var symbolLocation = null;
    for (var _i = 0, programNodes_1 = programNodes; _i < programNodes_1.length; _i++) {
        var node = programNodes_1[_i];
        symbolLocation = tryToFindSymbol(node, symbol);
        if (symbolLocation)
            break;
    }
    if (!symbolLocation) {
        throw Error("Could not find symbol " + symbol + " in the resolved file: " + filePath);
    }
    var lines = fileSource
        .split(loader_1.LinebreakRegex)
        .slice(symbolLocation.firstLineIndex, symbolLocation.lastLineIndex + 1);
    return lines;
};
var tryToFindSymbol = function (node, symbol) {
    if (node.type === 'ExportNamedDeclaration') {
        var declarationNode = node.declaration;
        if (declarationNode) {
            if (declarationNode.type === 'TSInterfaceDeclaration') {
                if (declarationNode.id.name === symbol) {
                    var loc = node.loc;
                    if (loc && loc.start && loc.end) {
                        return {
                            firstLineIndex: loc.start.line - 1,
                            lastLineIndex: loc.end.line - 1,
                        };
                    }
                }
            }
        }
    }
    return null;
};
//# sourceMappingURL=symbol-extraction.js.map