import * as vscode from 'vscode';
import { COMPONIZER_COMMAND_NAME } from './constants';
import { componizerCommand } from './command';

export function activate(context: vscode.ExtensionContext): void {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(COMPONIZER_COMMAND_NAME, componizerCommand);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate(): void { }