'use strict';

const rules = require('./rules');

function isEmpty(value) {
    let t = typeof value;
    let empty = t === 'string' && value.trim() === '';
    return empty || t === 'undefined' || value === null;
}

function resolveAll(promises, contexts, result, each){
    return new Promise(resolve => {
        Promise.all(promises).then(asyncRs => {
            asyncRs.forEach( (ar, i) => each(contexts[i], ar) );
            resolve(result());
        });
    });
}

function validateSchema(subject, spec){
    let v = true;
    this.data = {};

    let promises = [];
    let promKeys = [];

    if(typeof subject !== 'object')
        return false;

    for(let key in spec){
        let testR = spec[key].test(subject[key], this.context);

        if(testR instanceof Promise){
            promises.push(testR);
            promKeys.push(key);
        }
        else if(testR !== true){
            this.data[key] = testR;
            v = false;
        }
    }

    if(promises.length > 0)
        return resolveAll(promises, promKeys, () => v, (key, result) => {
            if(result === true)
                return;
            this.data[key] = result;
            v = false;
        });

    return v;
}

function applyRules(rules, input){
    // this => valinor
    let errs = [];
    let promises = [];
    let promRules = [];
    for(let r of rules){
        var vr = r.fn(input, ...r.args);
        if(vr instanceof Promise){
            promises.push(vr);
            promRules.push(r);
        }
        else if(!vr)
            errs.push({ rule: r.name, ...r.data });
    }

    if(promises.length > 0)
        return resolveAll(promises, promRules, () => errs, (r, result) => {
            if(!result)
                errs.push({ rule: r.name, ...r.data });
        });

    return errs;
}

class Valinor {

    constructor() {
        this.rules = [];
        this.optional = false;

        for(let rn in rules){

            let fn = function(...args){
                this.rules.push({ fn: rules[rn], name: rn, args });
                return this;
            }.bind(this);

            if(rules[rn].noParams || rules[rn].length == 1)
                Object.defineProperty(this, rn, { get: fn });
            else
                this[rn] = fn;
        }
    }

    test(input) {

        if(this.optional && isEmpty(input))
            return true;

        if(this.parseJSON)
            input = JSON.parse(input);

        this.rules.unshift({ fn: v => !isEmpty(v), name: 'required', args: [] });

        let applyR = applyRules.bind(this)(this.rules, input);

        if(applyR instanceof Promise)
            return new Promise(resolve =>
                applyR.then(errs => resolve(errs.length == 0 || errs)) );

        return applyR.length == 0 || applyR;
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

}

module.exports = new Proxy({}, {
    get(obj, prop){
        let v = new Valinor();
        let f = v[prop];
        return typeof f == 'function' ?  f.bind(v) : f;
    }
});
