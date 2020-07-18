import { createFsFromVolume, Volume } from 'memfs';
import path from 'path';
import { Undefinable } from 'tsdef';
import webpack, { Stats } from 'webpack';

import { LoaderOptions } from '../src/types';

// eslint-disable-next-line
export const compiler = (
    fixturePath: string,
    options: Undefinable<LoaderOptions>
): Promise<Stats> => {
    const compiler = webpack({
        context: __dirname,
        entry: `./${path.relative(__dirname, fixturePath)}`,
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.mdx?$/,
                    use: [
                        {
                            loader: 'raw-loader',
                        },
                        {
                            loader: path.resolve(__dirname, '../lib/index.js'),
                            options,
                        },
                    ],
                },
            ],
        },
    });

    // @ts-ignore
    compiler.outputFileSystem = createFsFromVolume(new Volume());
    compiler.outputFileSystem.join = path.join.bind(path);

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) reject(err);
            if (stats.hasErrors()) {
                // @ts-ignore
                reject(new Error(stats.toJson().errors));
            }

            resolve(stats);
        });
    });
};

export const getTransformedMarkdown = async (
    markdownFilePath: string,
    options: Undefinable<LoaderOptions> = undefined
): Promise<string> => {
    const stats = await compiler(markdownFilePath, options);
    const output = stats.toJson().modules![0].source;

    let markdownOutput = '';
    if (output) {
        markdownOutput = output.replace(/^export default/, '').replace(/;$/, '');
        markdownOutput = JSON.parse(markdownOutput);
    }
    return markdownOutput;
};
