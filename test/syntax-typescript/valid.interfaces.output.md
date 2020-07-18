# Interfaces

```ts { "file": "./valid.interfaces.ts", "symbol": "NormalInterface" }
interface NormalInterface {
    color: string; // Hex colour
}
```

```ts { "file": "./valid.interfaces.ts", "symbol": "GenericInterface" }
interface GenericInterface<T> {
    color: T; // Hex colour
}
```

```ts { "file": "./valid.interfaces.ts", "symbol": "ExportedInterface" }
export interface ExportedInterface {
    color: string; // Hex colour
}
```

