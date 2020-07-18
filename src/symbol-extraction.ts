import { parse } from '@babel/parser';
import {
    AssignmentExpression,
    ExportNamedDeclaration,
    Expression,
    Statement,
} from '@babel/types';
import fs from 'fs';
import { Nullable } from 'tsdef';

import { LinebreakRegex } from './loader';

export const extractSymbolLinesFromFile = (
    filePath: string,
    symbol: string
): string[] => {
    const fileSource = fs.readFileSync(filePath).toString();

    const tree = parse(fileSource, {
        sourceType: 'module',
        plugins: ['typescript'],
    });

    // Walk through all nodes in a program
    const programNodes = tree.program.body;
    let symbolLocation: Nullable<SymbolLocation> = null;
    for (const node of programNodes) {
        symbolLocation = findSymbol(node, symbol);
        if (symbolLocation) break;
    }

    if (!symbolLocation) {
        throw Error(
            `Could not find symbol "${symbol}" in the resolved file: ${filePath}`
        );
    }

    return fileSource
        .split(LinebreakRegex)
        .slice(symbolLocation.firstLineIndex, symbolLocation.lastLineIndex + 1);
};

interface SymbolLocation {
    firstLineIndex: number;
    lastLineIndex: number;
}

const findSymbol = (
    node: Statement,
    symbol: string,
): Nullable<SymbolLocation> => {
    let symbolNode: Nullable<Statement | AssignmentExpression> = null;
    let currentNode: Nullable<Statement | AssignmentExpression> = node;

    nodeLoop: while (currentNode) {
        switch (currentNode.type as Statement['type'] | Expression['type']) {
            case 'ExportDefaultDeclaration':
            case 'ExportNamedDeclaration':
                currentNode = (currentNode as ExportNamedDeclaration).declaration;
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
            let foundSymbol = false;

            if (symbolNode.type === 'VariableDeclaration') {
                // For variable declaration groups, we only support standard
                // Identifiers. We won't find the name if it's a part of some fancy
                // spread operator.
                foundSymbol = symbolNode.declarations.some(
                    (d) => d.id.type === 'Identifier' && d.id.name === symbol
                );
            } else if (
                symbolNode.type === 'TSEnumDeclaration' ||
                symbolNode.type === 'TSInterfaceDeclaration' ||
                symbolNode.type === 'TSTypeAliasDeclaration' ||
                symbolNode.type === 'FunctionDeclaration'
            ) {
                foundSymbol = symbolNode.id?.name === symbol;
            } else if (
                (symbolNode.type as Expression['type']) === 'AssignmentExpression'
            ) {
                const leftValue = ((symbolNode as unknown) as AssignmentExpression)
                    .left;
                foundSymbol =
                    leftValue.type === 'Identifier' && leftValue.name === symbol;
            }

            if (foundSymbol) {
                // We return the location of the top-most parent node
                const loc = node.loc;
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
