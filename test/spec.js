const assert = require('assert');
const v = require('../lib/main.js');


describe('Rules', function(){

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
            assert(v.int.test(0));
            assert(v.int.test('a') !== true);
            assert(v.notInt.test('a'));
            assert(v.notInt.test(1) !== true);
        });

        it('Should validate booleans', function(){
            assert(v.bool.test(true));
            assert(v.bool.test('a') !== true);
            assert(v.notBool.test('a'));
            assert(v.notBool.test(false) !== true);
        });

        it('Should validate strings', function(){
            assert(v.str.test('a'));
            assert(v.str.test(true) !== true);
            assert(v.notStr.test(false));
            assert(v.notStr.test('a') !== true);
        });

        it('Should validate numbers', function(){
            assert(v.num.test(1.2));
            assert(v.num.test('a') !== true);
            assert(v.notNum.test('a'));
            assert(v.notNum.test(4) !== true);
        });

        it('Should validate dates', function(){
            assert(v.date.test('12/12/2019'));
            assert(v.date.test('a') !== true);
            assert(v.notDate.test('a'));
            assert(v.notDate.test(new Date()) !== true);
        });

        it('Should validate functions', function(){
            assert(v.func.test(function(){}));
            assert(v.func.test('a') !== true);
            assert(v.notFunc.test('a'));
            assert(v.notFunc.test(function(){}) !== true);
        });

        it('Should validate objects', function(){
            assert(v.obj.test({}));
            assert(v.obj.test('a') !== true);
            assert(v.notObj.test([]));
            assert(v.notObj.test({}) !== true);
        });

        it('Should validate arrays', function(){
            assert(v.arr.test([]));
            assert(v.arr.test('a') !== true);
            assert(v.notArr.test({}));
            assert(v.notArr.test([1]) !== true);
        });

    });

    describe('Primitive Comparisons', function(){

        it('Should validate number greater than', function(){
            assert(v.gt(0).test(1));
            assert(v.gt(2.2).test(1) !== true);
        });

        it('Should validate number less than', function(){
            assert(v.lt(2).test(1.5));
            assert(v.lt(1).test(1.5) !== true);
        });

        it('Should validate number greater than or equal to', function(){
            assert(v.gte(0).test(0));
            assert(v.gte(2.2).test(1) !== true);
        });

        it('Should validate number less than or equal to', function(){
            assert(v.lte(2).test(2));
            assert(v.lte(1).test(1.5) !== true);
        });

        it('Should validate equality', function(){
            assert(v.eq(2).test(2));
            assert(v.eq(1).test('a') !== true);
        });

        it('Should validate difference', function(){
            assert(v.dif('a').test(2));
            assert(v.dif('a').test('a') !== true);
        });

    });

    describe('Date Validations', function(){

        it('Should validate past dates', function(){
            assert(v.past.test('2000-10-10'));
            assert(v.past.test('9999-02-02') !== true);
            assert(v.notPast.test(new Date()));
            assert(v.notPast.test('1999-09-09') !== true);
        });

        it('Should validate future dates', function(){
            assert(v.future.test('9999-02-02'));
            assert(v.future.test('2000-10-10') !== true);
            assert(v.notFuture.test(new Date()));
            assert(v.notFuture.test('9999-02-02') !== true);
        });

        it('Should validate dates in the present day', function(){
            let od = new Date((new Date()).getTime() + 60000);
            assert(v.today.test(od));
            assert(v.today.test('2000-10-10') !== true);
            assert(v.notToday.test('9999-02-02'));
            assert(v.notToday.test(od) !== true);
        });

        it('Should validate dates in the present day', function(){
            let od = new Date((new Date()).getTime() + 60000);
            assert(v.today.test(od));
            assert(v.today.test('2000-10-10') !== true);
            assert(v.notToday.test('9999-02-02'));
            assert(v.notToday.test(od) !== true);
        });

    });

    describe('String Validations', function(){

        it('Should validate substrings', function(){
            assert(v.has('a').test('bab'));
            assert(v.has('b').test('cac') !== true);
            assert(v.hasnt('c').test('bab'));
            assert(v.hasnt('d').test('dad') !== true);
        });

        it('Should validate superstrings', function(){
            assert(v.in('bab').test('a'));
            assert(v.in('cac').test('b') !== true);
            assert(v.notIn('bab').test('c'));
            assert(v.notIn('dad').test('d') !== true);
        });

        it('Should validate string exact size', function(){
            assert(v.in('bab').test('a'));
            assert(v.in('cac').test('b') !== true);
            assert(v.notIn('bab').test('c'));
            assert(v.notIn('dad').test('d') !== true);
        });

        it('Should validate string exact size', function(){
            assert(v.len(1).test('a'));
            assert(v.len(2).test('b') !== true);
            assert(v.notLen(3).test('c'));
            assert(v.notLen(4).test('dddd') !== true);
        });

        it('Should validate string according to regexp', function(){
            assert(v.match(/a/).test('a'));
            assert(v.match(/abc/).test('d') !== true);
            assert(v.notMatch(/[abc]/).test('d'));
            assert(v.notMatch(/\d/).test('1') !== true);
        });

        it('Should validate string max size', function(){
            assert(v.len(1).test('a'));
            assert(v.len(2).test('b') !== true);
            assert(v.notLen(3).test('c'));
            assert(v.notLen(4).test('dddd') !== true);
        });

    });

});
