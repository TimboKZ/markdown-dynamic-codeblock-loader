import { describe, expect, it } from '@jest/globals';
import fs from 'fs';
import path from 'path';

import { LoaderOptions } from '../src/types';
import { getTransformedMarkdown } from './compiler';

describe('Path mappings', () => {
    const folderPath = path.resolve(__dirname, 'path-mappings');

    it('Are resolved correctly', async () => {
        const loaderOptions: LoaderOptions = {
            mappings: {
                // Absolute paths!
                'folder-a': path.join(folderPath, 'folder-a'),
                'folder-b': path.join(folderPath, 'folder-b'),
            },
        };

        const inputFilePath = path.join(folderPath, 'valid.path-mappings.input.md');
        const outputFilePath = path.join(folderPath, 'valid.path-mappings.output.md');

        const transformedMarkdown = await getTransformedMarkdown(
            inputFilePath,
            loaderOptions
        );
        fs.writeFileSync(outputFilePath, transformedMarkdown);
        expect(transformedMarkdown).toMatchSnapshot();
    });
});
