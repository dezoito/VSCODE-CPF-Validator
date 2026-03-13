import * as vscode from "vscode";
import { CPF_PATTERN, validateCpf } from "./cpf";

// --- Decoration styles ---------------------------------------------------

const validDecoration = vscode.window.createTextEditorDecorationType({
  textDecoration: "underline",
  color: "#22c55e", // green
  overviewRulerColor: "#22c55e",
  overviewRulerLane: vscode.OverviewRulerLane.Right,
});

const invalidDecoration = vscode.window.createTextEditorDecorationType({
  textDecoration: "underline wavy",
  color: "#ef4444", // red
  overviewRulerColor: "#ef4444",
  overviewRulerLane: vscode.OverviewRulerLane.Right,
});

// --- Core decoration logic -----------------------------------------------

function updateDecorations(editor: vscode.TextEditor): void {
  const config = vscode.workspace.getConfiguration("cpfValidator");
  if (!config.get<boolean>("enabled", true)) {
    editor.setDecorations(validDecoration, []);
    editor.setDecorations(invalidDecoration, []);
    return;
  }

  const text = editor.document.getText();
  const validRanges: vscode.DecorationOptions[] = [];
  const invalidRanges: vscode.DecorationOptions[] = [];

  // Reset the regex state (global flag)
  CPF_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = CPF_PATTERN.exec(text)) !== null) {
    const startPos = editor.document.positionAt(match.index);
    const endPos = editor.document.positionAt(match.index + match[0].length);
    const range = new vscode.Range(startPos, endPos);

    const isValid = validateCpf(match[0]);

    const decoration: vscode.DecorationOptions = {
      range,
      hoverMessage: isValid
        ? `CPF: ${formatCpf(match[0])} (valid)`
        : `CPF: ${match[0]} (invalid)`,
    };

    if (isValid) {
      validRanges.push(decoration);
    } else {
      invalidRanges.push(decoration);
    }
  }

  editor.setDecorations(validDecoration, validRanges);
  editor.setDecorations(invalidDecoration, invalidRanges);
}

/** Normalise a CPF string to the canonical 000.000.000-00 format. */
function formatCpf(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length !== 11) {
    return raw;
  }
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

// --- Extension lifecycle --------------------------------------------------

let timeout: ReturnType<typeof setTimeout> | undefined;

function triggerUpdate(editor: vscode.TextEditor, delay = 200): void {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => updateDecorations(editor), delay);
}

export function activate(context: vscode.ExtensionContext): void {
  // Run immediately on the active editor
  if (vscode.window.activeTextEditor) {
    triggerUpdate(vscode.window.activeTextEditor, 0);
  }

  // Toggle command
  context.subscriptions.push(
    vscode.commands.registerCommand("cpfValidator.toggle", () => {
      const config = vscode.workspace.getConfiguration("cpfValidator");
      const current = config.get<boolean>("enabled", true);
      config.update("enabled", !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(
        `CPF Validator: ${!current ? "enabled" : "disabled"}`
      );
    })
  );

  // React to editor switches
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        triggerUpdate(editor, 0);
      }
    })
  );

  // React to document edits (debounced)
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && event.document === editor.document) {
        triggerUpdate(editor);
      }
    })
  );

  // React to config changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("cpfValidator")) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          triggerUpdate(editor, 0);
        }
      }
    })
  );
}

export function deactivate(): void {
  if (timeout) {
    clearTimeout(timeout);
  }
}
