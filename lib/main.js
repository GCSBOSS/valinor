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

    ctx.final = {};

    for(let key in spec){
        let result = spec[key].test(subject[key]);

        ctx.final[key] = result.final;

        if(result.ok == false){
            ctx[key] = result.errs;
            v = false;
        }
    }

    return v;
}

function validateEvery(ctx, subject, spec){
    let v = true;

    if(!Array.isArray(subject))
        return false;

    ctx.final = [];

    for(let i in subject){
        let sub = subject[i];
        let result = spec.test(sub);

        if(result.ok == false){
            ctx[i] = result.errs;
            v = false;
        }
        else
            ctx.final.push(result.final);
    }

    return v;
}

function validateSome(ctx, subject, spec){
    let v = false;

    if(!Array.isArray(subject))
        return false;

    ctx.final = [];

    let errors = [];
    for(let i in subject){
        let result = spec.test(subject[i]);
        if(result.ok == false)
            errors.push(result.errs);
        else{
            v = true;
            ctx.final.push(result.final);
        }
    }

    if(!v)
        ctx.errors = errors;

    return v;
}

function applyRules(input){
    // this => valinor
    let errs = [];
    let final = input;

    for(let rule of this.rules){
        let ctx = {};
        if(rule.fn.noParams || rule.fn.length == 1)
            var ok = rule.fn(input);
        else
            ok = rule.fn(ctx, input, ...rule.args);

        if(ctx.final){
            input = final = ctx.final;
            delete ctx.final;
        }

        if(ok === false)
            errs.push({ rule: rule.name, ...ctx });
    }

    if(errs.length > 0){
        final = new Error();
        final.errs = errs;
    }

    return { ok: errs.length == 0, errs, final };
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

    def(val){
        this.default = val;
        return this.proxy;
    }

    get opt() {
        this.optional = true;
        return this.proxy;
    }

    schema(spec) {
        for(let key in spec)
            if(!(spec[key] instanceof Valinor))
                throw new Error('All schema properties must be Valinors');

        this.rules.push({ fn: validateSchema, name: 'schema', args: [spec] });
        return this.proxy;
    }

    every(spec) {
        if(!(spec instanceof Valinor))
            throw new Error('Spec argument must be a Valinor');

        this.rules.push({ fn: validateEvery, name: 'every', args: [spec] });
        return this.proxy;
    }

    some(spec) {
        if(!(spec instanceof Valinor))
            throw new Error('Spec argument must be a Valinor');

        this.rules.push({ fn: validateSome, name: 'some', args: [spec] });
        return this.proxy;
    }

    alter(fn) {
        if(typeof fn != 'function')
            throw new Error('Alter first argument must be a function');

        this.rules.push({ fn: function(ctx, input){
            ctx.final = fn(input);
            return true;
        }, name: 'alter', args: [] });

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
