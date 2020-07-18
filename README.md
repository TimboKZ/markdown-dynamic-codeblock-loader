# markdown-dynamic-codeblock-loader

<p>
  <a href="https://www.npmjs.com/package/markdown-dynamic-codeblock-loader" target="_blank">
    <img alt="NPM package" src="https://img.shields.io/npm/v/markdown-dynamic-codeblock-loader.svg">
  </a>
  <a href="https://travis-ci.com/github/TimboKZ/markdown-dynamic-codeblock-loader" target="_blank">
    <img alt="Build status" src="https://travis-ci.com/TimboKZ/markdown-dynamic-codeblock-loader.svg?branch=master">
  </a>
  <a href="https://tldrlegal.com/license/mit-license" style="margin-left: 5px;" target="_blank">
    <img alt="MIT license" src="https://img.shields.io/npm/l/markdown-dynamic-codeblock-loader">
  </a>
  <a href="https://www.npmjs.com/package/markdown-dynamic-codeblock-loader" style="margin-left: 5px;" target="_blank">
    <img alt="NPM downloads" src="https://img.shields.io/npm/dt/markdown-dynamic-codeblock-loader">
  </a>
  <a href="https://github.com/TimboKZ/markdown-dynamic-codeblock-loader" style="margin-left: 5px;" target="_blank">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/TimboKZ/markdown-dynamic-codeblock-loader">
  </a>
  <a href="https://discord.gg/HT4ttdQ" style="margin-left: 5px;" target="_blank">
    <img alt="Chat on Discord" src="https://img.shields.io/discord/696033621986770957?label=Chat%20on%20Discord">
  </a>
</p>

### What is this?

A Webpack loader that can dynamically replace Markdown code blocks with snippets
extracted from source files.

### When is this useful?

It is useful for documentation websites generated using Webpack (e.g. React Storybook).
Using this loader, you can automatically embed type definitions into your Markdown docs
at build-time. This way, the code snippets in your documentation will always be up to
date with the actual source code. [Chonky React file browser](https://github.com/TimboKZ/Chonky)
is a good example of a project using this loader.

### What are the limitations?

At the moment, only top-level declarations in JavaScript and TypeScript can be
extracted.

## The gist

Suppose you have a TypeScript file, `types.ts`, that defines some interfaces:

```ts
export interface Node {
    value: number; // Value must be an integer!
    left?: Node; // Left child
    right?: Node; // Right child
}

export type SomeUnrelatedType = string | null;
```

You can use special syntax to reference the `Node` interface from `types.ts` in your
Markdown file:

````markdown
# Node documentation

The interface for nodes is defined as follows:

```ts {"file": "types.ts", "symbol": "Node"}
```
````

When you import the Markdown file above using this loader, it is transformed into:

````markdown
# Node documentation

The interface for nodes is defined as follows:

```ts {"file": "types.ts", "symbol": "Node"}
export interface Node {
    value: number; // Value must be an integer!
    left?: Node; // Left child
    right?: Node; // Right child
}
```
````

## Installation and usage

Install the main loader:

```bash
npm install --save-dev markdown-dynamic-codeblock-loader
```

Install any additional loaders you need to work with Markdown. This will depend on
your use case. For example, if you want to load Markdown files as plain text, you can
install `raw-loader`:

```bash
npm install --save-dev raw-loader
```

Add relevant Markdown rules to your Webpack config. Make sure
`markdown-dynamic-codeblock-loader` comes **last** in the list of loaders:

```js
// webpack.config.js
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.mdx?$/,
                use: [
                    {
                        // You can replace this with any loader
                        // you want, e.g. `markdown-loader`
                        loader: 'raw-loader',
                    },
                    {
                        // This has to come last!
                        loader: 'markdown-dynamic-codeblock-loader',
                        options: {
                            // Optionally, specify path mappings
                            mappings: {
                                'my-src': path.resolve(__dirname, '..', 'src'),
                                // Can now reference files as `<my-src>/script.ts`
                            },
                        },
                    },
                ],
            },
        ],
    },
};
```

Now you can create a Markdown file, e.g. `docs.md` that will reference some declaration
in your code, e.g. `Colors` from `typedef.ts`,

```typescript
// typedef.ts
export enum Colors {
    Black = 'black',
}
```

````markdown
# docs.md

Look at my fancy colors enum:

```ts {"file": "typedef.ts", "symbol": "Colors"}
```
````

Finally, you can import the Markdown file in your code:

```markdown
import docs from './docs.md';

console.log(docs);
```

In the output, you will see that the declaration for the `Colors` enum was embedded
into the Markdown source.

## License

MIT © [Tim Kuzhagaliyev](https://github.com/TimboKZ) 2020
