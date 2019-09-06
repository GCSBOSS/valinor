# Valinor Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.1] - 2019-09-06

### Add
- support for custom functions returning promises in 'fn' rule
- validation message for empty required fields

### Fix
- undefined error on length rules when testing unexpected value types
- schema validation to propagate 'fn' context to every child field

## [v0.2.0] - 2019-08-17

### Add
- context parameter to test functions to bind every custom validation in the call

### Remove
- context parameter from custom validation function

## [v0.1.0] - 2019-08-16
- First officially published version.

[v0.1.0]: https://gitlab.com/GCSBOSS/valinor/-/tags/v0.1.0
[v0.2.0]: https://gitlab.com/GCSBOSS/valinor/-/tags/v0.2.0
[v0.2.1]: https://gitlab.com/GCSBOSS/valinor/-/tags/v0.2.1
