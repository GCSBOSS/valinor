'use strict';

const Rules = require('./rules');

function isEmpty(value) {
    let t = typeof value;
    let empty = t === 'string' && value.trim() === '';
    return empty || t === 'undefined' || value === null;
}

function validateSchema(ctx, subject, spec){
    let v = true;

    if(typeof subject !== 'object')
        return false;

    for(let key in spec){
        let result = spec[key].test(subject[key]);

        if(result.ok == false){
            ctx[key] = result.errs;
            v = false;
        }
    }

    return v;
}

function applyRules(input){
    // this => valinor
    let errs = [];
    
    for(let rule of this.rules){
        let ctx = {};
        if(rule.fn.noParams || rule.fn.length == 1)
            var ok = rule.fn(input);
        else
            ok = rule.fn(ctx, input, ...rule.args);

        if(ok === false)
            errs.push({ rule: rule.name, ...ctx });
    }

    return { ok: errs.length == 0, errs };
}

function pushRule(v, name, fn, ...args){
    v.rules.push({ fn, name, args });
    return v.proxy;
}

function getRule(v, name){
    if(name in v)
        return v[name];

    if(!(name in Rules))
        return;

    let fn = Rules[name];
    if(fn.noParams || fn.length == 1)
        return pushRule(v, name, fn);

    return pushRule.bind(null, v, name, fn);
}

class Valinor {

    constructor() {
        this.rules = [ { fn: val => !isEmpty(val), name: 'required', args: [] } ];
        this.proxy = new Proxy(this, { get: getRule });
        return this.proxy;
    }

    test(input) {

        if(this.optional && isEmpty(input))
            return { ok: true, v: this, empty: true, final: this.default  };

        return applyRules.call(this, input);
    }

    get opt() {
        this.optional = true;
        return this.proxy;
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
        return this.proxy;
    }

}

module.exports = new Proxy({}, {
    get(obj, prop){
        let v = new Valinor();
        let f = v[prop];
        return typeof f == 'function' ?  f.bind(v) : f;
    }
});
