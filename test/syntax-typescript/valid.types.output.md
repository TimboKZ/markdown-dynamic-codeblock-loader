# Types

```ts { "file": "./valid.types.ts", "symbol": "NormalSingleLineType" }
type NormalSingleLineType = string | number | undefined;
```

```ts { "file": "./valid.types.ts", "symbol": "NormalMultiLineType" }
type NormalMultiLineType = {
    // My comment
    [id: string]: string; // My other comment
};
```

```ts { "file": "./valid.types.ts", "symbol": "ExportedSingleLineType" }
export type ExportedSingleLineType = string | number | undefined;
```

