import { BindingTypeLookup } from './binding-type-lookup';

export interface BindingTypeLookupRegexp {
  name: BindingTypeLookup;
  description: string;
  lookupRegexp: RegExp;
}

export const regexpConfigurations: BindingTypeLookupRegexp[] = [
  {
    name: BindingTypeLookup.InterpolationLookup,
    description: 'Looking for Interpolated string',
    lookupRegexp: /(?<={{\s*)([a-zA-Z\-0-9]*)(?=\s*}})/g,
  },
  {
    name: BindingTypeLookup.AttributeLookup,
    description: 'Looking for data-bindind',
    lookupRegexp: /(?<=\[[0-9a-zA-Z\-]*\]=\")([\s*\|\?\.\$0-9a-zA-Z\-]*)(?=\")/g,
  },
  {
    name: BindingTypeLookup.AngularDirectiveLookup,
    description: 'Looking for angular directives',
    lookupRegexp: /(?<=\*ng[a-zA-Z]*=\")([\s*\|\?\.\$0-9a-zA-Z\-]*)(?=\")/g,
  },
];
