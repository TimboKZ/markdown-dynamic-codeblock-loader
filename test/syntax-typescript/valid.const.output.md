# `const`

```ts { "file": "./valid.const.ts", "symbol": "NormalSingleLineConst" }
const NormalSingleLineConst = 'Hello World!'; // Some trailing comment
```

```ts { "file": "./valid.const.ts", "symbol": "ConstMultipleVariables" }
const IgnoreMe1,
    ConstMultipleVariables,
    IgnoreMe2 = 'Yikes...';
```

```ts { "file": "./valid.const.ts", "symbol": "NormalMultilineLineConst" }
const NormalMultilineLineConst = [
    'Francesca', // Findabair
    'Yennefer', // of Vengergberg
    'Triss', // Merigold
    'Ciri', // ...lla Fiona Elen Riannon
];
```

```ts { "file": "./valid.const.ts", "symbol": "ExportedSingleLineConst" }
export const ExportedSingleLineConst = 'Hello World!'; // Some trailing comment
```

```ts { "file": "./valid.const.ts", "symbol": "DefaultExportConst" }
export default DefaultExportConst = 'Hello World!'; // Some trailing comment
```

