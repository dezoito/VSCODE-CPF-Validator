# CPF Validator — VS Code Extension

Highlights Brazilian CPF numbers in **text** and **Markdown** files:

- **Valid** CPFs → green underline
- **Invalid** CPFs → red wavy underline
- Hover tooltip shows the normalised CPF and its validity

## Recognised formats

| Format              | Example           |
|---------------------|-------------------|
| Canonical           | `123.456.789-09`  |
| Slash variant       | `123.456.789/09`  |
| Bare digits         | `12345678909`     |
| Partial punctuation | `123456789-09`    |

## Getting started

```bash
# Install dependencies
npm install        # or: bun install

# Compile
npm run compile    # or: bun run compile

# Watch mode (recompiles on save)
npm run watch      # or: bun run watch

# Launch in VS Code
# Press F5 (or Run → Start Debugging) to open an Extension Development Host
```

All `npm run` commands work identically with `bun run`.

## Packaging for distribution

To install this extension on other machines, package it as a `.vsix` file:

```bash
# Install the packaging tool (once)
npm install -g @vscode/vsce    # or: bun add -g @vscode/vsce

# Build the .vsix
vsce package
```

This produces a file like `cpf-validator-0.1.0.vsix`. To install it:

```bash
# From the command line
code --install-extension cpf-validator-0.1.0.vsix
```

Or inside VS Code: `Ctrl+Shift+P` → **Extensions: Install from VSIX...** and select the file.

> **Note:** `vsce` requires a `publisher` field in `package.json`. For personal use, any string will do (e.g. `"publisher": "your-name"`). A real Marketplace publisher ID is only needed if you intend to publish publicly.

## Swapping in your own regex / validator

Edit `src/cpf.ts` — the extension imports `CPF_PATTERN` and `validateCpf()` from there. Replace either or both; no changes needed elsewhere.

## Commands

| Command                          | Description              |
|----------------------------------|--------------------------|
| `CPF Validator: Toggle Highlighting` | Enable / disable inline highlighting |

## Configuration

| Setting              | Default | Description                     |
|----------------------|---------|---------------------------------|
| `cpfValidator.enabled` | `true`  | Master on/off for highlighting  |
