import { exec } from 'child_process';
import { window, workspace } from 'vscode';
import { createScript, showInputBox, showInputBoxForSkipImport } from './utils';

export const componizerCommand = async () => {
  // The code you place here will be executed every time your command is executed
  let editor = window.activeTextEditor;
  if (!!editor) {
    const workspacePath =
      workspace && workspace.workspaceFolders
        ? workspace.workspaceFolders[0].uri.fsPath
        : '';
    const newComponent = await showInputBox();
    const skipImport = await showInputBoxForSkipImport();
    const debugMode = false;
    const script = createScript(
      newComponent,
      skipImport,
      editor.document.fileName,
      editor.selection,
      debugMode
    );
    exec(script, { cwd: workspacePath }, (err, out) => {
      if (err) {
        window.showErrorMessage(err.message);
      } else {
        window.showInformationMessage(out, 'Ok');
      }
    });
  }
};
