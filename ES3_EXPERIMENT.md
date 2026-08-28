# RxJS 7.8.2 — ECMAScript 3 Downlevel Experiment

This experiment compiles the RxJS 7.8.2 TypeScript source with TypeScript 4.2.4 using:

- `target: es3`
- `module: commonjs`
- `downlevelIteration: true`

The purpose is structural: inspect RxJS after TypeScript erases modern class syntax into constructor functions, prototype methods, and helper functions.

## What the artifact proves

The build verifies every emitted JavaScript file under `dist/cjs` and fails if it contains:

- JavaScript `class` syntax
- arrow functions (`=>`)
- `let` declarations
- `const` declarations

A small runtime smoke test also executes `of(1, 2, 3).pipe(map(x => x * 10))` against the generated CommonJS build.

## Important distinction

`target: es3` controls JavaScript **syntax emission**. It does not polyfill host/runtime APIs that RxJS may use, such as `Promise`, `Symbol`, timers, DOM APIs, or other later platform features. Therefore this artifact is an ES3-syntax experiment, not a claim that unmodified RxJS 7.8.2 runs in every historical ES3 engine.

## Build

```bash
npx --yes --package typescript@4.2.4 tsc -b src/tsconfig.cjs3.json src/tsconfig.types.json
node tools/verify-es3-build.js
```

TypeScript 5.0 deprecated `target: ES3`, and support was removed in TypeScript 5.5, so the experiment intentionally uses TypeScript 4.2.4—the compiler generation RxJS 7.8.x itself was developed against.
