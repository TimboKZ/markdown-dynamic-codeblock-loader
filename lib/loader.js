"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = void 0;
var loader_utils_1 = require("loader-utils");
var schema_utils_1 = __importDefault(require("schema-utils"));
var chunk_util_1 = require("./chunk-util");
var schema = {
    type: 'object',
    properties: {
        mappings: {
            type: 'object',
        },
    },
};
var LinebreakRegex = /\r?\n/;
function loader(source) {
    var options = loader_utils_1.getOptions(this);
    schema_utils_1.default(schema, options, {
        name: 'Markdown Dynamic Codeblock Loader',
        baseDataPath: 'options',
    });
    var lines = source.split(LinebreakRegex);
    var chunks = chunk_util_1.breakMarkdownIntoChunks(lines);
    var transformedMarkdown = chunk_util_1.stitchMarkdownChunksIntoMarkdown(chunks);
    // const code = fs
    //     .readFileSync(
    //         path.resolve(__dirname, '..', 'test', 'typescript-source', 'typedef.ts')
    //     )
    //     .toString();
    // const parsedFile = parse(code, {
    //     sourceType: 'module',
    //     plugins: ['typescript'],
    // });
    // console.log(parsedFile);
    // Apply some transformations to the source...
    return "export default " + JSON.stringify(transformedMarkdown);
}
exports.loader = loader;
//# sourceMappingURL=loader.js.map