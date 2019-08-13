
function arrayEqual(a, b){
    for(let i in input)
        if(input[i] !== model[i])
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
    }
}

module.exports = {

    in(input, arr){
        this.data = { arr: arr.join(',') };
        if(Array.isArray(arr))
            return arr.includes(input);
        if(typeof arr === 'object')
            return (input in arr);
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
        regex.test(input);
    },

    eq(a, b){
        this.data = { val: b };
        if(Array.isArray(a))
            return arrayEqual(a, b);
        return typeof a === 'object' && a === b;
    },

    gt(a, b){
        this.data = { val: b };
        return a > b;
    },

    lt(a, b){
        this.data = { val: b };
        return a < b;
    },

    min(input, limit){
        this.data = { limit: limit };
        if(typeof input === 'number')
            return input >= limit;
        if(Number.isInteger(input.length))
            return input.length >= limit;
        return true;
    },

    max(input, limit){
        this.data = { limit: limit };
        if(typeof input === 'number')
            return input <= limit;
        if(Number.isInteger(input.length))
            return input.length <= limit;
        return true;
    },
	
	between(input, min, max){
		this.data = { min: min, max: max };
        if(typeof input === 'number')
            return input >= min && input <= max;
        if(Number.isInteger(input.length))
            return input.lenght >= min && input.lenght <= max;
        return true;
	},

    len(input, val){
        this.data = { val: val };
        if(Number.isInteger(input.length))
            return input.length === limit;
        return true;
    },
	
	has(input, needle){
		this.data = { needle: needle };
		if(Array.isArray(a))
			return a.includes(needle);
		if(typeof a === 'object')
			return needle in a;
		if(typeof a === 'string')
			return a.indexOf(needle) >= 0;
		return true;
	}

}

buildReverses(module.exports, {
    eq: 'diff',
    gt: 'ltOrEq',
    lt: 'gtOrEq',
    min: 'maxEx',
    max: 'minEx'
});
