import { ClassDeclaration, Project, SourceFile } from 'ts-morph';
import { BindingMatch } from './parser/binding-match';
import { BindingTypeLookup } from './parser/binding-type-lookup';
import { regexpConfigurations } from './parser/binding-type-lookup-regexp';
import { ParserFunctionsConfiguration } from './parser/parser-functions-configuration';

export const parserFunctionsConfigurations: ParserFunctionsConfiguration[] = [
  {
    names: [
      BindingTypeLookup.InterpolationLookup,
      BindingTypeLookup.AttributeLookup,
      BindingTypeLookup.AngularDirectiveLookup,
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

export function launchParsing(htmlContent: string): BindingMatch[] {
  let result: BindingMatch[] = [];

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
