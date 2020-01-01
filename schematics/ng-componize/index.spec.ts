import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { expect } from 'chai';


const collectionPath = path.join(__dirname, '../collection.json');


describe('ng-componize', () => {
  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('ng-componize', {}, Tree.empty());

    expect(tree.files).to.equal([]);
  });
});
