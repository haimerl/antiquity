(function(global) {
    'use strict';
    var anti = {};


    anti.cloneDeep = function(obj, seen = new Map()) {
        if (obj === null || typeof obj !== 'object') return obj;        
        if (seen.has(obj)) return seen.get(obj);
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof RegExp) return new RegExp(obj);
        if (obj instanceof Array) {
            const clonedArr = [];
            seen.set(obj, clonedArr);
            for (let i = 0; i < obj.length; i++) {
                clonedArr[i] = anti.cloneDeep(obj[i], seen);
            }
            return clonedArr;
        }
        if (obj instanceof Map) {
            const clonedMap = new Map();
            seen.set(obj, clonedMap);
            obj.forEach((value, key) => {
                clonedMap.set(key, anti.cloneDeep(value, seen));
            });
            return clonedMap;
        }
        if (obj instanceof Set) {
            const clonedSet = new Set();
            seen.set(obj, clonedSet);
            obj.forEach(value => {
                clonedSet.add(anti.cloneDeep(value, seen));
            });
            return clonedSet;
        }
        const clonedObj = {};
        seen.set(obj, clonedObj);
        for (const key in obj) {
            // ensure that only the object's own properties are processed, and not properties that are inherited through the prototype chain.
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = anti.cloneDeep(obj[key], seen);
            }
        }
        return clonedObj;
    };
    
    anti.merge = function(target, source) {
        if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
            return target;
        }
        for (var key in source) {           
            if (source.hasOwnProperty(key)) {
                if (Array.isArray(source[key])) {
                    if (!Array.isArray(target[key])) {
                        target[key] = [];
                    }
                    target[key] = anti.merge(target[key], source[key]);
                } else if (typeof source[key] === 'object' && source[key] !== null) {
                    target[key] = anti.merge(target[key] || {}, source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };   


    global.anti = anti;
})(this);