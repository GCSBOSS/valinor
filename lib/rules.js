
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

        if(module.exports[rule].length == 1)
            module.exports[alias] = function(a, ...args){
                return !module.exports[rule].bind(this)(a, ...args);
            };
        else
            module.exports[alias] = function(...args){
                return !module.exports[rule].bind(this)(...args);
            };
    }
}

module.exports = {

    in(input, hs){
        if(Array.isArray(hs)){
            this.data = { haystack: hs.join(',') };
            return hs.includes(input);
        }
        if(typeof hs === 'object'){
            this.data = { haystack: Object.keys(hs).join(',') };
            return (input in hs);
        }
        if(typeof hs === 'string'){
            this.data = { haystack: hs };
            return hs.indexOf(input) >= 0;
        }
        return false;
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
			return a == new Date(b);
        return false;
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
        if(Number.isInteger(input.length))
            return input.length >= limit;
		if(input instanceof Date)
            limit = new Date(limit);
        return input >= limit;
    },

    max(input, limit){
        this.data = { limit: limit };
        if(Number.isInteger(input.length))
            return input.length <= limit;
		if(input instanceof Date)
            limit = new Date(limit);
        return input <= limit;
    },

	between(input, min, max){
		this.data = { min: min, max: max };
        if(Number.isInteger(input.length))
            return input.lenght >= min && input.lenght <= max;
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
    },

	has(input, needle){
		this.data = { needle: needle };
		if(Array.isArray(input))
			return input.includes(needle);
		if(typeof input === 'object')
			return needle in a;
		if(typeof input === 'string')
			return input.indexOf(needle) >= 0;
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
    gt: 'lte',
    lt: 'gte',
    min: 'maxEx',
    max: 'minEx',
    has: 'hasnt'
});

//console.log(module.exports);
