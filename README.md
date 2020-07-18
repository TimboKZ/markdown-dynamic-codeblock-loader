# markdown-dynamic-codeblock-loader

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
