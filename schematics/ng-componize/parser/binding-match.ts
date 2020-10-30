import { BindingTypeLookup } from './binding-type-lookup';

export interface BindingMatch {
  name: BindingTypeLookup;
  foundItems: string[];
  writeHtmlContent(): string;
  writeTSContent(
    newComponentContent: string,
    path: string,
    className: string
  ): string;
}
