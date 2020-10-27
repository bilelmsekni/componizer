# Change Log

Componizer is still in beta stage. Your feedback and contributions are welcome.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Avoid having to install ng-componize as a dev dependency in projects
- Convert Angular bindings to component fields, inputs and outputs
- Refactoring styles (SCSS, CSS, ...)
- Create schematics for React/ReactNative
- Create schematics for VueJs
- Create schematics for Svelte ?

## [0.0.1]

- Initial release

## [0.0.2]

- [Fix] Extension packaging error

## [0.0.3]

- [Fix] Fixed wrong [slash after extraction](https://github.com/bilelmsekni/componizer/issues/5). Thanks to [Maykon Oliveira](https://github.com/maykon-oliveira)

## [0.0.4]

- [Feature] add skipImport question
- [Feature] add hidden debugMode
- [Feature] handle 3 types of bindings : attribute binding, two-way bindings, angular directive. new dependency : ts-morph  to manipulate new component typescript
- [Enhancement] update mochajs and add watch task
- [Enhancement] local install extension/schematic task
- Many thanks to [Hugo Mercier](https://github.com/hugoparis19) and [Alexandre Crochet](https://github.com/ekaliroots)