import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import webpack from 'webpack';

import {
    breakMarkdownIntoChunks,
    stitchMarkdownChunksIntoMarkdown,
} from './chunk-util';
import LoaderContext = webpack.loader.LoaderContext;

const schema = {
    type: 'object',
    properties: {
        mappings: {
            type: 'object',
        },
    },
} as const;

const LinebreakRegex = /\r?\n/;

export function loader(this: LoaderContext, source: string): string {
    const options = getOptions(this);
    validateOptions(schema, options, {
        name: 'Markdown Dynamic Codeblock Loader',
        baseDataPath: 'options',
    });

    const lines = source.split(LinebreakRegex);
    const chunks = breakMarkdownIntoChunks(lines);
    const transformedMarkdown = stitchMarkdownChunksIntoMarkdown(chunks);

    return `export default ${JSON.stringify(transformedMarkdown)}`;
}
