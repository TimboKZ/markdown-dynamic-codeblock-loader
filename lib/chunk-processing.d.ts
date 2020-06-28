import webpack from 'webpack';
import { CodeChunk } from './types';
import LoaderContext = webpack.loader.LoaderContext;
export declare const processCodeChunk: (loaderContext: LoaderContext, chunk: CodeChunk) => string | undefined;
