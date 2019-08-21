'use strict';

class RuleOperandError extends Error {

    constructor(rule, operand){
        let s = typeof operand === 'object' ? 'type \'object' : '\'' + operand;
        super(`Invalid operand ${s}' for '${rule}' rule`);
    }

}

function arrayEqual(a, b){
    if(a.length !== b.length)
        return false;
    for(let i in a)
        if(a[i] !== b[i])
            return false;
    return true;
}

function buildReverses(context, aliases){
    for(let rule in context){
        let tRule = 'not' + rule.charAt(0).toUpperCase() + rule.slice(1);
        let alias = aliases[rule] || tRule;

        module.exports[alias] = function(...args){
            return !module.exports[rule].bind(this)(...args);
        };

        module.exports[alias].noParams = module.exports[rule].length == 1;
    }
}

function checkLength(input){
    return input && Number.isInteger(input.length) ? input.length : input;
}

module.exports = {

    in(input, hs){
        if(Array.isArray(hs)){
            this.data = { haystack: hs.join(',') };
            return hs.includes(input);
        }
        if(typeof hs === 'object'){
            this.data = { haystack: Object.keys(hs).join(',') };
            return input in hs;
        }
        if(typeof hs === 'string'){
            this.data = { haystack: hs };
            return hs.indexOf(input) >= 0;
        }
        throw new RuleOperandError(this.name, hs);
    },

    int: input => Number.isInteger(input),
    bool: input => typeof input === 'boolean',
    str: input => typeof input === 'string',
    num: input => typeof input === 'number',
    date: input => !isNaN(new Date(input)),
    func: input => typeof input === 'function',
    obj: input => JSON.stringify(input).charAt(0) === '{',
    arr: input => Array.isArray(input),

    match(input, regex){
        this.data = { model: regex };
        return regex.test(String(input));
    },

    eq(a, b){
        this.data = { val: b };
        if(typeof a !== 'object')
            return a === b;
        if(Array.isArray(a))
            return arrayEqual(a, b);
        if(a instanceof Date)
            return (new Date(a)).getTime() === (new Date(b)).getTime();
        throw new RuleOperandError(this.name, a);
    },

    min(input, limit){
        this.data = { limit: limit };
        input = checkLength(input);
        if(input instanceof Date)
            limit = new Date(limit);
        return input >= limit;
    },

    max(input, limit){
        input = checkLength(input);
        this.data = { limit: limit };
        if(input instanceof Date)
            limit = new Date(limit);
        return input <= limit;
    },

    between(input, min, max){
        this.data = { start: min, end: max };
        input = checkLength(input);
        if(input instanceof Date){
            min = new Date(min);
            max = new Date(max);
        }
        return input >= min && input <= max;
    },

    len(input, val){
        this.data = { val: val };
        if(Number.isInteger(input.length))
            return input.length === val;
        throw new RuleOperandError(this.name, input);
    },

    has(input, needle){
        this.data = { needle: needle };
        if(Array.isArray(input))
            return input.includes(needle);
        if(typeof input === 'object')
            return needle in input;
        if(typeof input === 'string')
            return input.indexOf(needle) >= 0;
        throw new RuleOperandError(this.name, input);
    },

    future: input => new Date(input) > new Date(),
    past: input => new Date(input) < new Date(),
    today(input){
        let d = new Date(input);
        let n = new Date();
        return d.getDate() == n.getDate() &&
               d.getMonth() == n.getMonth() &&
               d.getFullYear() == n.getFullYear();
    }
}

buildReverses(module.exports, {
    eq: 'dif',
    min: 'lt',
    max: 'gt',
    has: 'hasnt'
});
