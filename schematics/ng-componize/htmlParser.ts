import { ClassDeclaration, Project, SourceFile } from 'ts-morph';

// rename ??
export interface FoundItem {
  name: ConfigurationName;
  foundItems: string[];
  writeHtmlContent(): string;
  writeTSContent(
    newComponentContent: string,
    path: string,
    className: string
  ): string;
}

export enum ConfigurationName {
  InterpolationLookup,
  BindingLookup,
  AngularDireciveLookup,
}

export const parserFunctionsConfigurations: ParserFunctionsConfiguration[] = [
  {
    names: [
      ConfigurationName.InterpolationLookup,
      ConfigurationName.BindingLookup,
      ConfigurationName.AngularDireciveLookup,
    ],
    htmlUpdater(parameters: string[]): () => string {
      return function (): string {
        return parameters
          .map((param) => `[${extractParameterName(param)}]="${param}"`)
          .join(' ');
      };
    },
    computeNewComponentTs(
      parameters: string[]
    ): (
      newComponentContent: string,
      path: string,
      className: string
    ) => string {
      return function (
        newComponentContent: string,
        newComponentTsPath: string,
        className: string
      ): string {
        const project = new Project({});

        const newComponentTsFile = project.createSourceFile(
          newComponentTsPath,
          newComponentContent
        );

        const classNameInTsComponent = ComputeClassName(className);

        const myClass = newComponentTsFile.getClassOrThrow(
          classNameInTsComponent
        );

        addInputInImport(newComponentTsFile);

        addInputProperties(parameters, myClass);

        newComponentTsFile.formatText();
        return newComponentTsFile.getFullText();
      };
    },
  },
];

export function launchParsing(htmlContent: string): FoundItem[] {
  let result: FoundItem[] = [];

  for (const configuration of regexpConfigurations) {
    const foundItems = htmlContent.match(configuration.lookupRegexp);

    if (foundItems && foundItems.length > 0) {
      const parserFunctionsConfiguration = parserFunctionsConfigurations.filter(
        (c) => c.names.some((n) => n === configuration.name)
      )[0];
      result.push({
        name: configuration.name,
        foundItems: foundItems,
        writeHtmlContent: parserFunctionsConfiguration.htmlUpdater(foundItems),
        writeTSContent: parserFunctionsConfiguration.computeNewComponentTs(
          foundItems
        ),
      });
    }
  }

  return result;
}

export function extractParameterName(param: string): string {
  return param
    .slice(
      param.lastIndexOf('.') + 1,
      param.indexOf('|') >= 0 ? param.indexOf('|') : param.length
    )
    .replace('$', '')
    .trim();
}

interface RegexpConfiguration {
  name: ConfigurationName;
  description: string;
  lookupRegexp: RegExp;
}

interface ParserFunctionsConfiguration {
  names: ConfigurationName[];
  htmlUpdater(parameter: string[]): () => string;
  computeNewComponentTs(
    paramater: string[]
  ): (newComponentContent: string, path: string, className: string) => string;
}

const regexpConfigurations: RegexpConfiguration[] = [
  {
    name: ConfigurationName.InterpolationLookup,
    description: 'Looking for Interpolated string',
    lookupRegexp: /(?<={{\s*)([a-zA-Z\-0-9]*)(?=\s*}})/g,
  },
  {
    name: ConfigurationName.BindingLookup,
    description: 'Looking for data-bindind',
    lookupRegexp: /(?<=\[[0-9a-zA-Z\-]*\]=\")([\s*\|\?\.\$0-9a-zA-Z\-]*)(?=\")/g,
  },
  {
    name: ConfigurationName.AngularDireciveLookup,
    description: 'Looking for angular directives',
    lookupRegexp: /(?<=\*ng[a-zA-Z]*=\")([\s*\|\?\.\$0-9a-zA-Z\-]*)(?=\")/g,
  },
];

function addInputProperties(
  parameters: string[],
  myClass: ClassDeclaration
): void {
  parameters.forEach((parameter) => {
    myClass.insertProperty(0, {
      decorators: [
        {
          name: 'Input()',
        },
      ],
      name: extractParameterName(parameter),
      type: 'any',
    });
  });
}

function ComputeClassName(className: string): string {
  const indexOfSlash = className.lastIndexOf('/');
  if (indexOfSlash >= 0) {
    className = className.substring(indexOfSlash + 1);
  }
  return `${className.charAt(0).toUpperCase() + className.slice(1)}Component`;
}

function addInputInImport(myClassFile: SourceFile): void {
  const imports = myClassFile.getImportDeclarations();
  if (imports[0].getFullText().indexOf('Input') === -1) {
    imports[0].addNamedImport('Input');
  }
}
