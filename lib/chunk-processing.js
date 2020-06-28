"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCodeChunk = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
exports.processCodeChunk = function (loaderContext, chunk) {
    var jsonConfig = chunk.jsonConfig;
    if (!jsonConfig)
        return;
    var config;
    try {
        config = JSON.parse(jsonConfig);
        if (!config.file || !config.symbol) {
            throw new Error('Config should specify both "file" and "symbol" fields.');
        }
        var filePath = path_1.default.resolve(path_1.default.dirname(loaderContext.resourcePath), config.file);
        throw Error(filePath);
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error("Provided \"file\" does not exist. Resolved path: " + filePath);
        }
        chunk.contents = [filePath];
        return filePath;
    }
    catch (error) {
        chunk.contents = [
            'An error occurred while parsing the JSON config for this code block:',
            "> " + error.message,
            'The JSON config was:',
            jsonConfig,
        ];
        return;
    }
};
//# sourceMappingURL=chunk-processing.js.map