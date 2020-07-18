import fs from 'fs';
import { stringifyRequest } from 'loader-utils';
import path from 'path';
import webpack from 'webpack';
import { extractSymbolLinesFromFile } from './symbol-extraction';

import { CodeChunk, PathMapping } from './types';
import LoaderContext = webpack.loader.LoaderContext;

export const processCodeChunk = (
    loaderContext: LoaderContext,
    chunk: CodeChunk,
    pathMapping: PathMapping
) => {
    const { jsonConfig } = chunk.codeBlock;
    if (!jsonConfig) return;

    let config;
    try {
        config = JSON.parse(jsonConfig);

        if (!config.file || !config.symbol) {
            throw new Error('Config should specify both "file" and "symbol" fields.');
        }

        // Apply path mappings provided through loader options
        let expandedPath = config.file;
        for (const token in pathMapping) {
            if (!pathMapping.hasOwnProperty(token)) continue;
            expandedPath = expandedPath.replace(`<${token}>`, pathMapping[token]);
        }

        const filePath = path.resolve(
            path.dirname(loaderContext.resourcePath),
            expandedPath
        );
        if (!fs.existsSync(filePath)) {
            throw new Error(
                `Provided "file" does not exist. Resolved path: ${filePath}`
            );
        }

        const relativeFilePath = stringifyRequest(loaderContext, filePath);
        loaderContext.addDependency(relativeFilePath);

        chunk.contents = extractSymbolLinesFromFile(filePath, config.symbol);
        return filePath;
    } catch (error) {
        throw new Error(
            `Failed to process the code block on line ${chunk.codeBlock.start + 1}: ` +
                `${error.message}` +
                `\nThe JSON config for the code block was: ${jsonConfig}`
        );
    }
};
