
const { AssertionError } = require('assert');
const rules = require('./rules');

function isEmpty(value) {
    let t = typeof value;
    let empty = t === 'string' && value.trim() === '';
    return empty || t === 'undefined' || value === null;
}

function validateSchema(subject){
    let spec = this.args[0];
    let v = true;
    this.data = {};
    for(let key in spec){
        let r = spec[key].test(subject[key]);
        if(r !== true){
            this.data[key] = r;
            v = false;
        }
    }
    return v;
}

function applyRules(rules, input, context){
    let errs = [];
    for(let r of rules){
        if(r.custom)
            r.fn = r.fn.bind(context);
        if(!r.fn(input, ...r.args))
            errs.push({ rule: r.name, ...r.data });
    }

    return errs;
}

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

    test(input, fnContext) {

        if(this.optional && isEmpty(input))
            return true;

        if(this.parseJSON)
            input = JSON.parse(input);

        let errs = applyRules(this.rules, input, fnContext);
        return errs.length == 0 || errs;
    }

    assert(input, fnContext) {
        let r = this.test(input, fnContext);
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

    get json() {
        this.parseJSON = true;
        return this;
    }

    clip(data){
        if(typeof this.schemaSpec !== 'object')
            throw new Error('Can\'t clipt from a non-schema Valinor');
        if(this.parseJSON)
            data = JSON.parse(data);
        let r = {};
        for(let key in this.schemaSpec)
            r[key] = data[key];
        return r;
    }

    schema(spec) {
        this.schemaSpec = spec;

        for(let key in spec)
            if(!(spec[key] instanceof Valinor))
                throw new Error('All schema properties must be Valinors');

        this.rules.push({ fn: validateSchema, name: 'schema', args: [spec] });
        return this;
    }

    fn(name, cb){
        this.rules.push({ custom: true, fn: cb, name: name, args: [] });
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
