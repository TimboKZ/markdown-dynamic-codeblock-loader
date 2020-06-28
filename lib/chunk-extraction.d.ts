import { Chunk, CodeBlockData } from './types';
/**
 * Scans lines of a Markdown files and detect code blocks, extract info like
 * first/last lines and syntax name.
 */
export declare function detectCodeBlocks(lines: string[]): CodeBlockData[];
/**
 * Scans lines of Markdown files, breaking it into Markdown and Code chunks
 */
export declare const breakMarkdownIntoChunks: (lines: string[]) => Chunk[];
export declare const stitchMarkdownChunksIntoMarkdown: (markdownChunks: Chunk[]) => string;
