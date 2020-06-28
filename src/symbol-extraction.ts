import { parse } from '@babel/parser';
import { Statement } from '@babel/types';
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
        symbolLocation = tryToFindSymbol(node, symbol);
        if (symbolLocation) break;
    }

    if (!symbolLocation) {
        throw Error(
            `Could not find symbol ${symbol} in the resolved file: ${filePath}`
        );
    }

    const lines = fileSource
        .split(LinebreakRegex)
        .slice(symbolLocation.firstLineIndex, symbolLocation.lastLineIndex + 1);

    return lines;
};

interface SymbolLocation {
    firstLineIndex: number;
    lastLineIndex: number;
}

const tryToFindSymbol = (node: Statement, symbol: string): Nullable<SymbolLocation> => {
    if (node.type === 'ExportNamedDeclaration') {
        const declarationNode = node.declaration;
        if (declarationNode) {
            if (declarationNode.type === 'TSInterfaceDeclaration') {
                if (declarationNode.id.name === symbol) {
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
    }
    return null;
};
