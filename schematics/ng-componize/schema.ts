import { Schema as ComponentOptions } from '@schematics/angular/component/schema';

export interface Schema extends ComponentOptions {
    activeFile: string;
    start: number;
    end: number;
}