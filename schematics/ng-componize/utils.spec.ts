import { expect } from 'chai';
import { createTemplates } from './utils';

describe('utils', () => {
  it('createTemplates is working for simple binding', () => {
    const fileContent = `
            <div *ngIf="displayTitle">coucou</div>
            <div>stop</div>
        `;
    const selector = 'app-componized';
    const start = 0;
    const end = 1;

    const templatesResult = createTemplates(fileContent, selector, start, end);

    expect(templatesResult.newComponentTemplate).to.contain(
      '<div *ngIf="displayTitle">coucou</div>'
    );
    expect(templatesResult.updatedComponentTemplate).to.contain(
      '<app-componized  [displayTitle]="displayTitle"></app-componized>'
    );
    expect(templatesResult.foundItem.length).to.equal(1);
  });

  it('createTemplates is working for complex binding', () => {
    const fileContent = `
        <div *ngIf="displayTitle">{{ title }}</div>
        <app-custom [value]="value" [input2]="user?.name | async"></app-custom>    
        `;
    const selector = 'app-componized';
    const start = 0;
    const end = 2;

    const templatesResult = createTemplates(fileContent, selector, start, end);

    expect(templatesResult.newComponentTemplate).to.contain(
      '<div *ngIf="displayTitle">{{ title }}</div>'
    );
    expect(templatesResult.newComponentTemplate).to.contain(
      '<app-custom [value]="value" [input2]="name"></app-custom>'
    );
    expect(templatesResult.updatedComponentTemplate).to.contain(
      '<app-componized  [title]="title" [value]="value" [name]="user?.name | async" [displayTitle]="displayTitle"></app-componized>'
    );
    expect(templatesResult.foundItem.length).to.equal(3);
  });
});
