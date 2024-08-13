'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function serializeCall (handles) {
    var index = -1;
    function next() {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        index++;
        if (handles[index]) {
            var result = (_a = handles[index]).call.apply(_a, __spread([window], args));
            if (!result) {
                return next.apply(void 0, __spread(args));
            }
            if (result && result.then) {
                return result.then(function (res) {
                    if (!res) {
                        return next.apply(void 0, __spread(args));
                    }
                    return true;
                });
            }
        }
        return false;
    }
    return next;
}

var listeners = {};
var addEventListenerOriginal = window.addEventListener;
var removeEventListenerOriginal = window.removeEventListener;
window.addEventListener = function extendAddEventListener() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    var eventName = params[0];
    var handle = params[1];
    if (!handle) {
        return;
    }
    var listener = listeners[eventName];
    if (listener) {
        listener.handles.push(handle);
    }
    else {
        addEventListenerOriginal.apply(window, params);
    }
};
window.removeEventListener = function extendRemoveEventListener() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    var eventName = params[0];
    var handle = params[1];
    if (!handle) {
        return;
    }
    var listener = listeners[eventName];
    if (listener) {
        listener.handles.some(function (fn, index) {
            if (fn === handle) {
                listener.handles.splice(index, 1);
                return true;
            }
        });
    }
    else {
        removeEventListenerOriginal.apply(window, params);
    }
};
function extendListeners() {
    var extendEventNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        extendEventNames[_i] = arguments[_i];
    }
    extendEventNames.forEach(function (eventName) {
        addEventListenerOriginal.call(window, eventName, extendHandle);
        listeners[eventName] = {
            rootHandle: extendHandle,
            handles: [],
        };
        function extendHandle(event) {
            var listener = listeners[eventName];
            var next = serializeCall(listener.handles);
            next(event);
        }
    });
}
function removeExtendListeners() {
    var extendEventNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        extendEventNames[_i] = arguments[_i];
    }
    extendEventNames.forEach(function (eventName) {
        var listener = listeners[eventName];
        if (listener) {
            removeEventListenerOriginal.call(window, eventName, listener.rootHandle);
            delete listeners[eventName];
        }
    });
}

exports.extendListeners = extendListeners;
exports.removeExtendListeners = removeExtendListeners;
//# sourceMappingURL=bundle.cjs.js.map
