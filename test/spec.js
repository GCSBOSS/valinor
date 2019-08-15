const assert = require('assert');
const v = require('../lib/main.js');


describe('Valinor', function(){

    it('Should ignore other validations when optional field is blank', function(){
        assert(v.opt.int.test('') === true);
    });

    describe('Asserting', function(){

        it('Should throw exception when asserting falsehoods', function(){
            assert.throws(() => {
                v.int.max(8).assert(9);
            }, /limit/);
        });

        it('Should not throw when asserting truths', function(){
            assert.doesNotThrow(() => {
                assert(v.int.max(8).assert(7) === true);
            });
        });

    });

    it('Should have reverse rules', function(){
        assert.strictEqual(typeof v.between, 'function');
        assert.strictEqual(typeof v.between, typeof v.notBetween);
    });

    it('Should aliased reverse rules', function(){
        assert.strictEqual(typeof v.eq, 'function');
        assert.strictEqual(typeof v.eq, typeof v.dif);
    });

    describe('Type Checking', function(){

        it('Should validate integers', function(){
            assert(v.int.test(0) === true);
            assert(v.int.test('a') !== true);
            assert(v.notInt.test('a') === true);
            assert(v.notInt.test(1) !== true);
        });

        it('Should validate booleans', function(){
            assert(v.bool.test(true) === true);
            assert(v.bool.test('a') !== true);
            assert(v.notBool.test('a') === true);
            assert(v.notBool.test(false) !== true);
        });

        it('Should validate strings', function(){
            assert(v.str.test('a') === true);
            assert(v.str.test(true) !== true);
            assert(v.notStr.test(false) === true);
            assert(v.notStr.test('a') !== true);
        });

        it('Should validate numbers', function(){
            assert(v.num.test(1.2) === true);
            assert(v.num.test('a') !== true);
            assert(v.notNum.test('a') === true);
            assert(v.notNum.test(4) !== true);
        });

        it('Should validate dates', function(){
            assert(v.date.test('12/12/2019') === true);
            assert(v.date.test('a') !== true);
            assert(v.notDate.test('a') === true);
            assert(v.notDate.test(new Date()) !== true);
        });

        it('Should validate functions', function(){
            assert(v.func.test(function(){}) === true);
            assert(v.func.test('a') !== true);
            assert(v.notFunc.test('a') === true);
            assert(v.notFunc.test(function(){}) !== true);
        });

        it('Should validate objects', function(){
            assert(v.obj.test({}) === true);
            assert(v.obj.test('a') !== true);
            assert(v.notObj.test([]) === true);
            assert(v.notObj.test({}) !== true);
        });

        it('Should validate arrays', function(){
            assert(v.arr.test([]) === true);
            assert(v.arr.test('a') !== true);
            assert(v.notArr.test({}) === true);
            assert(v.notArr.test([1]) !== true);
        });

    });

    describe('Primitive Validations', function(){

        it('Should validate number greater than', function(){
            assert(v.gt(0).test(1) === true);
            assert(v.gt(2.2).test(1) !== true);
        });

        it('Should validate number less than', function(){
            assert(v.lt(2).test(1.5) === true);
            assert(v.lt(1).test(1.5) !== true);
        });

        it('Should validate number greater than or equal to', function(){
            assert(v.gte(0).test(0) === true);
            assert(v.gte(2.2).test(1) !== true);
        });

        it('Should validate number less than or equal to', function(){
            assert(v.lte(2).test(2) === true);
            assert(v.lte(1).test(1.5) !== true);
        });

        it('Should validate equality', function(){
            assert(v.eq(2).test(2) === true);
            assert(v.eq(1).test('a') !== true);
        });

        it('Should validate difference', function(){
            assert(v.dif('a').test(2) === true);
            assert(v.dif('a').test('a') !== true);
        });

        it('Should validate if value is contained in array', function(){
            assert(v.in(['a', 'b', 'c']).test('b') === true);
            assert(v.in(['a', 'b']).test('c') !== true);
            assert(v.notIn(['a', 'c']).test('b') === true);
            assert(v.notIn(['a', 'b']).test('a') !== true);
        });

        it('Should validate if value is key of object', function(){
            assert(v.in({ a: true, b: 1, c: '' }).test('b') === true);
            assert(v.in({ a: true, b: 1 }).test('c') !== true);
            assert(v.notIn({ a: true, c: '' }).test('b') === true);
            assert(v.notIn({ a: true, b: 1 }).test('a') !== true);
        });

    });

    describe('Date Validations', function(){

        it('Should validate equal dates', function(){
            let d = new Date((new Date()).getTime() + 60000);
            assert(v.eq(d).test(d) === true);
            assert(v.eq(d).test(new Date()) !== true);
            assert(v.dif(d).test(new Date()) === true);
            assert(v.dif(d).test(d) !== true);
        });

        it('Should validate past dates', function(){
            assert(v.past.test('2000-10-10') === true);
            assert(v.past.test('9999-02-02') !== true);
            assert(v.notPast.test(new Date()) === true);
            assert(v.notPast.test('1999-09-09') !== true);
        });

        it('Should validate future dates', function(){
            assert(v.future.test('9999-02-02') === true);
            assert(v.future.test('2000-10-10') !== true);
            assert(v.notFuture.test(new Date()) === true);
            assert(v.notFuture.test('9999-02-02') !== true);
        });

        it('Should validate dates in the present day', function(){
            let od = new Date((new Date()).getTime() + 60000);
            assert(v.today.test(od) === true);
            assert(v.today.test('2000-10-10') !== true);
            assert(v.notToday.test('9999-02-02') === true);
            assert(v.notToday.test(od) !== true);
        });

        it('Should validate date before another', function(){
            let d = new Date();
            assert(v.max('9999-02-02').test(d) === true);
            assert(v.max('2000-10-10').test(d) !== true);
        });

        it('Should validate date after another', function(){
            let d = new Date();
            assert(v.min('2000-10-10').test(d) === true);
            assert(v.min('9999-02-02').test(d) !== true);
        });

        it('Should validate date in range', function(){
            let d = new Date((new Date()).getTime() - 60000);
            assert(v.between('2000-10-10', '9999-02-02').test(d) === true);
            assert(v.between(new Date(), '9999-02-02').test(d) !== true);
        });

    });

    describe('String Validations', function(){

        it('Should validate substrings', function(){
            assert(v.has('a').test('bab') === true);
            assert(v.has('b').test('cac') !== true);
            assert(v.hasnt('c').test('bab') === true);
            assert(v.hasnt('d').test('dad') !== true);
        });

        it('Should validate superstrings', function(){
            assert(v.in('bab').test('a') === true);
            assert(v.in('cac').test('b') !== true);
            assert(v.notIn('bab').test('c') === true);
            assert(v.notIn('dad').test('d') !== true);
        });

        it('Should validate string exact size', function(){
            assert(v.len(1).test('a') === true);
            assert(v.len(2).test('b') !== true);
            assert(v.notLen(3).test('c') === true);
            assert(v.notLen(4).test('dddd') !== true);
        });

        it('Should validate string according to regexp', function(){
            assert(v.match(/a/).test('a') === true);
            assert(v.match(/abc/).test('d') !== true);
            assert(v.notMatch(/[abc]/).test('d') === true);
            assert(v.notMatch(/\d/).test('1') !== true);
        });

        it('Should validate string max size', function(){
            assert(v.max(1).test('a') === true);
            assert(v.max(2).test('bbb') !== true);
            assert(v.maxEx(3).test('cc') === true);
            assert(v.maxEx(4).test('dddd') !== true);
        });

        it('Should validate string min size', function(){
            assert(v.min(1).test('a') === true);
            assert(v.min(2).test('b') !== true);
            assert(v.minEx(3).test('cccc') === true);
            assert(v.minEx(4).test('dddd') !== true);
        });

        it('Should validate string size range', function(){
            assert(v.between(1, 2).test('a') === true);
            assert(v.between(1, 2).test('bbb') !== true);
            assert(v.notBetween(1, 2).test('ccc') === true);
            assert(v.notBetween(1, 2).test('dd') !== true);
        });

    });

    describe('Array Validations', function(){

        it('Should validate arrays have the exactly same items and order', function(){
            assert(v.eq(['a', 'b', 'c']).test(['a', 'b', 'c']) === true);
            assert(v.eq(['a', 'b', 'c']).test(['a', 'b']) !== true);
            assert(v.dif(['a', 'b', 'c']).test(['a', 'b', 'f']) === true);
            assert(v.dif(['a', 'b', 'c']).test(['a', 'b', 'c']) !== true);
        });

        it('Should validate array contain item', function(){
            assert(v.has('a').test(['a']) === true);
            assert(v.has('b').test(['a']) !== true);
            assert(v.hasnt('c').test(['a', 'b']) === true);
            assert(v.hasnt('d').test(['a', 'd']) !== true);
        });

    });

    describe('Object Validations', function(){

        it('Should validate object has key', function(){
            assert(v.has('a').test({a: true}) === true);
            assert(v.has('b').test({a: true}) !== true);
            assert(v.hasnt('c').test({a: true}) === true);
            assert(v.hasnt('d').test({d: true}) !== true);
        });

        it('Should recursively validate object values as Valinors', function(){
            let subject = { a: true, b: 9, c: '' };
            let schema = v.obj.schema({
                a: v.bool,
                b: v.int.max(9),
                c: v.opt.num
            });
            assert(schema.test(subject) === true);
            subject.c = 'hey';
            assert(schema.test(subject) !== true);
        });

    });

    describe('Custom Validation', function(){

        it('Should validate according to given function', function(){
            assert(v.fn('noop', i => i).test(true) === true);
            assert(v.fn('noop', i => i).test(false) !== true);
        });

        it('Should bind sen context to custom validation function', function(){
            assert(v.fn('noop', function(){
                return this.a;
            }, { a: true }).test(true) === true);
        });

    });

});
