import webpack from 'webpack';
import { CodeChunk, PathMapping } from './types';
import LoaderContext = webpack.loader.LoaderContext;
export declare const processCodeChunk: (loaderContext: LoaderContext, chunk: CodeChunk, pathMapping: PathMapping) => string | undefined;
