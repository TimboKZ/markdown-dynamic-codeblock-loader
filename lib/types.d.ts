export interface CodeBlockData {
    start: number;
    end: number;
    language: string;
    jsonConfig: string;
}
export declare enum ChunkType {
    Markdown = "markdown",
    Code = "code"
}
export interface MarkdownChunk {
    type: ChunkType.Markdown;
    contents: string[];
}
export interface CodeChunk {
    type: ChunkType.Code;
    codeBlock: CodeBlockData;
    openingLine: string;
    contents: string[];
    closingLine: string;
}
export declare type Chunk = MarkdownChunk | CodeChunk;
