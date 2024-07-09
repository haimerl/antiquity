(function(global) {
    'use strict';
    var anti = {};


    anti.cloneDeep = function(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) {
            var clonedArr = [];
            for (var i = 0; i < obj.length; i++) {
                clonedArr[i] = anti.cloneDeep(obj[i]);
            }
            return clonedArr;
        }
        var clonedObj = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = anti.cloneDeep(obj[key]);
            }
        }
        return clonedObj;
    };



    global.anti = anti;
})(this);