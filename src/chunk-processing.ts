import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

import { CodeChunk } from './types';
import LoaderContext = webpack.loader.LoaderContext;

export const processCodeChunk = (loaderContext: LoaderContext, chunk: CodeChunk) => {
    const { jsonConfig } = chunk;
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
        throw Error(filePath);
        if (!fs.existsSync(filePath)) {
            throw new Error(
                `Provided "file" does not exist. Resolved path: ${filePath}`
            );
        }

        chunk.contents = [filePath];
        return filePath;
    } catch (error) {
        chunk.contents = [
            'An error occurred while parsing the JSON config for this code block:',
            `> ${error.message}`,
            'The JSON config was:',
            jsonConfig,
        ];
        return;
    }
};
