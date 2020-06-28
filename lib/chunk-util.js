"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stitchMarkdownChunksIntoMarkdown = exports.breakMarkdownIntoChunks = exports.detectCodeBlocks = void 0;
var types_1 = require("./types");
var codeBlockStartRegex = /^\s*```([A-Za-z0-9\-_\s]+[A-Za-z0-9\-_])?\s*(.*?)$/;
var codeBlockEndRegex = /^\s*```\s*$/;
/**
 * Scans lines of a Markdown files and detect code blocks, extract info like
 * first/last lines and syntax name.
 */
function detectCodeBlocks(lines) {
    var insideCodeBlock = false;
    var blockStartIndex = -1;
    var blockLanguage = '';
    var blockJsonConfig = '';
    var codeBlockIndices = [];
    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        var line = lines[lineIndex];
        var codeStartMatch = line.match(codeBlockStartRegex);
        if (codeStartMatch) {
            insideCodeBlock = true;
            blockStartIndex = lineIndex;
            blockLanguage = codeStartMatch[1], blockJsonConfig = codeStartMatch[2];
            continue;
        }
        var codeEndMatch = line.match(codeBlockEndRegex);
        if (codeEndMatch) {
            if (insideCodeBlock) {
                codeBlockIndices.push({
                    start: blockStartIndex,
                    end: lineIndex,
                    language: blockLanguage.trim(),
                    jsonConfig: blockJsonConfig.trim(),
                });
            }
            insideCodeBlock = false;
        }
    }
    return codeBlockIndices;
}
exports.detectCodeBlocks = detectCodeBlocks;
/**
 * Scans lines of Markdown files, breaking it into Markdown and Code chunks
 */
exports.breakMarkdownIntoChunks = function (lines) {
    var codeBlockIndices = detectCodeBlocks(lines);
    var markdownChunks = [];
    var markdownStartIndex = 0;
    var markdownSlice = [];
    for (var _i = 0, codeBlockIndices_1 = codeBlockIndices; _i < codeBlockIndices_1.length; _i++) {
        var block = codeBlockIndices_1[_i];
        var start = block.start, end = block.end, language = block.language, jsonConfig = block.jsonConfig;
        markdownSlice = lines.slice(markdownStartIndex, start);
        if (markdownSlice.length > 0) {
            markdownChunks.push({
                type: types_1.ChunkType.Markdown,
                contents: markdownSlice,
            });
        }
        markdownChunks.push({
            type: types_1.ChunkType.Code,
            language: language,
            jsonConfig: jsonConfig,
            openingLine: lines[start],
            contents: lines.slice(start + 1, end),
            closingLine: lines[end],
        });
        markdownStartIndex = end + 1;
    }
    markdownSlice = lines.slice(markdownStartIndex, lines.length);
    if (markdownSlice.length > 0) {
        markdownChunks.push({
            type: types_1.ChunkType.Markdown,
            contents: markdownSlice,
        });
    }
    return markdownChunks;
};
exports.stitchMarkdownChunksIntoMarkdown = function (markdownChunks) {
    var markdownString = '';
    for (var _i = 0, markdownChunks_1 = markdownChunks; _i < markdownChunks_1.length; _i++) {
        var chunk = markdownChunks_1[_i];
        if (chunk.type === types_1.ChunkType.Code) {
            markdownString += chunk.openingLine + "\n";
            markdownString += chunk.contents.join('\n') + "\n";
            markdownString += chunk.closingLine + "\n";
        }
        else {
            markdownString += chunk.contents.join('\n') + "\n";
        }
    }
    return markdownString;
};
//# sourceMappingURL=chunk-util.js.map