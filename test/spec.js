const assert = require('assert');
const v = require('../lib/main.js');

describe('Valinor', function(){

    it('Should ignore other validations when optional field is blank', function(){
        assert.strictEqual(v.opt.int.test('').ok, true);
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

    describe('Type Checking', function(){

        it('Should validate integers', function(){
            assert.strictEqual(v.int.test(0).ok, true);
            assert.strictEqual(v.int.test('a').ok, false);
            assert.strictEqual(v.notInt.test('a').ok, true);
            assert.strictEqual(v.notInt.test(1).ok, false);
        });

        it('Should validate booleans', function(){
            assert.strictEqual(v.bool.test(true).ok, true);
            assert.strictEqual(v.bool.test('a').ok, false);
            assert.strictEqual(v.notBool.test('a').ok, true);
            assert.strictEqual(v.notBool.test(false).ok, false);
        });

        it('Should validate strings', function(){
            assert.strictEqual(v.str.test('a').ok, true);
            assert.strictEqual(v.str.test(true).ok, false);
            assert.strictEqual(v.notStr.test(false).ok, true);
            assert.strictEqual(v.notStr.test('a').ok, false);
        });

        it('Should validate numbers', function(){
            assert.strictEqual(v.num.test(1.2).ok, true);
            assert.strictEqual(v.num.test('a').ok, false);
            assert.strictEqual(v.notNum.test('a').ok, true);
            assert.strictEqual(v.notNum.test(4).ok, false);
        });

        it('Should validate dates', function(){
            assert.strictEqual(v.date.test('12/12/2019').ok, true);
            assert.strictEqual(v.date.test('a').ok, false);
            assert.strictEqual(v.notDate.test('a').ok, true);
            assert.strictEqual(v.notDate.test(new Date()).ok, false);
        });

        it('Should validate functions', function(){
            assert.strictEqual(v.func.test(function(){}).ok, true);
            assert.strictEqual(v.func.test('a').ok, false);
            assert.strictEqual(v.notFunc.test('a').ok, true);
            assert.strictEqual(v.notFunc.test(function(){}).ok, false);
        });

        it('Should validate objects', function(){
            assert.strictEqual(v.obj.test({}).ok, true);
            assert.strictEqual(v.obj.test('a').ok, false);
            assert.strictEqual(v.notObj.test([]).ok, true);
            assert.strictEqual(v.notObj.test({}).ok, false);
        });

        it('Should validate arrays', function(){
            assert.strictEqual(v.arr.test([]).ok, true);
            assert.strictEqual(v.arr.test('a').ok, false);
            assert.strictEqual(v.notArr.test({}).ok, true);
            assert.strictEqual(v.notArr.test([1]).ok, false);
        });

    });

    describe('Primitive Validations', function(){

        it('Should validate number greater than', function(){
            assert.strictEqual(v.gt(0).test(1).ok, true);
            assert.strictEqual(v.gt(2.2).test(1).ok, false);
        });

        it('Should validate number less than', function(){
            assert.strictEqual(v.lt(2).test(1.5).ok, true);
            assert.strictEqual(v.lt(1).test(1.5).ok, false);
        });

        it('Should validate number greater than or equal to', function(){
            assert.strictEqual(v.min(0).test(0).ok, true);
            assert.strictEqual(v.min(2.2).test(1).ok, false);
        });

        it('Should validate number less than or equal to', function(){
            assert.strictEqual(v.max(2).test(2).ok, true);
            assert.strictEqual(v.max(1).test(1.5).ok, false);
        });

        it('Should validate equality', function(){
            assert.strictEqual(v.eq(2).test(2).ok, true);
            assert.strictEqual(v.eq(1).test('a').ok, false);
        });

        it('Should validate difference', function(){
            assert.strictEqual(v.dif('a').test(2).ok, true);
            assert.strictEqual(v.dif('a').test('a').ok, false);
        });

        it('Should validate if value is contained in array', function(){
            assert.strictEqual(v.in(['a', 'b', 'c']).test('b').ok, true);
            assert.strictEqual(v.in(['a', 'b']).test('c').ok, false);
            assert.strictEqual(v.notIn(['a', 'c']).test('b').ok, true);
            assert.strictEqual(v.notIn(['a', 'b']).test('a').ok, false);
        });

        it('Should validate if value is key of object', function(){
            assert.strictEqual(v.in({ a: true, b: 1, c: '' }).test('b').ok, true);
            assert.strictEqual(v.in({ a: true, b: 1 }).test('c').ok, false);
            assert.strictEqual(v.notIn({ a: true, c: '' }).test('b').ok, true);
            assert.strictEqual(v.notIn({ a: true, b: 1 }).test('a').ok, false);
        });

    });

    describe('Date Validations', function(){

        it('Should validate equal dates', function(){
            let d = new Date(new Date().getTime() + 60000);
            assert.strictEqual(v.eq(d).test(d).ok, true);
            assert.strictEqual(v.eq(d).test(new Date()).ok, false);
            assert.strictEqual(v.dif(d).test(new Date()).ok, true);
            assert.strictEqual(v.dif(d).test(d).ok, false);
        });

        it('Should validate past dates', function(){
            assert.strictEqual(v.past.test('2000-10-10').ok, true);
            assert.strictEqual(v.past.test('9999-02-02').ok, false);
            assert.strictEqual(v.notPast.test(new Date()).ok, true);
            assert.strictEqual(v.notPast.test('1999-09-09').ok, false);
        });

        it('Should validate future dates', function(){
            assert.strictEqual(v.future.test('9999-02-02').ok, true);
            assert.strictEqual(v.future.test('2000-10-10').ok, false);
            assert.strictEqual(v.notFuture.test(new Date()).ok, true);
            assert.strictEqual(v.notFuture.test('9999-02-02').ok, false);
        });

        it('Should validate dates in the present day', function(){
            let od = new Date(new Date().getTime() + 60000);
            assert.strictEqual(v.today.test(od).ok, true);
            assert.strictEqual(v.today.test('2000-10-10').ok, false);
            assert.strictEqual(v.notToday.test('9999-02-02').ok, true);
            assert.strictEqual(v.notToday.test(od).ok, false);
        });

        it('Should validate date before another', function(){
            let d = new Date();
            assert.strictEqual(v.max('9999-02-02').test(d).ok, true);
            assert.strictEqual(v.max('2000-10-10').test(d).ok, false);
        });

        it('Should validate date after another', function(){
            let d = new Date();
            assert.strictEqual(v.min('2000-10-10').test(d).ok, true);
            assert.strictEqual(v.min('9999-02-02').test(d).ok, false);
        });

        it('Should validate date in range', function(){
            let d = new Date(new Date().getTime() - 60000);
            assert.strictEqual(v.between('2000-10-10', '9999-02-02').test(d).ok, true);
            assert.strictEqual(v.between(new Date().ok, '9999-02-02').test(d).ok, false);
        });

    });

    describe('String Validations', function(){

        it('Should validate substrings', function(){
            assert.strictEqual(v.has('a').test('bab').ok, true);
            assert.strictEqual(v.has('b').test('cac').ok, false);
            assert.strictEqual(v.hasnt('c').test('bab').ok, true);
            assert.strictEqual(v.hasnt('d').test('dad').ok, false);
        });

        it('Should validate superstrings', function(){
            assert.strictEqual(v.in('bab').test('a').ok, true);
            assert.strictEqual(v.in('cac').test('b').ok, false);
            assert.strictEqual(v.notIn('bab').test('c').ok, true);
            assert.strictEqual(v.notIn('dad').test('d').ok, false);
        });

        it('Should validate string exact size', function(){
            assert.strictEqual(v.len(1).test('a').ok, true);
            assert.strictEqual(v.len(2).test('b').ok, false);
            assert.strictEqual(v.notLen(3).test('c').ok, true);
            assert.strictEqual(v.notLen(4).test('dddd').ok, false);
        });

        it('Should validate string according to regexp', function(){
            assert.strictEqual(v.match(/a/).test('a').ok, true);
            assert.strictEqual(v.match(/abc/).test('d').ok, false);
            assert.strictEqual(v.notMatch(/[abc]/).test('d').ok, true);
            assert.strictEqual(v.notMatch(/\d/).test('1').ok, false);
        });

        it('Should validate string max size', function(){
            assert.strictEqual(v.max(1).test('a').ok, true);
            assert.strictEqual(v.max(2).test('bbb').ok, false);
        });

        it('Should validate string min size', function(){
            assert.strictEqual(v.min(1).test('a').ok, true);
            assert.strictEqual(v.min(2).test('b').ok, false);
        });

        it('Should validate string size range', function(){
            assert.strictEqual(v.between(1, 2).test('a').ok, true);
            assert.strictEqual(v.between(1, 2).test('bbb').ok, false);
            assert.strictEqual(v.notBetween(1, 2).test('ccc').ok, true);
            assert.strictEqual(v.notBetween(1, 2).test('dd').ok, false);
        });

    });

    describe('Array Validations', function(){

        it('Should validate arrays have the exactly same items and order', function(){
            assert.strictEqual(v.eq(['a', 'b', 'c']).test(['a', 'b', 'c']).ok, true);
            assert.strictEqual(v.eq(['a', 'b', 'c']).test(['a', 'b']).ok, false);
            assert.strictEqual(v.dif(['a', 'b', 'c']).test(['a', 'b', 'f']).ok, true);
            assert.strictEqual(v.dif(['a', 'b', 'c']).test(['a', 'b', 'c']).ok, false);
        });

        it('Should validate array contain item', function(){
            assert.strictEqual(v.has('a').test(['a']).ok, true);
            assert.strictEqual(v.has('b').test(['a']).ok, false);
            assert.strictEqual(v.hasnt('c').test(['a', 'b']).ok, true);
            assert.strictEqual(v.hasnt('d').test(['a', 'd']).ok, false);
        });

        it('Should fail when matcher is not a Valinor', function(){
            assert.throws(() => v.every(true));
        });

        it('Should success if all elements of array match a given valinor', function(){
            assert.strictEqual(v.every(v.str).test(['a', 1]).ok, false);
            assert.strictEqual(v.every(v.num).test([2.4, 1, 0]).ok, true);

            let schema = v.obj.schema({
                a: v.bool,
                b: v.int
            });

            let data = [ { a: true, b: 8 }, { a: false } ];
            assert.strictEqual(v.every(schema).test(data).ok, false);
            data[1].b = 2;
            assert.strictEqual(v.every(schema).test(data).ok, true);
        });

        it('Should success if any elements of array match a given valinor', function(){
            assert.strictEqual(v.some(v.str).test([true, 1]).ok, false);
            assert.strictEqual(v.some(v.num).test([2.4, true, 'str']).ok, true);
        });

    });

    describe('Object Validations', function(){

        it('Should validate object has key', function(){
            assert.strictEqual(v.has('a').test({a: true}).ok, true);
            assert.strictEqual(v.has('b').test({a: true}).ok, false);
            assert.strictEqual(v.hasnt('c').test({a: true}).ok, true);
            assert.strictEqual(v.hasnt('d').test({d: true}).ok, false);
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
            assert.strictEqual(schema.test(subject).ok, true);
            subject.c = 'hey';
            assert.strictEqual(schema.test(subject).ok, false);
        });

        it('Should recursively validate Nested Schema Valinors', function(){
            let subject = { m: { a: true, b: 9 }, c: '' };
            let schema = v.obj.schema({
                m: v.schema({
                    a: v.bool,
                    b: v.int.max(9)
                }),
                c: v.opt.num
            });

            assert.strictEqual(schema.test(subject).ok, true);

            subject.m = undefined;
            assert.strictEqual(schema.test(subject).ok, false);
        });

        it('Should ignore fields not present in schema', function(){
            let subject = { m: { a: true, b: null }, c: 14 };
            let schema = v.obj.schema({
                m: v.schema({
                    a: v.bool,
                    b: v.opt.def(3).int.max(9)
                })
            });
            let r = schema.test(subject);
            assert.strictEqual(typeof r.final.c, 'undefined');
        });

        it('Should replace final with details', function(){
            let subject = { m: { a: true, b: null }, c: '' };
            let schema = v.obj.schema({
                m: v.schema({
                    a: v.bool,
                    b: v.opt.def(3).int.max(9)
                }),
                c: v.opt.num.def(15.6)
            });
            let r = schema.test(subject);

            assert.strictEqual(r.final.m.b, 3);
            assert.strictEqual(r.final.c, 15.6);
        });

        it('Should mutate input date in a pipeline style', function(){
            let obj = { foo: 'bar' };

            assert.throws(() => v.alter());

            let r = v.schema({
                foo: v.str.alter(() => 24).num
            }).test(obj);

            assert.strictEqual(r.final.foo, 24);
            assert.strictEqual(obj.foo, 'bar');
        });

    });

});
