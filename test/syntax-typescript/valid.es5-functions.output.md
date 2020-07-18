# ES5 functions

```ts { "file": "./valid.es5-functions.ts", "symbol": "ES5Function" }
function ES5Function(seed: number): number {
    return 4; // Chosen by fair dice roll. Guaranteed to be random.
}
```

```ts { "file": "./valid.es5-functions.ts", "symbol": "ExportedES5Function" }
export function ExportedES5Function(seed: number): number {
    return 4; // Chosen by fair dice roll. Guaranteed to be random.
}
```

```ts { "file": "./valid.es5-functions.ts", "symbol": "DefaultExportES5Function" }
export default function DefaultExportES5Function(seed: number): number {
    return 4; // Chosen by fair dice roll. Guaranteed to be random.
}
```

