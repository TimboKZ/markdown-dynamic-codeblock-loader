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
        symbolLocation = findSymbol(node, symbol);
        if (symbolLocation)
            break;
    }
    if (!symbolLocation) {
        throw Error("Could not find symbol \"" + symbol + "\" in the resolved file: " + filePath);
    }
    return fileSource
        .split(loader_1.LinebreakRegex)
        .slice(symbolLocation.firstLineIndex, symbolLocation.lastLineIndex + 1);
};
var findSymbol = function (node, symbol) {
    var _a;
    var symbolNode = null;
    var currentNode = node;
    nodeLoop: while (currentNode) {
        switch (currentNode.type) {
            case 'ExportDefaultDeclaration':
            case 'ExportNamedDeclaration':
                currentNode = currentNode.declaration;
                continue;
            case 'VariableDeclaration':
            case 'FunctionDeclaration':
            case 'TSEnumDeclaration':
            case 'TSTypeAliasDeclaration':
            case 'TSInterfaceDeclaration':
                // currentNode type: Statement
                symbolNode = currentNode;
                break nodeLoop;
            case 'AssignmentExpression':
                // currentNode type: AssignmentExpression
                symbolNode = currentNode;
                break nodeLoop;
        }
        break;
    }
    if (symbolNode) {
        if (symbolNode) {
            var foundSymbol = false;
            if (symbolNode.type === 'VariableDeclaration') {
                // For variable declaration groups, we only support standard
                // Identifiers. We won't find the name if it's a part of some fancy
                // spread operator.
                foundSymbol = symbolNode.declarations.some(function (d) { return d.id.type === 'Identifier' && d.id.name === symbol; });
            }
            else if (symbolNode.type === 'TSEnumDeclaration' ||
                symbolNode.type === 'TSInterfaceDeclaration' ||
                symbolNode.type === 'TSTypeAliasDeclaration' ||
                symbolNode.type === 'FunctionDeclaration') {
                foundSymbol = ((_a = symbolNode.id) === null || _a === void 0 ? void 0 : _a.name) === symbol;
            }
            else if (symbolNode.type === 'AssignmentExpression') {
                var leftValue = symbolNode
                    .left;
                foundSymbol =
                    leftValue.type === 'Identifier' && leftValue.name === symbol;
            }
            if (foundSymbol) {
                // We return the location of the top-most parent node
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
    return null;
};
//# sourceMappingURL=symbol-extraction.js.map