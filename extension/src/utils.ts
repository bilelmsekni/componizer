import { Selection, window } from 'vscode';
import { DEFAULT_COMPONENT_NAME, DEFAULT_SKIP_IMPORT } from './constants';

export async function showInputBox(): Promise<string> {
  const result = await window.showInputBox({
    value: '',
    placeHolder: 'Choose your component name ...',
  });
  return result || DEFAULT_COMPONENT_NAME;
}

export async function showInputBoxForSkipImport(): Promise<boolean> {
  type Choice = "Yes" | "No";
  const result = (await window.showQuickPick(["No", "Yes"], {
    placeHolder: "Allows for skipping the module import.",
    canPickMany: false,
    ignoreFocusOut: true,
  })) as Choice;
  const choiceToBoolean = {
    Yes: true,
    No: false,
  };
  return choiceToBoolean[result] || DEFAULT_SKIP_IMPORT;
}

export function createScript(
  newComponent: string,
  skipImport: boolean,
  activeFile: string,
  selection: Selection,
  debugMode: boolean
): string {
  const { start, end } = selection;
  const script = `npx ng g @componizer/schematics:ng-componize --name ${newComponent} --activeFile "${activeFile}" --start ${start.line} --end ${end.line} --customSkipImport ${skipImport} --debugMode ${debugMode}`;
  window.showInformationMessage(script);
  return script;
}
