"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = exports.LinebreakRegex = void 0;
var loader_utils_1 = require("loader-utils");
var schema_utils_1 = __importDefault(require("schema-utils"));
var chunk_extraction_1 = require("./chunk-extraction");
var chunk_processing_1 = require("./chunk-processing");
var types_1 = require("./types");
var schema = {
    type: 'object',
    properties: {
        // Both keys and values in `mappings` should be strings
        mappings: {
            type: 'object',
            patternProperties: {
                '.*?': { type: 'string' },
            },
            additionalProperties: false,
        },
    },
};
exports.LinebreakRegex = /\r?\n/;
function loader(source) {
    var options = loader_utils_1.getOptions(this);
    schema_utils_1.default(schema, options, {
        name: 'Markdown Dynamic Codeblock Loader',
        baseDataPath: 'options',
    });
    var lines = source.split(exports.LinebreakRegex);
    var chunks = chunk_extraction_1.breakMarkdownIntoChunks(lines);
    for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
        var chunk = chunks_1[_i];
        if (chunk.type !== types_1.ChunkType.Code)
            continue;
        chunk_processing_1.processCodeChunk(this, chunk, options.mappings);
    }
    var transformedMarkdown = chunk_extraction_1.stitchMarkdownChunksIntoMarkdown(chunks);
    return "export default " + JSON.stringify(transformedMarkdown);
}
exports.loader = loader;
//# sourceMappingURL=loader.js.map