// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { window, workspace, Uri } from 'vscode';
import { stub, match, spy } from 'sinon';
import { componizerCommand } from '../../command';
import { expect } from 'chai';
import * as path from 'path';
import * as utils from '../../utils';
import * as child_process from 'child_process';

suite('Extension Test Suite', () => {
	window.showInformationMessage('Start all tests.');
	const activeFile = path.resolve(__dirname, '../../../src/test/mock/sample.component.html');
	const activeFileName = 'toto';
	let settings: Uri = Uri.file(activeFile);

	test('call showInputBox, createScript and exec when ComponizerCommand is invoked', async () => {
		await workspace.openTextDocument(settings);
		await window.showTextDocument(settings);
		const sibSpy = stub(window, 'showInputBox').returns(Promise.resolve(activeFileName));
		const csSpy = stub(utils, 'createScript').callsFake(() => 'fake script');
		const execSpy = spy(child_process, 'exec');
		await componizerCommand();
		expect(sibSpy.callCount).to.equal(1);
		expect(csSpy.withArgs(activeFileName, activeFile, match.object).callCount).to.equal(1);
		expect(execSpy.callCount).to.equal(1);
	});
});
