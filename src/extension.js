// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    const provideDefinition = require('./jump-to-definition');
    vscode.languages.registerDefinitionProvider(['thrift'], {
        provideDefinition
    });

    const formatThrift = require('./format');
    vscode.languages.registerDocumentFormattingEditProvider('thrift', {
        provideDocumentFormattingEdits(document) {
            return formatThrift(document.getText()).map((nl, idx) => {
                return vscode.TextEdit.replace(document.lineAt(idx).range, nl)
            });
        }
    })
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}