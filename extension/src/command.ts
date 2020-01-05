import { window, workspace } from 'vscode';
import { showInputBox, createScript } from './utils';
import { exec } from 'child_process';

export const componizerCommand = async () => {
    // The code you place here will be executed every time your command is executed
    let editor = window.activeTextEditor;
    if (!!editor) {
        const workspacePath = workspace && workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : '';
        const newComponent = await showInputBox();
        const script = createScript(newComponent, editor.document.fileName, editor.selection);
        exec(script, { cwd: workspacePath }, (err, out) => {
            if (err) {
                window.showErrorMessage(err.message);
            } else {
                window.showInformationMessage(out, 'Ok');
            }
        });
    }
};