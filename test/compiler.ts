import { createFsFromVolume, Volume } from 'memfs';
import path from 'path';
import webpack, { Stats } from 'webpack';

// eslint-disable-next-line
export default (fixturePath: string): Promise<Stats> => {
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
                    use: {
                        loader: path.resolve(__dirname, '../lib/index.js'),
                        options: {
                            name: 'Alice',
                        },
                    },
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
