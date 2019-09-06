const assert = require('assert');
const v = require('../lib/main.js');

describe('Valinor', function(){

    it('Should ignore other validations when optional field is blank', function(){
        assert.strictEqual(v.opt.int.test(''), true);
    });

    it('Should be fail when wrong parameter type is sent to a rule', function(){
        assert.throws( () => v.in(4).test(false) );
        assert.throws( () => v.eq({}).test({}) );
        assert.throws( () => v.len(4).test(false) );
        assert.throws( () => v.has(4).test(false) );
    });

    it('Should have reverse rules', function(){
        assert.strictEqual(typeof v.between, 'function');
        assert.strictEqual(typeof v.between, typeof v.notBetween);
    });

    it('Should aliased reverse rules', function(){
        assert.strictEqual(typeof v.eq, 'function');
        assert.strictEqual(typeof v.eq, typeof v.dif);
    });

    describe('Asserting', function(){

        it('Should throw exception when asserting falsehoods', function(){
            assert.throws(() => {
                v.int.min(7).max(8).assert(9);
            }, /limit/);
        });

        it('Should not throw when asserting truths', function(){
            assert.doesNotThrow(() => {
                assert.strictEqual(v.int.between(6, 8).assert(7), true);
            });
        });

        it('Should assert with promises when async custom function is present', function(){
            var afn = data =>
                new Promise(resolve => setTimeout(() => resolve(data === 'foobar'), 600));
            assert.rejects(v.fn('noop', afn).assert('bar'));
            assert.doesNotReject(v.fn('noop', afn).assert('foobar'));
        });

    });

    describe('Clipping Objects', function(){

        it('Should throw exception when valinor is not a schema', function(){
            assert.throws(() => v.int.clip({}), /non-schema/);
        });

        it('Should remove properties fom object when they are not present in schema', function(){
            let r = v.schema({ a: v.opt.int }).clip({ b: true });
            assert.strictEqual(typeof r.b, 'undefined');
        });

        it('Should accept JSON input', function(){
            let r = v.json.schema({ a: v.opt.int }).clip('{"b":true}');
            assert.strictEqual(typeof r.b, 'undefined');
        });

    });

    describe('Type Checking', function(){

        it('Should validate integers', function(){
            assert.strictEqual(v.int.test(0), true);
            assert(v.int.test('a') !== true);
            assert.strictEqual(v.notInt.test('a'), true);
            assert(v.notInt.test(1) !== true);
        });

        it('Should validate booleans', function(){
            assert.strictEqual(v.bool.test(true), true);
            assert(v.bool.test('a') !== true);
            assert.strictEqual(v.notBool.test('a'), true);
            assert(v.notBool.test(false) !== true);
        });

        it('Should validate strings', function(){
            assert.strictEqual(v.str.test('a'), true);
            assert(v.str.test(true) !== true);
            assert.strictEqual(v.notStr.test(false), true);
            assert(v.notStr.test('a') !== true);
        });

        it('Should validate numbers', function(){
            assert.strictEqual(v.num.test(1.2), true);
            assert(v.num.test('a') !== true);
            assert.strictEqual(v.notNum.test('a'), true);
            assert(v.notNum.test(4) !== true);
        });

        it('Should validate dates', function(){
            assert.strictEqual(v.date.test('12/12/2019'), true);
            assert(v.date.test('a') !== true);
            assert.strictEqual(v.notDate.test('a'), true);
            assert(v.notDate.test(new Date()) !== true);
        });

        it('Should validate functions', function(){
            assert.strictEqual(v.func.test(function(){}), true);
            assert(v.func.test('a') !== true);
            assert.strictEqual(v.notFunc.test('a'), true);
            assert(v.notFunc.test(function(){}) !== true);
        });

        it('Should validate objects', function(){
            assert.strictEqual(v.obj.test({}), true);
            assert(v.obj.test('a') !== true);
            assert.strictEqual(v.notObj.test([]), true);
            assert(v.notObj.test({}) !== true);
        });

        it('Should validate arrays', function(){
            assert.strictEqual(v.arr.test([]), true);
            assert(v.arr.test('a') !== true);
            assert.strictEqual(v.notArr.test({}), true);
            assert(v.notArr.test([1]) !== true);
        });

    });

    describe('Primitive Validations', function(){

        it('Should validate number greater than', function(){
            assert.strictEqual(v.gt(0).test(1), true);
            assert(v.gt(2.2).test(1) !== true);
        });

        it('Should validate number less than', function(){
            assert.strictEqual(v.lt(2).test(1.5), true);
            assert(v.lt(1).test(1.5) !== true);
        });

        it('Should validate number greater than or equal to', function(){
            assert.strictEqual(v.min(0).test(0), true);
            assert(v.min(2.2).test(1) !== true);
        });

        it('Should validate number less than or equal to', function(){
            assert.strictEqual(v.max(2).test(2), true);
            assert(v.max(1).test(1.5) !== true);
        });

        it('Should validate equality', function(){
            assert.strictEqual(v.eq(2).test(2), true);
            assert(v.eq(1).test('a') !== true);
        });

        it('Should validate difference', function(){
            assert.strictEqual(v.dif('a').test(2), true);
            assert(v.dif('a').test('a') !== true);
        });

        it('Should validate if value is contained in array', function(){
            assert.strictEqual(v.in(['a', 'b', 'c']).test('b'), true);
            assert(v.in(['a', 'b']).test('c') !== true);
            assert.strictEqual(v.notIn(['a', 'c']).test('b'), true);
            assert(v.notIn(['a', 'b']).test('a') !== true);
        });

        it('Should validate if value is key of object', function(){
            assert.strictEqual(v.in({ a: true, b: 1, c: '' }).test('b'), true);
            assert(v.in({ a: true, b: 1 }).test('c') !== true);
            assert.strictEqual(v.notIn({ a: true, c: '' }).test('b'), true);
            assert(v.notIn({ a: true, b: 1 }).test('a') !== true);
        });

    });

    describe('Date Validations', function(){

        it('Should validate equal dates', function(){
            let d = new Date((new Date()).getTime() + 60000);
            assert.strictEqual(v.eq(d).test(d), true);
            assert(v.eq(d).test(new Date()) !== true);
            assert.strictEqual(v.dif(d).test(new Date()), true);
            assert(v.dif(d).test(d) !== true);
        });

        it('Should validate past dates', function(){
            assert.strictEqual(v.past.test('2000-10-10'), true);
            assert(v.past.test('9999-02-02') !== true);
            assert.strictEqual(v.notPast.test(new Date()), true);
            assert(v.notPast.test('1999-09-09') !== true);
        });

        it('Should validate future dates', function(){
            assert.strictEqual(v.future.test('9999-02-02'), true);
            assert(v.future.test('2000-10-10') !== true);
            assert.strictEqual(v.notFuture.test(new Date()), true);
            assert(v.notFuture.test('9999-02-02') !== true);
        });

        it('Should validate dates in the present day', function(){
            let od = new Date((new Date()).getTime() + 60000);
            assert.strictEqual(v.today.test(od), true);
            assert(v.today.test('2000-10-10') !== true);
            assert.strictEqual(v.notToday.test('9999-02-02'), true);
            assert(v.notToday.test(od) !== true);
        });

        it('Should validate date before another', function(){
            let d = new Date();
            assert.strictEqual(v.max('9999-02-02').test(d), true);
            assert(v.max('2000-10-10').test(d) !== true);
        });

        it('Should validate date after another', function(){
            let d = new Date();
            assert.strictEqual(v.min('2000-10-10').test(d), true);
            assert(v.min('9999-02-02').test(d) !== true);
        });

        it('Should validate date in range', function(){
            let d = new Date((new Date()).getTime() - 60000);
            assert.strictEqual(v.between('2000-10-10', '9999-02-02').test(d), true);
            assert(v.between(new Date(), '9999-02-02').test(d) !== true);
        });

    });

    describe('String Validations', function(){

        it('Should validate substrings', function(){
            assert.strictEqual(v.has('a').test('bab'), true);
            assert(v.has('b').test('cac') !== true);
            assert.strictEqual(v.hasnt('c').test('bab'), true);
            assert(v.hasnt('d').test('dad') !== true);
        });

        it('Should validate superstrings', function(){
            assert.strictEqual(v.in('bab').test('a'), true);
            assert(v.in('cac').test('b') !== true);
            assert.strictEqual(v.notIn('bab').test('c'), true);
            assert(v.notIn('dad').test('d') !== true);
        });

        it('Should validate string exact size', function(){
            assert.strictEqual(v.len(1).test('a'), true);
            assert(v.len(2).test('b') !== true);
            assert.strictEqual(v.notLen(3).test('c'), true);
            assert(v.notLen(4).test('dddd') !== true);
        });

        it('Should validate string according to regexp', function(){
            assert.strictEqual(v.match(/a/).test('a'), true);
            assert(v.match(/abc/).test('d') !== true);
            assert.strictEqual(v.notMatch(/[abc]/).test('d'), true);
            assert(v.notMatch(/\d/).test('1') !== true);
        });

        it('Should validate string max size', function(){
            assert.strictEqual(v.max(1).test('a'), true);
            assert(v.max(2).test('bbb') !== true);
        });

        it('Should validate string min size', function(){
            assert.strictEqual(v.min(1).test('a'), true);
            assert(v.min(2).test('b') !== true);
        });

        it('Should validate string size range', function(){
            assert.strictEqual(v.between(1, 2).test('a'), true);
            assert(v.between(1, 2).test('bbb') !== true);
            assert.strictEqual(v.notBetween(1, 2).test('ccc'), true);
            assert(v.notBetween(1, 2).test('dd') !== true);
        });

    });

    describe('Array Validations', function(){

        it('Should validate arrays have the exactly same items and order', function(){
            assert.strictEqual(v.eq(['a', 'b', 'c']).test(['a', 'b', 'c']), true);
            assert(v.eq(['a', 'b', 'c']).test(['a', 'b']) !== true);
            assert.strictEqual(v.dif(['a', 'b', 'c']).test(['a', 'b', 'f']), true);
            assert(v.dif(['a', 'b', 'c']).test(['a', 'b', 'c']) !== true);
        });

        it('Should validate array contain item', function(){
            assert.strictEqual(v.has('a').test(['a']), true);
            assert(v.has('b').test(['a']) !== true);
            assert.strictEqual(v.hasnt('c').test(['a', 'b']), true);
            assert(v.hasnt('d').test(['a', 'd']) !== true);
        });

    });

    describe('Object Validations', function(){

        it('Should validate object has key', function(){
            assert.strictEqual(v.has('a').test({a: true}), true);
            assert(v.has('b').test({a: true}) !== true);
            assert.strictEqual(v.hasnt('c').test({a: true}), true);
            assert(v.hasnt('d').test({d: true}) !== true);
        });

        it('Should fail when schema fields are not Valinors', function(){
            assert.throws(() => v.schema({ a: true }) );
        });

        it('Should recursively validate object values as Valinors', function(){
            let subject = { a: true, b: 9, c: '' };
            let schema = v.obj.schema({
                a: v.bool,
                b: v.int.max(9),
                c: v.opt.num
            });
            assert.strictEqual(schema.test(subject), true);
            subject.c = 'hey';
            assert(schema.test(subject) !== true);
        });

        it('Should accept JSON input on schema validation', function(){
            let subject = '{"a":true}';
            let schema = v.json.schema({ a: v.bool });
            assert.strictEqual(schema.test(subject), true);
        });

        it('Should propagate \'fn\' context to all fields', function(){
            let subject = { a: 12 };
            let schema = v.obj.schema({
                a: v.fn('foo', function(){
                    assert('bar' in this);
                    return true;
                })
            });
            schema.test(subject, { bar: 'abc'});
        });

        it('Should work async when any child has async custom function validation', async function(){
            var afn = data =>
                new Promise(resolve => setTimeout(() => resolve(data === 'foobar'), 600));

            let subject = { a: 'foobar', b: 9 };
            let schema = v.obj.schema({
                a: v.fn('async', afn),
                b: v.int.max(9)
            });
            assert.strictEqual(await schema.test(subject), true);
            subject.a = 'bar';
            assert(await schema.test(subject) !== true);
        });

    });

    describe('Custom Validation', function(){

        it('Should validate according to given function', function(){
            assert.strictEqual(v.fn('noop', i => i).test(true), true);
            assert(v.fn('noop', i => i).test(false) !== true);
        });

        it('Should bind sent context to all custom validations of the Valinor', function(){
            assert.strictEqual(v.fn('noop', function(){
                return this.a;
            }).test(true, { a: true }), true);
        });

        it('Should validate according to given async function', async function(){

            var afn = data =>
                new Promise(resolve => setTimeout(() => resolve(data === 'foobar'), 600));

            assert.strictEqual(await v.fn('noop', afn).test('foobar'), true);
            assert(await v.fn('noop', afn).test('bar') !== true);
        });

    });

});
