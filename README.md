# markdown-dynamic-codeblock-loader

<p>
  <a href="https://www.npmjs.com/package/markdown-dynamic-codeblock-loader" target="_blank">
    <img alt="NPM package" src="https://img.shields.io/npm/v/markdown-dynamic-codeblock-loader.svg">
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

At the moment, only top-level interface/type/const/let definitions can be extracted.
Additionally, only TypeScript and JavaScript are supported at this time.

## The gist

This loader transforms Markdown source code by replacing code blocks with code
snippets from external source files. Consider the Typescript file below:

```ts
// Path:  src/types.ts
export interface MyData {
    color: string; // Hex colour
}

export type SomeUnrelatedType = string | null;
```

You could reference the `MyData` type in your Markdown file, like so:

    # My Markdown documentation

    The `data` object has to satisfy the `MyData` type:

    ```ts {"file": "src/types.ts", "symbol": "MyData" }
    ```

If you load the file above using `markdown-dynamic-codeblock-loader`, the output
Markdown will be:

    # My Markdown documentation

    The `data` object has to satisfy the `MyData` type:

    ```ts
    interface MyData {
        color: string; // Hex colour
    }
    ```
