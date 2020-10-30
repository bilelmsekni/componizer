import { BindingTypeLookup } from './binding-type-lookup';

export interface ParserFunctionsConfiguration {
  names: BindingTypeLookup[];
  htmlUpdater(parameter: string[]): () => string;
  computeNewComponentTs(
    paramater: string[]
  ): (newComponentContent: string, path: string, className: string) => string;
}
