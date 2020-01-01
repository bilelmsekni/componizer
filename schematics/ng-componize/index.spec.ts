import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { expect } from 'chai';
<<<<<<< HEAD
import { Style, ChangeDetection } from '@schematics/angular/component/schema';
=======

>>>>>>> enhanced tests

const collectionPath = path.join(__dirname, '../collection.json');


describe('ng-componize', () => {
  let appTree: UnitTestTree;
  const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0'
  };
  const appOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Css,
    skipTests: false,
    skipPackageJson: false
  };

  const runner = new SchematicTestRunner('schematics', collectionPath);

  beforeEach(async () => {
    appTree = await runner.runSchematicAsync('workspace', workspaceOptions).toPromise();
    appTree = await runner
      .runSchematicAsync('application', appOptions, appTree)
      .toPromise();
  });

  it('should create component when ng-componize is executed', async () => {

    const tree = await runner.runSchematicAsync('ng-componize', {
      name: 'toto',
      activeFile: 'bar.component.html',
      start: 0,
      end: 8,
      project: 'bar',
      inlineStyle: false,
      inlineTemplate: false,
      changeDetection: ChangeDetection.Default,
      style: Style.Css,
      type: 'Component',
      skipTests: false,
      module: undefined,
      export: false,
    }, appTree).toPromise();

<<<<<<< HEAD
    expect(tree.files).to.contain('/projects/bar/src/app/toto/toto.component.ts');
    expect(tree.files).to.contain('/projects/bar/src/app/toto/toto.component.html');
    expect(tree.files).to.contain('/projects/bar/src/app/toto/toto.component.css');
    expect(tree.files).to.contain('/projects/bar/src/app/toto/toto.component.spec.ts');
=======
    expect(tree.files).to.equal([]);
>>>>>>> enhanced tests
  });
});
