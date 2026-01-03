# Examples

This directory contains example benchmark tests for the `benes` project.

## Important Note

ES module examples use relative imports:

```javascript
import { bench } from '../../src/utils/index.mjs'
```

This is **correct for development** within the benes repository itself. CommonJS examples print `__BENCH__:` manually.

## For Your Own Projects

If you're writing benchmarks in **your own project** after installing benes, use the package import instead:

```javascript
import { bench } from 'benes/utils'
```

Make sure you have benes installed locally:

```bash
npm install --save-dev benes
```

## Running These Examples

From the benes repository root:

```bash
# Run with Node.js
node src/index.mjs ./examples/arrayItemCount

# Run with V8
node src/index.mjs ./examples/arrayItemCount -e v8

# Compare multiple engines
node src/index.mjs ./examples/arrayItemCount -e node,v8
```

## Creating Your Own Benchmarks

See the [main README](../README.md) for complete documentation on writing benchmark tests for your own projects.
