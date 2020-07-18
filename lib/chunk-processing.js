"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCodeChunk = void 0;
var fs_1 = __importDefault(require("fs"));
var loader_utils_1 = require("loader-utils");
var path_1 = __importDefault(require("path"));
var symbol_extraction_1 = require("./symbol-extraction");
exports.processCodeChunk = function (loaderContext, chunk, pathMapping) {
    var jsonConfig = chunk.codeBlock.jsonConfig;
    if (!jsonConfig)
        return;
    var config;
    try {
        config = JSON.parse(jsonConfig);
        if (!config.file || !config.symbol) {
            throw new Error('Config should specify both "file" and "symbol" fields.');
        }
        // Apply path mappings provided through loader options
        var expandedPath = config.file;
        for (var token in pathMapping) {
            if (!pathMapping.hasOwnProperty(token))
                continue;
            expandedPath = expandedPath.replace("<" + token + ">", pathMapping[token]);
        }
        var filePath = path_1.default.resolve(path_1.default.dirname(loaderContext.resourcePath), expandedPath);
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error("Provided \"file\" does not exist. Resolved path: " + filePath);
        }
        var relativeFilePath = loader_utils_1.stringifyRequest(loaderContext, filePath);
        loaderContext.addDependency(relativeFilePath);
        chunk.contents = symbol_extraction_1.extractSymbolLinesFromFile(filePath, config.symbol);
        return filePath;
    }
    catch (error) {
        throw new Error("Failed to process the code block on line " + (chunk.codeBlock.start + 1) + ": " +
            ("" + error.message) +
            ("\nThe JSON config for the code block was: " + jsonConfig));
    }
};
//# sourceMappingURL=chunk-processing.js.map