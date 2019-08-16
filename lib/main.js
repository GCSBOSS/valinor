
const { AssertionError } = require('assert');
const rules = require('./rules');

class Valinor {

    constructor() {
        this.rules = [];
        this.optional = false;

        for(let rn in rules){

            let fn = function(...args){
                this.rules.push({ fn: rules[rn], name: rn, args: args });
                return this;
            }.bind(this);

            if(rules[rn].noParams || rules[rn].length == 1)
                Object.defineProperty(this, rn, { get: fn });
            else
                this[rn] = fn;
        }
    }

    test(input) {
        let t = typeof input;

        let unset = (t === 'string' && input.trim() === '')
            || t === 'undefined'
            || input === null;

        if(this.optional && unset)
            return true;

        let valid = true;
        let errs = [];
        for(let rule of this.rules){
            if(!rule.fn(input, ...rule.args)){
                errs.push({ rule: rule.name, ...rule.data });
                valid = false;
            }
        }
        
        return valid || errs;
    }

    assert(input) {
        let r = this.test(input);
        if(r !== true){
            let e = new AssertionError({
                stackStartFn: this.assert,
                actual: input,
                expected: r,
                operator: 'doesn\'t match the following criteria'
            });
            e.info = r;
            throw e;
        }
        return true;
    }

    get opt() {
        this.optional = true;
        return this;
    }

    schema(spec) {

        let fn = function(root){
            let v = true;
            this.data = {};

            for(let key in spec){
                let r = spec[key].test(root[key]);
                if(r !== true){
                    this.data[key] = r;
                    v = false;
                }
            }
            return v;
        };

        this.rules.push({ fn: fn, name: 'schema', args: [spec] });
        return this;
    }

    fn(name, cb, context){
        this.rules.push({ fn: cb.bind(context), name: name, args: [] });
        return this;
    }

}

module.exports = new Proxy({}, {

    get(obj, prop){
        let v = new Valinor();
        let f = v[prop];
        return typeof f == 'function' ?  f.bind(v) : f;
    }

});
