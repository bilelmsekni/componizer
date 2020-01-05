import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { getProjectDetails, createTemplates, tryUpdateTemplate, getActiveFilePath, getNewComponentDetails } from './utils';
import { getWorkspace } from '@schematics/angular/utility/config';

export function ngComponize(options: Schema): Rule {
  return chain([
    externalSchematic('@schematics/angular', 'component', options),
    componize(options)
  ]);
}


function componize(options: Schema): (tree: Tree, _context: SchematicContext) => Tree {
  return (tree: Tree, _context: SchematicContext) => {
    const { path: projectPath, prefix: projectPrefix } = getProjectDetails(getWorkspace(tree), options.project);

    const activeFilePath = getActiveFilePath(projectPath, options.activeFile);
    const { selector: newComponentSelector, directory: newComponentDir } = getNewComponentDetails(projectPath, options.name, options.prefix || projectPrefix);

    const activeFileBuffer = tree.get(activeFilePath);
    if (activeFileBuffer) {
      const { newTemplate, updatedTemplate } = createTemplates(activeFileBuffer, newComponentSelector, options.start, options.end);
      tree.overwrite(activeFilePath, updatedTemplate);

      tree.getDir(newComponentDir)
        .visit(filePath => {
          tryUpdateTemplate(filePath, () => tree.overwrite(filePath, newTemplate));
        });
    }

    return tree;
  };
}