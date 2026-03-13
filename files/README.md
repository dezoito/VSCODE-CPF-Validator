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
npm install

# Compile
npm run compile

# Launch in VS Code
# Press F5 (or Run → Start Debugging) to open an Extension Development Host
```

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
