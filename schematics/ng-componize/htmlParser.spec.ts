import { expect } from 'chai';
import {
  extractParameterName,
  launchParsing,
  parserFunctionsConfigurations,
} from './htmlParser';
import { BindingTypeLookup } from './parser/binding-type-lookup';

describe('htmlParser', () => {
  it('launchParsing can find AngularDirectiveLookup binding', () => {
    const selectionToComponize = '<div *ngIf="displayTitle">coucou</div>';

    const foundItems = launchParsing(selectionToComponize);

    expect(foundItems.length).to.equal(1);
    const binding = foundItems[0];
    expect(binding.foundItems.length).to.equal(1);
    expect(binding.foundItems[0]).to.equal('displayTitle');
  });

  it('launchParsing can find InterpolationLookup binding', () => {
    const selectionToComponize = '<div>{{value1}}</div>';

    const foundItems = launchParsing(selectionToComponize);

    expect(foundItems.length).to.equal(1);
    const binding = foundItems[0];
    expect(binding.foundItems.length).to.equal(1);
    expect(binding.foundItems[0]).to.equal('value1');
  });

  it('launchParsing can find AttributeLookup binding', () => {
    const selectionToComponize =
      '<custom-directive [input1]="user.name | async">content</custom-directive>';

    const foundItems = launchParsing(selectionToComponize);

    expect(foundItems.length).to.equal(1);
    const binding = foundItems[0];
    expect(binding.foundItems.length).to.equal(1);
    expect(binding.foundItems[0]).to.equal('user.name | async');
  });

  it('launchParsing can find several different bindings', () => {
    const selectionToComponize = '<div *ngIf="displayTitle">{{value1}}</div>';

    const foundItems = launchParsing(selectionToComponize);

    expect(foundItems.length).to.equal(2);
    const binding1 = foundItems[0];
    expect(binding1.foundItems.length).to.equal(1);
    expect(binding1.foundItems[0]).to.equal('value1');
    const binding2 = foundItems[1];
    expect(binding2.foundItems.length).to.equal(1);
    expect(binding2.foundItems[0]).to.equal('displayTitle');
  });

  it('launchParsing can find several different and same bindings', () => {
    const selectionToComponize =
      '<div *ngIf="displayTitle">{{value1}} <span>{{value2}}</span></div>';

    const foundItems = launchParsing(selectionToComponize);

    expect(foundItems.length).to.equal(2);
    const binding1 = foundItems[0];
    expect(binding1.name).to.equal(BindingTypeLookup.InterpolationLookup);
    expect(binding1.foundItems.length).to.equal(2);
    expect(binding1.foundItems[0]).to.equal('value1');
    expect(binding1.foundItems[1]).to.equal('value2');
    const binding2 = foundItems[1];
    expect(binding2.name).to.equal(BindingTypeLookup.AngularDirectiveLookup);
    expect(binding2.foundItems.length).to.equal(1);
    expect(binding2.foundItems[0]).to.equal('displayTitle');
  });

  it('extractParameterName extract the correct parameter name from a complex parameter with a pipe', () => {
    const parameter = 'user.name | async';

    const extractedParameter = extractParameterName(parameter);

    expect(extractedParameter).to.equal('name');
  });

  it('extractParameterName extract the correct parameter name from a simple parameter object', () => {
    const parameter = 'user.name';

    const extractedParameter = extractParameterName(parameter);

    expect(extractedParameter).to.equal('name');
  });

  it('extractParameterName extract the correct parameter name from a simple parameter object', () => {
    const parameter = 'user';

    const extractedParameter = extractParameterName(parameter);

    expect(extractedParameter).to.equal('user');
  });

  it('computeNewComponentTs add correctly the property', () => {
    const parserFunctionsConfig = parserFunctionsConfigurations[0];

    const bindings = ['value'];

    const computeNewComponentTs = parserFunctionsConfig.computeNewComponentTs(
      bindings
    );

    const newComponentContent = `
        import { Component, OnInit } from '@angular/core';
        @Component({
            selector: 'app-hello',
            templateUrl: './hello.component.html',
            styleUrls: ['./hello.component.scss']
        })
        export class HelloComponent implements OnInit {
            constructor() { }
            ngOnInit(): void {
            }
        }
    `;
    const path = './whatever';
    const result = computeNewComponentTs(newComponentContent, path, 'hello');

    expect(result).to.contain(', Input');
    expect(result).to.contain('@Input()');
    expect(result).to.contain('value: any;');
  });
});
