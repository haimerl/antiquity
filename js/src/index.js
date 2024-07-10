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

    anti.flattenArray = function(arr) {
        if (!Array.isArray(arr)) {
            throw new TypeError('Input must be an array');
        }
        return arr.reduce(function(flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? anti.flattenArray(toFlatten) : toFlatten);
        }, []);
    };

    anti.difference = function(array, values) {
        if (!Array.isArray(array) || !Array.isArray(values)) {
            throw new TypeError('Both arguments should be arrays');
        }
        return array.filter(function(el) {
            return !values.includes(el);
        });
    };

    anti.shuffleArray = function(array) {
        if (!Array.isArray(array)) {
            throw new TypeError('Input must be an array');
        }
        if (array.length <= 1) {
            return array;
        }
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    anti.groupBy = function(array, key) {
        if (!Array.isArray(array)) {
            throw new TypeError('Input must be an array');
        }
        if (typeof key !== 'string') {
            throw new TypeError('Key must be a string');
        }
        return array.reduce(function(result, currentValue) {
            const groupKey = currentValue[key];
            if (groupKey === undefined || groupKey === null) {
                return result;
            }
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(currentValue);
            return result;
        }, {});
    };

    anti.chunkArray = function(array, size) {
        if (!Array.isArray(array)) {
            throw new TypeError('Input must be an array');
        }
        if (typeof size !== 'number' || size <= 0) {
            throw new TypeError('Size must be a positive integer');
        }        
        var results = [];
        var copy = array.slice();
        while (copy.length) {
            results.push(copy.splice(0, size));
        }    
        return results;
    };

    anti.range = function(start, end, step) {
        if (typeof start !== 'number' || (end !== undefined && typeof end !== 'number') || (step !== undefined && typeof step !== 'number')) {
            throw new TypeError('All arguments must be numbers');
        }
        var rangeArray = [];
        if (typeof end === 'undefined') {
            end = start;
            start = 0;
        }
        step = step || 1;        
        if (step === 0) {
            throw new RangeError('Step cannot be zero');
        }    
        if (step > 0) {
            for (var i = start; i < end; i += step) {
                rangeArray.push(i);
            }
        } else {
            for (var i = start; i > end; i += step) {
                rangeArray.push(i);
            }
        }    
        return rangeArray;
    };


    anti.isEqual = function(obj1, obj2) {
        if (obj1 === obj2) return true;    
        if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
            return false;
        }    
        if (Object.prototype.toString.call(obj1) !== Object.prototype.toString.call(obj2)) {
            return false;
        } 
        var keys1 = Object.keys(obj1);
        var keys2 = Object.keys(obj2);    
        if (keys1.length !== keys2.length) return false;    
        for (var key of keys1) {
            if (!keys2.includes(key)) {
                return false;
            }    
            if (typeof obj1[key] === 'object' && obj1[key] !== null && typeof obj2[key] === 'object' && obj2[key] !== null) {
                if (!antiquity.isEqual(obj1[key], obj2[key])) {
                    return false;
                }
            } else if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
        return true;
    };

    anti.uniq = function(array) {
        if (!Array.isArray(array)) {
            throw new TypeError('Input must be an array');
        }
        return Array.from(new Set(array));
    };

    global.anti = anti;
})(this);