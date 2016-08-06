/**
 * An object of helper functions
 *
 * @type {{}}
 */
let util = {
    humanSpeed: humanSpeed,
    extend: extend,
    arrayEach: arrayEach,
    has: has,
    isElement: isElement,
    isUndefined: isUndefined,
    isBoolean, isBoolean,
    isNumber: isNumber,
    isString: isString,
    isObject: isObject,
    isFunction: isFunction,
    isArray: isArray
};

/** Object#toString result shortcuts **/
const objectTag = '[object Object]';
const arrayTag = '[object Array]';
const stringTag = '[object String]';
const functionTag = '[object Function]';
const numberTag = '[object Number]';
const booleanTag = '[object Boolean]';

/** Used for native method references */
const objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
const objectToStr = objectProto.toString;

/** Native method shortcuts */
const hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Human speed typing.
 *
 * @param speed
 * @returns {*}
 * @private
 */
function humanSpeed(speed) {
    return Math.round(Math.random() * (100 - 30)) + speed;
}

/**
 * Merge two objects.
 *
 * Only set the value if 'source' already has it (no custom
 * props to prevent private props from being overridden).
 *
 * @param source
 * @param options
 * @returns {*}
 * @private
 */
function extend(source, options) {
    let key;

    for (key in options) {
        if (has(source, key) && has(options, key)) {
            source[key] = options[key];
        }
    }

    return source;
}

/**
 * Loop through array and use callback on each item
 *
 * @param arr
 * @param iterator
 */
function arrayEach(arr, iterator) {
    let index = -1,
        length = arr.length;

    while (++index < length) {
        iterator(arr[index], index, arr);
    }
}

/**
 * Check if object has key as own property.
 *
 * @param obj
 * @param key
 * @returns {boolean}
 */
function has(obj, key) {
    return obj ? hasOwnProperty.call(obj, key) : false;
}

/**
 * Check if argument is a DOM element.
 *
 * @param val
 * @returns {*|boolean}
 */
function isElement(val) {
    return val && val.nodeType === 1;
}

/**
 * Check if argument is undefined.
 *
 * @param val
 * @returns {boolean}
 */
function isUndefined(val) {
    return typeof val === 'undefined';
}

/**
 * Check if argument is a boolean.
 *
 * @param val
 * @returns {boolean|*}
 */
function isBoolean(val) {
    return val === true || val === false || val && typeof val === 'object' && objectToStr.call(val) === booleanTag;
}

/**
 * Check if argument is a number.
 *
 * @param num
 * @returns {*|boolean}
 */
function isNumber(num) {
    return num && typeof num === 'number' && objectToStr.call(num) === numberTag;
}

/**
 * Check if argument is a string.
 *
 * @param str
 * @returns {*|boolean}
 */
function isString(str) {
    return str && typeof str === 'string' && objectToStr.call(str) === stringTag;
}

/**
 * Check if argument is an object.
 *
 * In JavaScript, an array is an object, but we only want to check for objects
 * defined with {}, not [], so we explicitly check for that using objToStr.
 *
 * @param obj
 * @returns {boolean}
 */
function isObject(obj) {
    return obj && obj === Object(obj) && objectToStr.call(obj) === objectTag;
}

/**
 * Check if argument is a function.
 *
 * @param fn
 */
function isFunction(fn) {
    return fn && typeof fn === 'function' && objectToStr.call(fn) === functionTag;
}

/**
 * Check if argument is an array.
 *
 * @param arr
 * @returns {*|boolean}
 */
function isArray(arr) {
    if (isUndefined(Array.isArray)) {
        return arr && objectToStr.call(arr) === arrayTag;
    }

    return Array.isArray(arr);
}

export default util;