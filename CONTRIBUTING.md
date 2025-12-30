# Contributing

Thanks for taking the time to contribute to [benes](https://github.com/nastybits/benes)!

This project uses:

- [Commitizen](http://commitizen.github.io/cz-cli/) for conventional commits
- [Prettier](https://prettier.io/) for code formatting
- [Vitest](https://vitest.dev/) for testing

## Project Structure

```
benes/
├── src/              # Benchmarking system
│   ├── index.mjs       # CLI entry point
│   ├── params.mjs      # Flag configuration
│   ├── core/           # Core modules
│   │   ├── bench.mjs   # Benchmark execution
│   │   ├── parser.mjs  # Argument parser
│   │   ├── print.mjs   # Output formatting
│   │   └── scanDir.mjs # File discovery
│   └── utils/          # Test utilities
│       ├── benchApi.mjs
│       ├── getRandomInt.mjs
│       ├── getRandomStr.mjs
│       ├── index.mjs
│       ├── makeRandomIntArray.mjs
│       └── makeRandomStrArray.mjs
└── examples/              # Examples of test suites
    ├── arrayItemCount/ # Example: counting elements
    └── arrayEraseElement/ # Example: removing elements
```

## Quick Start

1. Fork and clone the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests:
   ```bash
   npm test
   ```

## Development

- Keep changes focused and small.
- Follow existing code style (Prettier is used).
- Add or update tests when you change behavior.

## Commit Messages

This project uses Conventional Commits. You can run:

```bash
npm run commit
```

## Pull Requests

- Describe the problem and solution.
- Include any relevant screenshots/logs.
- Make sure tests pass.
