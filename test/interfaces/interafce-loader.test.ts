import { expect, test } from '@jest/globals';
import path from 'path';

import compiler from '../compiler';

test('Inserts name and outputs JavaScript', async () => {
    const fixturePath = path.resolve(__dirname, 'raw-input.md');
    const stats = await compiler(fixturePath);

    const output = stats.toJson().modules![0].source;

    let markdownOutput = '';
    if (output) {
        markdownOutput = output.replace(/^export default/, '').replace(/;$/, '');
    }
    markdownOutput = JSON.parse(markdownOutput);

    expect(markdownOutput).toMatchSnapshot();
});
