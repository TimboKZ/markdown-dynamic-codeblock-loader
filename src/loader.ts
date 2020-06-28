import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import webpack from 'webpack';
import LoaderContext = webpack.loader.LoaderContext;

const schema: any = {
    type: 'object',
    properties: {
        test: {
            type: 'string',
        },
    },
};

export function loader(this: LoaderContext, source: string): string {
    const options = getOptions(this);

    validateOptions(schema, options, {
        name: 'Markdown Dynamic Codeblock Loader',
        baseDataPath: 'options',
    });

    // Apply some transformations to the source...

    return `export default ${JSON.stringify(source)}`;
}
