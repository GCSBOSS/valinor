# [Valinor](https://gitlab.com/GCSBOSS/valinor)

A library for writing uncluttered, easy to read field and schema validations.

## Get Started

Install with: `npm i -P valinor`

In your code:

```js
const v = require('valinor');

// Validate one variable in place.
let result = v.int.between(0, 32).test(33);
console.log(result);

// Reuse one valinor.
let goodPwd = v.str.min(8);
console.log(
    goodPwd.test('abc'),
    goodPwd.test('abcdefgh'),
    goodPwd.test(null)
);

// Define a object schema valinor.
let schema = v.schema({
    name: v.str.match(/^[A-Z][a-z]+\ [A-Z][a-z]+$/),
    password: v.str.min(8),
    birth: v.date.min('2001-01-01').past
});

result = schema.test({
    name: 'John Doe',
    password: 'abcdefgh',
    birth: new Date('1999-01-01')
});

// Prepare valinor to parse a JSON input.
schema.json.test("{\"totally\":\"invalid\"}");

// Remove an object's properties that are not present in the schema.
let coolData = schema.clip("{\"totally\":\"invalid\"}");

// Ignore empty/null values on optional valinors.
let schemaWithOpt = v.schema({
    firstName: v.str,
    lastName: v.opt.str
});

console.log(schemaWithOpt.test({
    firstName: 'John',
    lastName: null
}));

```

`v.test()` method output is always an object with the following keys:

- `ok`: Whether validation passed.
- `errs`: Array containing all found validation errors. Empty array if all passed.

Check the [full rule reference](#rule-reference) for all the validations available.

## Reporting Bugs
If you have found any problems with this module, please:

1. [Open an issue](https://gitlab.com/GCSBOSS/valinor/issues/new).
2. Describe what happened and how.
3. Also in the issue text, reference the label `~bug`.

We will make sure to take a look when time allows us.

## Proposing Features
If you wish to get that awesome feature or have some advice for us, please:
1. [Open an issue](https://gitlab.com/GCSBOSS/valinor/issues/new).
2. Describe your ideas.
3. Also in the issue text, reference the label `~proposal`.

## Contributing
If you have spotted any enhancements to be made and is willing to get your hands
dirty about it, fork us and
[submit your merge request](https://gitlab.com/GCSBOSS/valinor/merge_requests/new)
so we can collaborate effectively.

## Method Reference

- `json`: Signal for object functions to parse JSON strings.
- `test ( input )`: Returns true if the input is valid. Returns an array or problems otherwise.
- `clip ( input )`: Fails if the Valinor is not an schema. Return the ipunt object with only the properties present on the schema Valinor.

## Rule Reference

- `in ( array )`: Check if value can be found inside given array.
- `num`: Check if value is a number.
- `bool`: Check if value is a boolean.
- `date`: Check if value is a date.
- `obj`: Check if value is an object. Will fail for arrays, dates and JSON strings.
- `str`: Check if value is a string.
- `func`: Check if value is a function. Will fail for BoundFunctions and AsyncFunctions.
- `arr`: Check if value is array. Will fail for JSON strings.
- `match ( regex )`: Check if value matches the given regex.
- `eq ( primitive | date | array )`: Check if values are sctrictly equal. In Arrays, consider also order of elements.
- `gt ( primitive | date | array )`: Check if value or it's length is greater than subject.
- `lt ( primitive | date | array )`: Check if value or it's length is less than subject.
- `min ( primitive | date | array )`: Check if value or it's length is equal or greater than the subject.
- `max ( primitive | date | array )`: Check if value or it's length is equal or less than the subject.
- `between ( primitive | date | array )`: Check if value or it's length is inclusively inside the given range.
- `len ( string | array )`: Check if length is exactly the given subject.
- `has ( string | object | array )`: Check if the value contains the subject. For string, object and array it checks respectively substring, keys and values.
- `future ( date )`: Check if a date is in the future.
- `past ( date )`: Check if a date is in the past.
- `today ( date )`: Check if a date time is today.
- `schema ( object )`: Check if object's keys follows all their respective Valinor rules.
- `opt`: Mark the Valinor as optional, so skipping any validations for null, undefined or '' values.
- `notIn ( array )`: Check if value cannot be found inside given array.
- `notNum`, `notBool`, `notDate`, `notObj`, `notStr`, `notFunc`, `notArr`: Reverse type checkers. Read counterparts above for more info.
- `notMatch ( regex )`: Check if value does not matche the given regex.
- `dif ( primitive | date | array )`: Check if values are sctrictly different. In Arrays, consider also order of elements.
- `notBetween ( primitive | date | array )`: Check if value or it's length is exclusively not inside the given range.
- `notLen ( string | array )`: Check if length is different than the given subject.
- `hasnt ( string | object | array )`: Check if the value does not contain the subject. For string, object and array it checks respectively substring, keys and values.
- `notFuture ( date )`: Check if a date is NOT in the future.
- `notPast ( date )`: Check if a date is NOT in the past.
- `notToday ( date )`: Check if a date time is NOT today.
