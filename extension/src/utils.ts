import { window, Selection } from 'vscode';
import { defaultComponentName } from './constants';

export async function showInputBox(): Promise<string> {
    const result = await window.showInputBox({
        value: '',
        placeHolder: 'Choose your component name ...',
    });
    return result || defaultComponentName;
}

export function createScript(newComponent: string, activeFile: string, selection: Selection): string {
    const { start, end } = selection;
    const script = `ng g @componizer/schematics:ng-componize --name ${newComponent} --activeFile ${activeFile} --start ${start.line} --end ${end.line}`;
    window.showInformationMessage(script);
    return script;
}