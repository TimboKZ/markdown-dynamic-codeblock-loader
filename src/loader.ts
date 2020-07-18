import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import webpack from 'webpack';

import {
    breakMarkdownIntoChunks,
    stitchMarkdownChunksIntoMarkdown,
} from './chunk-extraction';
import { processCodeChunk } from './chunk-processing';
import { ChunkType, PathMapping } from './types';
import LoaderContext = webpack.loader.LoaderContext;

const schema = {
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
} as const;

export const LinebreakRegex = /\r?\n/;

export function loader(this: LoaderContext, source: string): string {
    const options = getOptions(this);
    validateOptions(schema, options, {
        name: 'Markdown Dynamic Codeblock Loader',
        baseDataPath: 'options',
    });

    const lines = source.split(LinebreakRegex);
    const chunks = breakMarkdownIntoChunks(lines);

    for (const chunk of chunks) {
        if (chunk.type !== ChunkType.Code) continue;

        processCodeChunk(this, chunk, (options.mappings as unknown) as PathMapping);
    }

    const transformedMarkdown = stitchMarkdownChunksIntoMarkdown(chunks);
    return transformedMarkdown;
}
