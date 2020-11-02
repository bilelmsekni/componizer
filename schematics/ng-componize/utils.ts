import { join, normalize, strings } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import {
  buildDefaultPath,
  getProject,
} from '@schematics/angular/utility/project';
import {
  ProjectType,
  WorkspaceProject,
  WorkspaceSchema,
} from '@schematics/angular/utility/workspace-models';
import * as fs from 'fs';
import { extractParameterName, launchParsing } from './htmlParser';
import { BindingMatch } from './parser/binding-match';

export function getProjectDetails(
  workSpace: WorkspaceSchema,
  customProject?: string
): { path: string; prefix: string } {
  const projectName = customProject || workSpace.defaultProject;
  const project = getProject(workSpace, projectName!);
  const path = buildDefaultPath(project);
  let prefix = findNewComponentPrefix(project);
  return { path, prefix };
}

export function getActiveFilePath(
  projectPath: string,
  activeFile: string
): string {
  const nProjectPath = normalize('/' + projectPath);
  const nActiveFile = normalize(activeFile);
  const activeFilePath = nActiveFile.substring(
    nActiveFile.indexOf(nProjectPath)
  );
  return activeFilePath;
}

export function getNewComponentDetails(
  projectPath: string,
  componentName: string,
  prefix: string
): { selector: string; directory: string } {
  componentName = componentName.replace(projectPath, '');
  const { name, path } = parseName(projectPath, componentName);
  let selector = strings.dasherize(name);
  return {
    selector:
      !!prefix && prefix !== '' ? `${prefix}-${selector}` : `${selector}`,
    directory: join(path, name),
  };
}

export function createTemplates(
  fileContent: string,
  selector: string,
  start: number,
  end: number
): {
  newComponentTemplate: string;
  updatedComponentTemplate: string;
  foundItem: BindingMatch[];
} {
  const lines = fileContent.split('\n');
  const begin = lines.slice(0, start);
  let selection = lines.slice(start, end + 1).join('\n');

  const text = lines
    .slice(start, end + 1)
    .join(' ')
    .replace(/(\r\n|\n|\r)/gm, '');

  let parametersStringPart = '';

  const result = launchParsing(text);

  result.forEach((r) => (parametersStringPart += ` ${r.writeHtmlContent()}`));

  const finish = lines.slice(end + 1, lines.length);

  result.forEach((r) =>
    r.foundItems.forEach((i) => {
      selection = selection.replace(i, extractParameterName(i));
    })
  );

  return {
    newComponentTemplate: selection,
    updatedComponentTemplate: [
      ...begin,
      `<${selector}${parametersStringPart}></${selector}>`,
      ...finish,
    ].join('\n'),
    foundItem: result,
  };
}

export function tryUpdateTemplate(
  path: string,
  updateHtml: () => void,
  tree: Tree,
  foundItems: BindingMatch[],
  componentNameFromOption: string
): void {
  if (path.endsWith('.html')) {
    updateHtml();
  }
  if (path.endsWith('.ts') && !path.endsWith('.spec.ts')) {
    foundItems.forEach((p) => {
      const newComponent = tree.get(path);
      if (!!newComponent && !!newComponent.content) {
        const newComponentTsFile = p.writeTSContent(
          newComponent.content.toString(),
          path,
          componentNameFromOption
        );
        tree.overwrite(path, newComponentTsFile);
      }
    });
  }
}

export function logInFile(text: any, debugMode: string): void {
  if (debugMode === 'true') {
    const logFile = 'log.txt';
    console.log(text);
    fs.appendFileSync(logFile, '\n');
    const date = new Date(Date.now());
    fs.appendFileSync(logFile, `${date} - ${text}`);
  }
}

function findNewComponentPrefix(
  project: WorkspaceProject<ProjectType.Application>
): string {
  let prefix = '';
  if (!!project) {
    const componentSchematicSettings = '@schematics/angular:component';
    if (!!project.prefix) {
      prefix = project.prefix;
    } else if (
      !!project.schematics &&
      !!project.schematics[componentSchematicSettings] &&
      !!project.schematics[componentSchematicSettings].prefix
    ) {
      prefix = project.schematics[componentSchematicSettings].prefix;
    }
  }
  return prefix;
}
