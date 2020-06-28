import { Chunk } from './types';
export interface CodeblockData {
    start: number;
    end: number;
    language: string;
    jsonConfig: string;
}
/**
 * Scans lines of a Markdown files and detect code blocks, extract info like
 * first/last lines and syntax name.
 */
export declare function detectCodeBlocks(lines: string[]): CodeblockData[];
/**
 * Scans lines of Markdown files, breaking it into Markdown and Code chunks
 */
export declare const breakMarkdownIntoChunks: (lines: string[]) => Chunk[];
export declare const stitchMarkdownChunksIntoMarkdown: (markdownChunks: Chunk[]) => string;
