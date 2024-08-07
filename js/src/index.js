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
    
    anti.deepDiff = function(obj1, obj2) {
        if (obj1 === obj2) return {};    
        if (obj1 === null || typeof obj1 !== 'object' || obj2 === null || typeof obj2 !== 'object') {
            return obj2;
        }
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) {
                return obj2;
            }
            const diffArray = obj1.map((item, index) => antiquity.deepDiff(item, obj2[index]));
            if (diffArray.some(diffItem => Object.keys(diffItem).length > 0)) {
                return diffArray;
            }
            return {};
        }
        const diff = {};
        Object.keys(obj1).forEach(key => {
            if (!obj2.hasOwnProperty(key)) {
                diff[key] = undefined;
            } else {
                const deepDiffResult = antiquity.deepDiff(obj1[key], obj2[key]);
                if (Object.keys(deepDiffResult).length) diff[key] = deepDiffResult;
            }
        });
        Object.keys(obj2).forEach(key => {
            if (!obj1.hasOwnProperty(key)) {
                diff[key] = obj2[key];
            }
        });
        return diff;
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
                if (!anti.isEqual(obj1[key], obj2[key])) {
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

    anti.uniqueValues = function(array) {
        if (!Array.isArray(array)) {
            throw new TypeError('Expected an array');
        }
        return array.reduce((acc, item) => {
            if (!acc.includes(item)) {
                acc.push(item);
            }
            return acc;
        }, []);
    };

    anti.retry = function(fn, retries) {
        if (typeof fn !== 'function') {
            throw new TypeError('First argument must be a function');
        }
        if (typeof retries !== 'number' || retries < 0 || !Number.isInteger(retries)) {
            throw new TypeError('Second argument must be a non-negative integer');
        }
        return function() {
            var context = this, args = arguments;
            var attempt = function() {
                try {
                    // Ensure the function call is wrapped in a Promise.resolve to handle both sync and async functions
                    return Promise.resolve(fn.apply(context, args)).catch(function(error) {
                        if (retries > 0) {
                            retries--;
                            return attempt();
                        } else {
                            throw error;
                        }
                    });
                } catch (error) {
                    if (retries > 0) {
                        retries--;
                        return attempt();
                    } else {
                        return Promise.reject(error);
                    }
                }
            };
            return attempt();
        };
    };

    anti.escapeHTML = function(str) {
        if (typeof str !== 'string') {
            throw new TypeError('Input must be a string');
        }
        return str.replace(/[&<>"']/g, function(match) {
            const escapeMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'  // Changed to &#39; for consistency
            };
            return escapeMap[match];
        });
    };

    anti.unescapeHTML = function(str) {
        if (typeof str !== 'string') {
            throw new TypeError('Input must be a string');
        }
        return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, function(match) {
            const unescapeMap = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#39;': "'"
            };
            return unescapeMap[match];
        });
    };

    anti.pipe = function(...fns) {
        if (!fns.every(fn => typeof fn === 'function')) {
            throw new TypeError('All arguments must be functions');
        }    
        return function(arg) {
            if (fns.length === 0) {
                return arg;
            }        
            return fns.reduce((result, fn) => fn(result), arg);
        };
    };

    anti.debounce = function(func, wait, immediate) {
        if (typeof func !== 'function') {
            throw new TypeError('Expected a function');
        }
        if (typeof wait !== 'number' || wait < 0) {
            throw new TypeError('Expected wait to be a non-negative number');
        }
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                timeout = null; // Clear the timeout to prevent later execution
                return func.apply(context, args);
            }
        };
    };

    anti.debouncePromise = function(fn, wait) {
        if (typeof fn !== 'function') {
            throw new TypeError('Expected a function');
        }
        if (typeof wait !== 'number' || wait < 0) {
            throw new TypeError('Expected wait to be a non-negative number');
        }
        var timeout;
        return function() {
            var context = this, args = arguments;
            return new Promise(function(resolve, reject) {
                var later = function() {
                    timeout = null;
                    Promise.resolve(fn.apply(context, args)).then(resolve).catch(reject);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            });
        };
    };

    anti.debounceCallback = function(callback, delay, immediate) {
        if (typeof callback !== 'function') {
            throw new TypeError('Expected a function');
        }
        if (typeof delay !== 'number' || delay < 0) {
            throw new TypeError('Expected delay to be a non-negative number');
        }
        var timeout;
        return function() {
            var context = this, args = arguments;
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) {
                    callback.apply(context, args);
                }
            }, delay);
            if (callNow) {
                callback.apply(context, args);
            }
        };
    };   

    anti.compact = function(array) {
        if (!Array.isArray(array)) {
            throw new TypeError('Input must be an array');
        }
        return array.filter(Boolean);
    };

    anti.parseQueryString = function(input) {
        if (typeof input !== 'string') {
            throw new TypeError('Expected a string');
        }    
        // Extract the query string part from the input
        var queryString = input.indexOf('?') !== -1 ? input.split('?')[1] : input;
        return queryString.split('&').reduce(function(acc, pair) {
            if (pair) {
                var [key, value] = pair.split('=');
                key = decodeURIComponent(key.replace(/\+/g, ' '));
                value = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
    
                if (acc.hasOwnProperty(key)) {
                    if (Array.isArray(acc[key])) {
                        acc[key].push(value);
                    } else {
                        acc[key] = [acc[key], value];
                    }
                } else {
                    acc[key] = value;
                }
            }
            return acc;
        }, {});
    };

    anti.sortByKey = function(array, key) {
        if (!Array.isArray(array)) {
            throw new TypeError('Expected an array');
        }
        if (typeof key !== 'string') {
            throw new TypeError('Expected key to be a string');
        }
        return array.slice().sort((a, b) => {
            var x = a[key];
            var y = b[key];  
            if (x === undefined || x === null) return 1;
            if (y === undefined || y === null) return -1;
            if (typeof x === 'string' && typeof y === 'string') {
                return x.localeCompare(y); // Case-insensitive sorting for strings
            }
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };
    
    anti.randomString = function(length) {
        if (typeof length !== 'number' || length <= 0 || !Number.isInteger(length)) {
            throw new TypeError('Expected a positive integer for length');
        }
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    global.anti = anti;
})(this);