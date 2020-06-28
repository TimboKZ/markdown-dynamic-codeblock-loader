# markdown-dynamic-codeblock-loader

A Webpack loader that can dynamically replace code blocks with snippets extracted from
source files.

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
