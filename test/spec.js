
const v = require('../lib/main.js');


console.log( JSON.stringify(

    v.opt.schema({
        name: v.notStr.fn('cool', s => s >= 10)
    }).assert({ name: 11 })

) );
