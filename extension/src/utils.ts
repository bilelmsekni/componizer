import { Selection, window } from 'vscode';
import { defaultComponentName, defaultSkipImport } from './constants';

export async function showInputBox(): Promise<string> {
  const result = await window.showInputBox({
    value: '',
    placeHolder: 'Choose your component name ...',
  });
  return result || defaultComponentName;
}

export async function showInputBoxForSkipImport(): Promise<string> {
  const result = await window.showInputBox({
    value: '',
    placeHolder: 'Allows for skipping the module import.',
  });
  return result || defaultSkipImport;
}

export function createScript(
  newComponent: string,
  skipImport: string,
  activeFile: string,
  selection: Selection,
  debugMode: boolean
): string {
  const { start, end } = selection;
  const script = `ng g @componizer/schematics:ng-componize --name ${newComponent} --activeFile "${activeFile}" --start ${start.line} --end ${end.line} --customSkipImport ${skipImport} --debugMode ${debugMode}`;
  window.showInformationMessage(script);
  return script;
}
