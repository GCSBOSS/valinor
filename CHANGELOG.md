# Valinor Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.3.1] - 2020-11-28

### Added
- `alter()` rule for mutating input value before next rules are applied

## [v0.3.0] - 2020-06-30

### Added
- a representation of the validated data in the output
- function to define a default value in case input has empty fields

### Changed
- test command to always output a useful data structure

### Removed
- `assert` function
- clipping function in favor of validated output
- json parsing function
- custom validation rule

## [v0.2.2] - 2020-01-19

### Fixed
- bug when testing undefined values with nested Schema valinors

## [v0.2.1] - 2019-09-06

### Added
- support for custom functions returning promises in 'fn' rule
- validation message for empty required fields

### Fixed
- undefined error on length rules when testing unexpected value types
- schema validation to propagate 'fn' context to every child field

## [v0.2.0] - 2019-08-17

### Added
- context parameter to test functions to bind every custom validation in the call

### Removed
- context parameter from custom validation function

## [v0.1.0] - 2019-08-16
- First officially published version.

[v0.1.0]: https://gitlab.com/GCSBOSS/valinor/-/tags/v0.1.0
[v0.2.0]: https://gitlab.com/GCSBOSS/valinor/-/tags/v0.2.0
[v0.2.1]: https://gitlab.com/GCSBOSS/valinor/-/tags/v0.2.1
[v0.2.2]: https://gitlab.com/GCSBOSS/valinor/-/tags/v0.2.2
[v0.3.0]: https://gitlab.com/GCSBOSS/valinor/-/tags/v0.3.0
