# Arrow functions

```ts { "file": "./valid.arrow-functions.js", "symbol": "SingleLineArrowFunction" }
let SingleLineArrowFunction = () => 123 + 456; // Some trailing comment
```

```ts { "file": "./valid.arrow-functions.js", "symbol": "MultiLineArrowFunction" }
let MultiLineArrowFunction = (seed) => {
    return 4; // Chosen by fair dice roll. Guaranteed to be random.
};
```

```ts { "file": "./valid.arrow-functions.js", "symbol": "ExportedSingleLineArrowFunction" }
export const ExportedSingleLineArrowFunction = () => 123 + 456;
```

