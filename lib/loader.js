"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = void 0;
var loader_utils_1 = require("loader-utils");
var schema_utils_1 = __importDefault(require("schema-utils"));
var schema = {
    type: 'object',
    properties: {
        test: {
            type: 'string',
        },
    },
};
function loader(source) {
    var options = loader_utils_1.getOptions(this);
    schema_utils_1.default(schema, options, {
        name: 'Markdown Dynamic Codeblock Loader',
        baseDataPath: 'options',
    });
    // Apply some transformations to the source...
    return "export default " + JSON.stringify(source);
}
exports.loader = loader;
//# sourceMappingURL=loader.js.map