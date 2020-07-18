import { describe, expect, it } from '@jest/globals';
import fs from 'fs';
import path from 'path';

import compiler from './compiler';

const getTransformedMarkdown = async (markdownFilePath: string): Promise<string> => {
    const stats = await compiler(markdownFilePath);
    const output = stats.toJson().modules![0].source;

    let markdownOutput = '';
    if (output) {
        markdownOutput = output.replace(/^export default/, '').replace(/;$/, '');
        markdownOutput = JSON.parse(markdownOutput);
    }
    return markdownOutput;
};

describe.each([['TypeScript', './syntax-typescript']])(
    'Correctly extracts %s symbols',
    (syntaxName, relFolderPath) => {
        const folderPath = path.resolve(__dirname, relFolderPath);
        const files = fs.readdirSync(folderPath);

        // Find all valid input files
        const validInputFiles = files.filter(
            (file) => file.startsWith('valid.') && file.endsWith('.input.md')
        );
        const validInputTestCases = validInputFiles.map((file) => {
            const inputFile = file;
            const outputFile = file.replace('.input.md', '.output.md');
            return [
                inputFile,
                path.resolve(folderPath, inputFile),
                path.resolve(folderPath, outputFile),
            ];
        });

        // Find all error input files
        const errorInputFiles = files.filter(
            (f) => f.startsWith('error.') && f.endsWith('.md')
        );
        const errorInputTestCases = errorInputFiles.map((file) => {
            return [path.resolve(folderPath, file)];
        });

        // Run tests for valid files
        it.each(validInputTestCases)(
            'Valid file: %s',
            async (basename, inputFilePath, outputFilePath) => {
                const transformedMarkdown = await getTransformedMarkdown(inputFilePath);
                fs.writeFileSync(outputFilePath, transformedMarkdown);
                expect(transformedMarkdown).toMatchSnapshot();
            }
        );

        // Run tests for error files
        it.each(errorInputTestCases)('Invalid file: %s', async (inputFilePath) => {
            await expect(() =>
                getTransformedMarkdown(inputFilePath)
            ).rejects.toThrowErrorMatchingSnapshot();
        });
    }
);
