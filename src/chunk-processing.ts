import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import { stringifyRequest } from 'loader-utils';
import { extractSymbolLinesFromFile } from './symbol-extraction';

import { CodeChunk } from './types';
import LoaderContext = webpack.loader.LoaderContext;

export const processCodeChunk = (loaderContext: LoaderContext, chunk: CodeChunk) => {
    const { jsonConfig } = chunk.codeBlock;
    if (!jsonConfig) return;

    let config;
    try {
        config = JSON.parse(jsonConfig);

        if (!config.file || !config.symbol) {
            throw new Error('Config should specify both "file" and "symbol" fields.');
        }

        const filePath = path.resolve(
            path.dirname(loaderContext.resourcePath),
            config.file
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
            `An error occurred while parsing the JSON config for the code block on ` +
                `line ${chunk.codeBlock.start + 1}: ${error.message}` +
                `\nThe JSON config for the code block was: ${jsonConfig}`
        );
    }
};
