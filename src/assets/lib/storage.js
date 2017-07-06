// Fake localStorage implementation. 
// Mimics localStorage, including events. 
// It will work just like localStorage, except for the persistant storage part. 

//var LocalStorage =  {
var docCookies = {
    getItem: function (sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};


function localStorageGet(pKey) {
    // alert("localStorageGet key:"+pKey);
    try {
        if (localStorageSupported()) {
            try {
                return window.localStorage.getItem(pKey);
            }
            catch (e) {
                return docCookies.getItem('localstorage.' + pKey);
            }
        } else {
            return docCookies.getItem('localstorage.' + pKey);
        }
    }
    catch (e) {
        //alert("localStorageGet exception:"+e.message);
    }
}


function localStorageSet(pKey, pValue) {
    //alert("localStorageSet key:"+pKey+" pValue:"+pValue);
    try {
        if (localStorageSupported()) {
            try {
                window.localStorage.setItem(pKey, pValue);
            }
            catch (e) {
                docCookies.setItem('localstorage.' + pKey, pValue);
            }
        } else {
            docCookies.setItem('localstorage.' + pKey, pValue);
        }
    }
    catch (e) {

        //  alert("localStorageSet exception:"+e.message);
    }
}

function localStorageSupported() {
    // global to cache value
    //var gStorageSupported = undefined;
    var testKey = 'test', storage = window.localStorage;
    if (gStorageSupported === undefined) {
        try {
            storage.setItem("testKey", "1");

            gStorageSupported = true;
        } catch (error) {
            //alert("localstorage exception is:"+error.message);
            gStorageSupported = false;
        }
    }
    // alert("Localstorage support is:"+gStorageSupported);
    return gStorageSupported;
}

function sessionStorageSet(pKey, pValue) {
    //alert("localStorageSet key:"+pKey+" pValue:"+pValue);
    try {

        if (sessionStorageSupported()) {
            try {
                window.sessionStorage.setItem(pKey, pValue);
            }
            catch (e) {
                docCookies.setItem('sessionstorage.' + pKey, pValue);
            }
        } else {
            docCookies.setItem('sessionstorage.' + pKey, pValue);
        }
    }
    catch (e) {

        //alert("sessionStorageSet exception:"+e.message);
    }
}

function sessionStorageGet(pKey) {
    // alert("localStorageGet key:"+pKey);
    try {
        if (sessionStorageSupported()) {
            try {
                return window.sessionStorage.getItem(pKey);
            }
            catch (e) {
                return docCookies.getItem('sessionstorage.' + pKey);
            }
        } else {
            return docCookies.getItem('sessionstorage.' + pKey);
        }
    }
    catch (e) {
        //alert("sessionStorageGet exception:"+e.message);
    }
}

var gStorageSupported = undefined;
function sessionStorageSupported() {
    // global to cache value

    var testKey = 'test', storage = window.sessionStorage;
    if (gStorageSupported === undefined) {
        try {
            storage.setItem("testKey", "1");


            gStorageSupported = true;
        } catch (error) {
            //alert("localstorage exception is:"+error.message);
            gStorageSupported = false;
        }
    }
    // alert("Localstorage support is:"+gStorageSupported);
    return gStorageSupported;
}

function sessionStorageRemove(pKey) {
    try {
        if (sessionStorageSupported()) {
            try {
                return window.sessionStorage.removeItem(pKey);
            }
            catch (e) {
                return docCookies.removeItem('sessionstorage.' + pKey);
            }

        } else {
            return docCookies.removeItem('sessionstorage.' + pKey);
        }
    }
    catch (e) {
        //alert("sessionStorageGet exception:"+e.message);
    }
}

function localStorageRemove(pKey) {
    try {
        if (localStorageSupported()) {
            try {
                window.localStorage.removeItem(pKey);
            }
            catch (e) {
                docCookies.removeItem('localstorage.' + pKey);
            }
        } else {
            docCookies.removeItem('localstorage.' + pKey);
        }
    }
    catch (e) {     //  alert("localStorageSet exception:"+e.message);

    }
}
function eraseCookieFromAllPaths(name) {
    // This function will attempt to remove a cookie from all paths.
    var pathBits = location.pathname.split('/');
    var pathCurrent = ' path=';

    // do a simple pathless delete first.
    document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

    for (var i = 0; i < pathBits.length; i++) {
        pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathBits[i];
        document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
    }
}