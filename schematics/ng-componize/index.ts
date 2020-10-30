import {
  chain,
  externalSchematic,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Schema } from './schema';
import {
  createTemplates,
  getActiveFilePath,
  getNewComponentDetails,
  getProjectDetails,
  logInFile,
  tryUpdateTemplate,
} from './utils';

export function ngComponize(options: Schema): Rule {
  overrideSkipImport(options);
  return chain([
    externalSchematic('@schematics/angular', 'component', options),
    componize(options),
  ]);
}

function componize(
  options: Schema
): (tree: Tree, _context: SchematicContext) => Tree {
  return (tree: Tree, _context: SchematicContext) => {
    logInFile(JSON.stringify(options), options.debugMode);

    const { path: projectPath, prefix: projectPrefix } = getProjectDetails(
      getWorkspace(tree),
      options.project
    );

    const {
      selector: newComponentSelector,
      directory: newComponentDir,
    } = getNewComponentDetails(
      projectPath,
      options.name,
      options.prefix || projectPrefix
    );

    const activeFilePath = getActiveFilePath(projectPath, options.activeFile);

    const activeFileBuffer = tree.get(activeFilePath);

    if (activeFileBuffer) {
      const {
        newComponentTemplate,
        updatedComponentTemplate,
        foundItem,
      } = createTemplates(
        activeFileBuffer.content.toString(),
        newComponentSelector,
        options.start,
        options.end
      );

      tree.overwrite(activeFilePath, updatedComponentTemplate);

      tree.getDir(newComponentDir).visit((filePath) => {
        tryUpdateTemplate(
          filePath,
          () => tree.overwrite(filePath, newComponentTemplate),
          tree,
          foundItem,
          options.name
        );
      });
    }

    return tree;
  };
}

function overrideSkipImport(options: Schema): void {
  if (!!options.customSkipImport && options.customSkipImport === 'true') {
    options.skipImport = true;
  } else {
    options.skipImport = false;
  }
}
