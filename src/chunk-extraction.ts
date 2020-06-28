import { Chunk, ChunkType, CodeBlockData } from './types';

const codeBlockStartRegex = /^\s*```([A-Za-z0-9\-_]+)?\s*({\s*.*?\s*})\s*$/;
const codeBlockEndRegex = /^\s*```\s*$/;

/**
 * Scans lines of a Markdown files and detect code blocks, extract info like
 * first/last lines and syntax name.
 */
export function detectCodeBlocks(lines: string[]): CodeBlockData[] {
    let insideCodeBlock = false;
    let blockStartIndex: number = -1;
    let blockLanguage: string = '';
    let blockJsonConfig: string = '';
    const codeBlocks: CodeBlockData[] = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];

        const codeStartMatch = line.match(codeBlockStartRegex);
        if (codeStartMatch) {
            insideCodeBlock = true;
            blockStartIndex = lineIndex;
            [, blockLanguage, blockJsonConfig] = codeStartMatch;
            continue;
        }

        const codeEndMatch = line.match(codeBlockEndRegex);
        if (codeEndMatch) {
            if (insideCodeBlock) {
                codeBlocks.push({
                    start: blockStartIndex,
                    end: lineIndex,
                    language: blockLanguage.trim(),
                    jsonConfig: blockJsonConfig.trim(),
                });
            }
            insideCodeBlock = false;
        }
    }

    return codeBlocks;
}

/**
 * Scans lines of Markdown files, breaking it into Markdown and Code chunks
 */
export const breakMarkdownIntoChunks = (lines: string[]): Chunk[] => {
    const codeBlocks = detectCodeBlocks(lines);
    const markdownChunks: Chunk[] = [];

    let markdownStartIndex = 0;
    let markdownSlice = [];
    for (const block of codeBlocks) {
        const { start, end } = block;

        markdownSlice = lines.slice(markdownStartIndex, start);
        if (markdownSlice.length > 0) {
            markdownChunks.push({
                type: ChunkType.Markdown,
                contents: markdownSlice,
            });
        }

        markdownChunks.push({
            type: ChunkType.Code,
            codeBlock: block,
            openingLine: lines[start],
            contents: lines.slice(start + 1, end),
            closingLine: lines[end],
        });

        markdownStartIndex = end + 1;
    }

    markdownSlice = lines.slice(markdownStartIndex, lines.length);
    if (markdownSlice.length > 0) {
        markdownChunks.push({
            type: ChunkType.Markdown,
            contents: markdownSlice,
        });
    }

    return markdownChunks;
};

export const stitchMarkdownChunksIntoMarkdown = (markdownChunks: Chunk[]) => {
    let markdownString = '';
    for (const chunk of markdownChunks) {
        if (chunk.type === ChunkType.Code) {
            markdownString += `${chunk.openingLine}\n`;
            markdownString += `${chunk.contents.join('\n')}\n`;
            markdownString += `${chunk.closingLine}\n`;
        } else {
            markdownString += `${chunk.contents.join('\n')}\n`;
        }
    }
    return markdownString;
};
