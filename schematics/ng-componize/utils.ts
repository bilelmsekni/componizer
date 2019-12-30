import { strings, join, basename, normalize } from '@angular-devkit/core';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { FileEntry } from '@angular-devkit/schematics';
import { getProject } from '@schematics/angular/utility/project';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { parseName } from '@schematics/angular/utility/parse-name';

export function getProjectDetails(workSpace: WorkspaceSchema, customProject?: string): { path: string, prefix: string } {
    const projectName = customProject || workSpace.defaultProject;
    const project = getProject(workSpace, projectName!);
    const path = buildDefaultPath(project);
    return { path, prefix: project && project.prefix || '' };
}

export function getActiveFilePath(path: string, activeFile: string): string {
    return join(normalize('/' + path), basename(normalize(activeFile)));
}

export function getNewComponentDetails(projectPath: string, componentName: string, prefix: string): { selector: string, directory: string } {
    const { name, path } = parseName(projectPath, componentName);

    let selector = strings.dasherize(name);
    return {
        selector: `${prefix}-${selector}`,
        directory: join(path, name)
    }
};

export function createTemplates(file: FileEntry, selector: string, start: number, end: number): { newTemplate: string, updatedTemplate: string } {
    const lines = file.content.toString().split('\n');
    const begin = lines.slice(0, start);
    const selection = lines.slice(start, end + 1);
    const finish = lines.slice(end + 1, lines.length);

    return {
        newTemplate: selection.join('\n'),
        updatedTemplate: [...begin, `<${selector}><${selector}/>`, ...finish].join('\n')
    }

}

export function tryUpdateTemplate(path: string, updateFn: () => void): void {
    if (path.endsWith('.html')) {
        updateFn();
    }
}