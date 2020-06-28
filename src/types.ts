export enum ChunkType {
    Markdown = 'markdown',
    Code = 'code',
}

export interface MarkdownChunk {
    type: ChunkType.Markdown;
    contents: string[];
}

export interface CodeChunk {
    type: ChunkType.Code;
    language: string;
    jsonConfig: string;
    openingLine: string;
    contents: string[];
    closingLine: string;
}

export type Chunk = MarkdownChunk | CodeChunk;
