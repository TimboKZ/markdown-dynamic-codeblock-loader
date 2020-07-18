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
Using this loader, you can automatically embed type definitions into your Markdown files
at build-time. This way, the code snippets in your documentation will always be up to
date with the actual source code.

### What are the limitations?

At the moment, only top-level declarations can be extracted.
Additionally, only TypeScript and JavaScript are supported at this time.

## The gist

Suppose you have a TypeScript file, `types.ts`, that defines some interfaces:

```ts
// types.ts

export interface Node {
    value: number; // Value must be an integer!
    left?: Node; // Left child
    right?: Node; // Right child
}

export type SomeUnrelatedType = string | null;
```

You can use special syntax to reference the `Node` interface from `types.ts in your
Markdown file:

    # Node documentation

    The interface for nodes is defined as follows:

    ```ts {"file": "types.ts", "symbol": "Node" }
    ```

When you import the Markdown file above using `markdown-dynamic-codeblock-loader`, the
transformed Markdown output will become:

    # My Markdown documentation

    The `data` object has to satisfy the `MyData` type:

    ```ts {"file": "types.ts", "symbol": "Node" }
    export interface Node {
        value: number; // Value must be an integer!
        left?: Node; // Left child
        right?: Node; // Right child
    }
    ```
