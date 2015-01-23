/* concatenation of: swfobject.js, utils_boot.js, flashproxy.js, html5sound.js, image_utils.js, sound.js, cookie.js, cookie_comm.js, stats.js, playlist.js, color.js, share.js, utils.js, templ.js, htmlembeddedplayer.js, share_external.js, social_controls.js, jquery.ui.draggable.min.js, jquery.ui.dialog.min.js, iscroll-min.js */
var _jsb=(_jsb||[]);_jsb.push({n:"embedded_player_bundle"});
/* ------------- BEGIN swfobject.js --------------- */;
/**
 * SWFObject v2.0: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2006 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
if(typeof deconcept == "undefined") var deconcept = new Object();
if(typeof deconcept.util == "undefined") deconcept.util = new Object();
if(typeof deconcept.SWFObjectUtil == "undefined") deconcept.SWFObjectUtil = new Object();
deconcept.SWFObject = function(swf, id, w, h, ver, c, quality, xiRedirectUrl, redirectUrl, detectKey) {
	if (!document.getElementById) { return; }
	this.DETECT_KEY = detectKey ? detectKey : 'detectflash';
	this.skipDetect = deconcept.util.getRequestParameter(this.DETECT_KEY);
	this.params = new Object();
	this.variables = new Object();
	this.attributes = new Array();
	if(swf) { this.setAttribute('swf', swf); }
	if(id) { this.setAttribute('id', id); }
	if(w) { this.setAttribute('width', w); }
	if(h) { this.setAttribute('height', h); }
	if(ver) { this.setAttribute('version', new deconcept.PlayerVersion(ver.toString().split("."))); }
	this.installedVer = deconcept.SWFObjectUtil.getPlayerVersion();
	if (!window.opera && document.all && this.installedVer.major > 7) {
		// only add the onunload cleanup if the Flash Player version supports External Interface and we are in IE
		deconcept.SWFObject.doPrepUnload = true;
	}
	if(c) { this.addParam('bgcolor', c); }
	var q = quality ? quality : 'high';
	this.addParam('quality', q);
	this.setAttribute('useExpressInstall', false);
	this.setAttribute('doExpressInstall', false);
	var xir = (xiRedirectUrl) ? xiRedirectUrl : window.location;
	this.setAttribute('xiRedirectUrl', xir);
	this.setAttribute('redirectUrl', '');
	if(redirectUrl) { this.setAttribute('redirectUrl', redirectUrl); }
}
deconcept.SWFObject.prototype = {
	useExpressInstall: function(path) {
		this.xiSWFPath = !path ? "expressinstall.swf" : path;
		this.setAttribute('useExpressInstall', true);
	},
	setAttribute: function(name, value){
		this.attributes[name] = value;
	},
	getAttribute: function(name){
		return this.attributes[name];
	},
	addParam: function(name, value){
		this.params[name] = value;
	},
	getParams: function(){
		return this.params;
	},
	addVariable: function(name, value){
		this.variables[name] = value;
	},
	getVariable: function(name){
		return this.variables[name];
	},
	getVariables: function(){
		return this.variables;
	},
	getVariablePairs: function(){
		var variablePairs = new Array();
		var key;
		var variables = this.getVariables();
		for(key in variables){
			variablePairs.push(key +"="+ variables[key]);
		}
		return variablePairs;
	},
	getSWFHTML: function() {
		var swfNode = "";
		if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) { // netscape plugin architecture
			if (this.getAttribute("doExpressInstall")) {
				this.addVariable("MMplayerType", "PlugIn");
				this.setAttribute('swf', this.xiSWFPath);
			}
			swfNode = '<embed type="application/x-shockwave-flash" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
			swfNode += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
			var params = this.getParams();
			 for(var key in params){ swfNode += [key] +'="'+ params[key] +'" '; }
			var pairs = this.getVariablePairs().join("&");
			 if (pairs.length > 0){ swfNode += 'flashvars="'+ pairs +'"'; }
			swfNode += '/>';
		} else { // PC IE
			if (this.getAttribute("doExpressInstall")) {
				this.addVariable("MMplayerType", "ActiveX");
				this.setAttribute('swf', this.xiSWFPath);
			}
			swfNode = '<object id="'+ this.getAttribute('id') +'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';
			swfNode += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
			var params = this.getParams();
			for(var key in params) {
			 swfNode += '<param name="'+ key +'" value="'+ params[key] +'" />';
			}
			var pairs = this.getVariablePairs().join("&");
			if(pairs.length > 0) {swfNode += '<param name="flashvars" value="'+ pairs +'" />';}
			swfNode += "</object>";
		}
		return swfNode;
	},
	write: function(elementId){

		/* HACK alert, added by Neal to detect FlashBlock:
		   When we write the HTML into the document, first
		   try to find a src="<url>" attribute buried in it
		   (wimping out here and using a simple regex rather
		   than parsing the HTML because I know it can't
		   vary much, since it's generated by this code too).
		   After writing the innerHTML, read it back and
		   look for the same attribute, and compare them.  If
		   they are different, we have been Co^H^HFlashBLocked.

		   This will have no effect on IE because the src
		   attribute is not used.
		*/
		function hack_getSWFSrc(html) {
			var regex = / src=\"([^"]*)\"/i;
			var result = regex.exec(html);
			if(result) return result[1];
			return null;
		}

		if(this.getAttribute('useExpressInstall')) {
			// check to see if we need to do an express install
			var expressInstallReqVer = new deconcept.PlayerVersion([6,0,65]);
			if (this.installedVer.versionIsValid(expressInstallReqVer) && !this.installedVer.versionIsValid(this.getAttribute('version'))) {
				this.setAttribute('doExpressInstall', true);
				this.addVariable("MMredirectURL", escape(this.getAttribute('xiRedirectUrl')));
				document.title = document.title.slice(0, 47) + " - Flash Player Installation";
				this.addVariable("MMdoctitle", document.title);
			}
		}
		if(this.skipDetect || this.getAttribute('doExpressInstall') || this.installedVer.versionIsValid(this.getAttribute('version'))){
			var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;

			var html = this.getSWFHTML();
			var url = hack_getSWFSrc(html);

			n.innerHTML = html;

			if(url && url != hack_getSWFSrc(n.innerHTML)) {
				// someone tampered with the SWF SRC attribute
				// just now.  FlashBlock!
				n.innerHTML = "";
				return false;
			}

			return true;
		}else{
			if(this.getAttribute('redirectUrl') != "") {
				document.location.replace(this.getAttribute('redirectUrl'));
			}
		}
		return false;
	}
}

/* ---- detection functions ---- */
deconcept.SWFObjectUtil.getPlayerVersion = function(){
	var PlayerVersion = new deconcept.PlayerVersion([0,0,0]);
	if(navigator.plugins && navigator.mimeTypes.length){
		var x = navigator.plugins["Shockwave Flash"];
		if(x && x.description) {
			PlayerVersion = new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."));
		}
	}else{
		// do minor version lookup in IE, but avoid fp6 crashing issues
		// see http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
		try{
			var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		}catch(e){
			try {
				var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
				PlayerVersion = new deconcept.PlayerVersion([6,0,21]);
				axo.AllowScriptAccess = "always"; // throws if player version < 6.0.47 (thanks to Michael Williams @ Adobe for this code)
			} catch(e) {
				if (PlayerVersion.major == 6) {
					return PlayerVersion;
				}
			}
			try {
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			} catch(e) {}
		}
		if (axo != null) {
			PlayerVersion = new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));
		}
	}
	return PlayerVersion;
}
deconcept.PlayerVersion = function(arrVersion){
	this.major = arrVersion[0] != null ? parseInt(arrVersion[0]) : 0;
	this.minor = arrVersion[1] != null ? parseInt(arrVersion[1]) : 0;
	this.rev = arrVersion[2] != null ? parseInt(arrVersion[2]) : 0;
}
deconcept.PlayerVersion.prototype.versionIsValid = function(fv){
	if(this.major < fv.major) return false;
	if(this.major > fv.major) return true;
	if(this.minor < fv.minor) return false;
	if(this.minor > fv.minor) return true;
	if(this.rev < fv.rev) return false;
	return true;
}
/* ---- get value of query string param ---- */
deconcept.util = {
	getRequestParameter: function(param) {
		var q = document.location.search || document.location.hash;
		if(q) {
			var pairs = q.substring(1).split("&");
			for (var i=0; i < pairs.length; i++) {
				if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
					return pairs[i].substring((pairs[i].indexOf("=")+1));
				}
			}
		}
		return "";
	}
}
/* fix for video streaming bug */
deconcept.SWFObjectUtil.cleanupSWFs = function() {
	var objects = document.getElementsByTagName("OBJECT");
	for (var i=0; i < objects.length; i++) {
		objects[i].style.display = 'none';
		for (var x in objects[i]) {
			if (typeof objects[i][x] == 'function') {
				objects[i][x] = function(){};
			}
		}
	}
}
// fixes bug in fp9 see http://blog.deconcept.com/2006/07/28/swfobject-143-released/
if (deconcept.SWFObject.doPrepUnload) {
	deconcept.SWFObjectUtil.prepUnload = function() {
		__flash_unloadHandler = function(){};
		__flash_savedUnloadHandler = function(){};
		window.attachEvent("onunload", deconcept.SWFObjectUtil.cleanupSWFs);
	}
	window.attachEvent("onbeforeunload", deconcept.SWFObjectUtil.prepUnload);
}
/* add Array.push if needed (ie5) */
if (Array.prototype.push == null) { Array.prototype.push = function(item) { this[this.length] = item; return this.length; }}

/* add some aliases for ease of use/backwards compatibility */
var getQueryParamValue = deconcept.util.getRequestParameter;
var FlashObject = deconcept.SWFObject; // for legacy support
var SWFObject = deconcept.SWFObject;
;
/* ------------- BEGIN utils_boot.js --------------- */;
// Copyright 2008 Bandcamp, Inc. All rights reserved.

/////////////////////////////////////////////////////////////
/// Utility APIs: bootstrap (early load)
///

var Y = null;
try { Y = YAHOO; } catch(e){};

// U is some very basic utilities that have historically
// been provided by YUI.
var U = {
    _jquery : null,

    // U.jQuery() tests to see if jquery is present
    // safely and caches the result so we don't have to
    // potentially rescue that exception constantly
    jQuery : function() {
        if ( U._jquery === null ) {
            try {
                U._jquery = jQuery;
            } catch (err) {
                U._jquery = false;
            }
        }
        return U._jquery;
    },

    // From here down are shims for things we used to call in YUI
    // which work in both YUI or jQuery environments.  If both are
    // present, the jQuery path will be used.
    trim : function(str) {
        if ( U.jQuery() )
            return jQuery.trim(str);
        else
            return Y.lang.trim(str);
    },

    isObject : function( o ) {
        if ( U.jQuery() )
            return jQuery.isPlainObject(o);
        else
            return Y.lang.isObject(o);
    },

    augmentObject : function( r, s, args ) {
        // note: simplistic implementation here which
        // assumes flat simple hashes.
        if ( !args ) {
            for(var k in s) {
                r[k] = s[k];
            }
        } else {
            for(var i in args) {
                var key = args[i];
                r[key] = s[key];
            }
        }
    },

    isString : function( o ) {
        return typeof o === "string";
    },

    isNumber : function( o ) {
        return typeof o === "number" && isFinite(o);
    },

    isArray : function( o ) {
        if ( U.jQuery() )
            return jQuery.isArray(o);
        else
            return Y.lang.isArray(o);
    },

    elt : function( e ) {
        // provided here for compatibility.  if we're using jquery this is deprecated
        if ( U.jQuery() )
            if( U.isString(e) ) {
                e = e.replace(/\./g, "\\.");
                return $("#" + e.toString()).get(0);
            } else {
                return $(e).get(0);
            }
        else
            return Y.util.Dom.get( e );
    },

    merge : function( args ) {
        var argarray = [ {} ];
        for(var i=0; i<arguments.length; i++) { argarray.push(arguments[i]); }
        if ( U.jQuery() ) {
            return $.extend.apply( $, argarray );
        } else {
            return Y.lang.merge.apply( Y.lang, argarray );
        }
    },

    addClass : function( elem, classname ) {
        if ( U.jQuery() ) {
            $(elem).addClass( classname );
        } else {
            Y.util.Dom.addClass( elem, classname );
        }
    },

    removeClass : function( elem, classname ) {
        if ( U.jQuery() ) {
            $(elem).removeClass( classname );
        } else {
            Y.util.Dom.removeClass( elem, classname );
        }
    },

    stopEvent : function(e) {
        if ( U.jQuery() ) {
            var evt = $.Event(e);
            evt.stopPropagation();
            evt.preventDefault();
        } else {
            Y.util.Event.stopEvent(e);
        }
    }
};

function $assert( expr, msg ) {
    //sdg TODO: replace the alert with a logged message?
    //sdg TODO: strip out all assert calls in production build?
    //sdg TODO: replace with Y.util.Assert?
    if ( !expr ) {
        if ( msg == null )
            msg = "";
        var skipDebug = confirm( "Assertion failed. " + msg + "\n\nSelect Cancel to debug." ); //i18n ok
        if ( !skipDebug )
            eval( 'debugger' ); // avoid syntax errors in browsers which don't support this keyword
    }
}

var LogAll = function(level, msg /*, ... */) {

    var d = new Date();
    var ms = d.getMilliseconds().toString();
    while ( ms.length < 3 ) ms = "0" + ms;
    var timestamp = d.toTimeString().substring(0,8) + "." + ms + ":";
    
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(timestamp);
    
    // Send it to an alternate logger if available (generally dev only) as well as the system one
    // Yeah, it would be great to register listeners instead, some day...
    if (typeof LogView != "undefined") {
        LogView.add( args.join(' ') );
    }

    // args.join(' ') on iphone throws TypeError.  Not sure why.  Special case here for now.
    if (Browser.platform == "iphone") {
        var str = "";
        var sep = "";
        for(var x in args) {
            str += sep + args[x];
            sep = " ";
        }
        console.log(str);
        return;
    }

    if (typeof console == "undefined") return;
    var logFn = console[level] || console.log;

    // IE <=9's console.log is not a real JS object and lacks apply(), so join the args and call with single arg.
    if (typeof logFn === 'object') {
        logFn(args.join(' '));
    }
    else {
        logFn.apply(console, args)
    }
};

LogAll.proxy = function( level ) {
    return function(msg /*, ... */) {
        try {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(level);
            LogAll.apply( Log, args );
        }
        catch (e) {;} // just in case
    };
};

var Log = {
    debug : LogAll.proxy("log"),
    info : LogAll.proxy("info"),
    note : LogAll.proxy("info"),
    warn : LogAll.proxy("warn"),
    error : LogAll.proxy("error"),

    flash : function(msg) {
        // flash log messages come through escape()'d to Log.flash to avoid problems with
        // the fact that the strings are serialized and then eval()'d, so if they contain e.g.
        // quotation marks, they can cause problems
        Log.debug("Flash: " + unescape(msg));
    },

    server : function(msg, lvl, isException) {
        // Does not use other utils, to be as independent/available as possible
        // Also does not use XHR/POST, maybe it should. -- kj
        lvl = lvl || "info";

        Log.debug( "about to send server log entry: " + lvl + ": " + msg )

        var bcn = document.createElement('img');
        bcn.style.display = "none";
        // Closures prevent garbage-collection
        bcn.onload = function() { 
                var e;
                // ran into a problem where a script error in here would
                // break all future YUI dialogs (?!?).  Bullet-proofing:
                try {
                    Log.debug( "server log entry success: " + lvl + ": " + msg )
                    bcn.onload = bcn.onerror = null;
                    bcn = null; // break closure
                } catch ( e ) { }
            };
        bcn.onerror = function() { 
                var e;
                // ran into a problem where a script error in here would
                // break all future YUI dialogs (?!?).  Bullet-proofing:
                try {
                    Log.debug( "server log entry error: " + lvl + ": " + msg )
                    bcn.onload = bcn.onerror = null;
                    bcn = null; // break closure
                } catch ( e ) { }
            };

        bcn.src = "/client_log" +
                     "?exc=" + (isException ? "1" : "0") +
                     "&msg=" + encodeURIComponent(msg.substring(0,1000)) + 
                     "&lvl=" + encodeURIComponent(lvl) +
                     "&r=" + Math.random().toString().substring(2);

        bcn = null; // break closure
    }
};

// Logs uncaught client-side errors to the server, with batching. Doesn't rely on any utilities other than 
// Log.server and Url. See "Client-side Error Collection" wiki page for more details.
var ErrorCollector;
ErrorCollector = ( function(exports) {

    var defaults = {
            enabled: true,    // set to false to disable logging
            sampleRate: null, // a number between 0 and 1, representing the % of pages which should have errors logged
            maxBatchSize: 3,  // don't beacon more than this many errors at a time
            maxBatches: 3,    // don't beacon more than this many times
            saveDelay: 5000   // the minimum delay in ms between saves; errors will be buffered
        },
        errors = [],
        lastSave = 0,
        batchCount = 0,
        errorCount = 0,
        timer = null,
        domready = '';

    for (var prop in defaults) {
        if (defaults.hasOwnProperty(prop) && !exports.hasOwnProperty(prop))
            exports[prop] = defaults[prop];
    }

    if (exports.enabled && (exports.sampleRate != null) && (Math.random() > exports.sampleRate)) {
        Log.debug("ErrorCollector: disabled due to sample rate");
        exports.enabled = false;
    }
    else
        Log.debug("ErrorCollector: " + (exports.enabled ? "enabled" : "disabled"));

    if (window.$) {
        domready = 0;
        $(document).ready( function() { domready = 1; } );
    }

    exports.add = function( msg, scriptURL, line ) {
        if (isActive()) {
            var data = filter(msg, scriptURL, line);
            if (data) {
                errors.push(data);
                flush();
            }
            else
                Log.debug("ErrorCollector: skipping runtime error");
        }
    };

    function filter(msg, scriptURL, line) {
        if (!msg) 
            return null;

        // Some versions of android browser (and others) appear to give us an Event object here. So far I don't
        // see any evidence that the object contains any useful error information. Log them anyway.
        if (msg.toString() == "[object Event]") {
            msg = msg.message || msg.msg || msg.toString();
            scriptURL= scriptURL || msg.filename || msg.file || '';
            var normalize = function(val) { return val === 0 ? new Number(0) : val; };
            line = normalize(line) || normalize(msg.lineno) || normalize(msg.line) || '';
        }

        // Skip non-BC scripts (both those we include, and those included by browser plugins and other cruft)
        if (scriptURL) {
            var scriptHost = Url.toHash(scriptURL).host, pageHost = location.host;
            if (!scriptHost)  // some scripts in the wild use file: URLs
                return null;
            if ( !/(^|\.)(bandcamp\.com|bcbits\.com)$/.test(scriptHost) ) {  // !prod
                var idx = pageHost.length - scriptHost.length;
                if ( (idx < 0) || (pageHost.lastIndexOf(scriptHost) != idx) )  // !dev
                    return null;
            }
        }

        // This error appears to be common in FF when a SWF is loaded in an iframe. It seems harmless. We see it from 
        // both embedded players and the FB tab. See http://www-01.ibm.com/support/docview.wss?uid=swg21370430
        if ( Browser.type == "gecko" && line == 0 &&
                ( /Permission denied to access property 'toString'/.test(msg) || /Location\.toString/.test(msg) ) )
            return null;

        var pageURL = location.href;
        if (scriptURL == pageURL)
            pageURL = "---"; // save some space in the URL

        var scripts = [], jsb = window._jsb;
        if (jsb) {
            var len = Math.min(jsb.length, 20);
            for (var i=0; i < len; i++)
                scripts.push( jsb[i].n + ":" + (jsb[i].c || 0) );
            if (len < jsb.length)
                scripts.unshift("(omitted " + (jsb.length - len) + ")");
        }
        scripts = scripts.join(",");

        return [msg, scriptURL, line, pageURL, ++errorCount, domready, scripts];
    }

    function flush() {
        if (!timer) {
            // wait at least 250ms, in case another error immediately follows
            var delay = Math.max( lastSave + exports.saveDelay - new Date().getTime(), 250 );
            timer = setTimeout(save, delay);
        }
    }

    function save() {
        clearTimeout(timer);
        timer = null;
        if (!isActive() || !errors.length)
            return;
        var out = [],
            len = Math.min(errors.length, exports.maxBatchSize);
        // We tab-delimit the data. Avoiding JSON because the text can be truncated in Server.log, or by the browser.
        for (var i=0; i < len; i++)
            out.push( errors[i].join("\t") );
        Log.server( out.join("\n"), "debug", true );
        lastSave = new Date().getTime();
        errors.length = 0;
        batchCount++;
    }

    function isActive() {
        return exports.enabled && (batchCount < exports.maxBatches);
    }

    if (exports.enabled)
        window.onerror = exports.add;

    return exports;

} )( ErrorCollector || {} );

// --------------------------------------------------

// Subscribe to YAHOO Logger and echo their "error" msgs to our logger
if (Y && Y.widget && Y.widget.Logger) {
    Y.widget.Logger.newLogEvent.subscribe(function(type, args, obj) {
        var logMsg = args[0];
        if (logMsg.category == "error")
            Log.error("YUI " + logMsg.source + ": " + logMsg.msg);
    });
}

// Object.create polyfill
if ( !Object.create ) {
    Object.create = function(o) {
        if ( arguments.length > 1 ) {
            var msg = "Object.create polyfill only supports one parameter";
            Log.error( msg );
            throw new Error(msg);
        }
        var F = function(){};
        F.prototype = o;
        return new F();
    };
}

// Reproduces some ruby-like iteration routines. 
// Currently supports arrays only.
var Iter = {
    
	// To each element of array (a), apply function (f) 
	// If f(a[i]) returns a truthy value, return it (and cease further iteration)
	each : function (a, f) {
		var i = 0, v = null;
		for (i = 0; i < a.length; i++) {
			v = f(a[i]);
			if (v) return v; // stop iteration
		}
	},
	
    // Calls fn one time for each element in arr; returns a new
    // array with the fn return values.
    collect: function( arr, fn ) {
        if ( !fn )
            fn = function( item ) { return item; }; // default: array copy
        var len = arr.length;
        var out = new Array(len);
        for ( var i=0; i < len; i++ )
            out[i] = fn( arr[i] );
        return out;
    },
    
    // Returns the first arr element for which fn returns true, or null.
    find: function( arr, fn ) {
        var len = arr.length;
        for ( var i=0; i < len; i++ ) {
            if ( fn( arr[i] ) )
                return arr[i];
        }
        return null;
    },
    
    // Returns a new array containing all the entries of the array for which
    // fn returns true.
    findAll: function( arr, fn ) {
        var len = arr.length;
        var out = [];
        for ( var i=0; i < len; i++ ) {
            var entry = arr[i];
            if ( fn( entry ) )
                out.push( entry );
        }
        return out;
    },
    
    index: function ( arr, item ) {
        if (typeof arr.indexOf === 'function') return arr.indexOf(item);
        
        var len = arr.length;
        for ( var i = 0; i < len; i++ ) {
            if (arr[i] == item) return i;
        }
        return -1;
    },

    reduce: function (arr, fn, initialValue) {
        'use strict';

        // Use native implementation if available.
        if ('function' === typeof arr.reduce) {
            if (arguments.length < 3) return arr.reduce(fn);
            else return arr.reduce(fn, initialValue);
        }

        var prevValue = initialValue,
            i = 0,
            len = arr.length;

        if (arguments.length < 3) {
            while (i < len && !(i in arr)) i++;
            if (i >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            prevValue = arr[i++];
        }

        for (; i < len; i++) {
            if (i in arr) prevValue = fn(prevValue, arr[i], i, arr);
        }
        return prevValue;
    }
};

var Text = {
        
    notEmpty : function( str ) {
        return str != null && str.toString().length > 0;
    },
    
    // returns the first non-null, non-empty string argument, or ""
    collate: function( /* str1, str2, ... */) {
        for ( var i=0; i < arguments.length; i++ ) {
            var str = arguments[i];
            if ( Text.notEmpty( str ) )
                return str;
        }
        return "";
    },
        
    escapeHtml: function( str ) {
        str = str.toString();
        return str.replace( /&/g, "&amp;" )
                  .replace( /</g, "&lt;" )
                  .replace( />/g, "&gt;" )
                  .replace( /"/g, "&quot;" )
                  .replace( /'/g, "&#39;" );
    },
    
    unescapeHtml: function( str ) {
        var unescape_div = document.createElement('div');
        unescape_div.innerHTML = str;
        return unescape_div.firstChild.nodeValue;
    },
        
    // Given a string and a matching substring, wraps the substring
    // with pre and post. Useful for wrapping tags around search matches.
    markupMatch: function( str, match, pre, post, caseSensitive ) {
    
        // I'm going to avoid using a regex to do a replace, as the match could
        // be user data and would need to be escaped.
        var matchIndex = !caseSensitive ?
                            str.toLowerCase().indexOf( match.toLowerCase() ) :
                            str.indexOf( match );
        if ( matchIndex == -1 )
            return str; // match not found
        
        return [ str.substr( 0, matchIndex ),
                 pre,
                 str.substr( matchIndex, match.length ),
                 post,
                 str.substr( matchIndex + match.length ),
               ].join("");    
    },
    
    regexpEscape: function( str ) {
        return str.replace( /([\\\^\$\*\+\?\.\,\:\!\|\(\)\[\]\{\}])/g, "\\$1" );
    },
    
    // This should match the behavior of utf8_truncate on the server.
    truncate: function( str, len, ellipsis ) {
        if ( !str )
            return "";
        if ( len == null )
            len = 50;
        if ( ellipsis == null )
            ellipsis = "";
        if ( str.length <= len )
            return str;
        // conforming to 'len' is higher-priority than adding the ellipsis
        if ( ellipsis.length > len )
            return "";
        len = Math.max( 0, len - ellipsis.length );
        return str.substr( 0, len ) + ellipsis;
    }    
};

var Url = {
    
    // Matches a http or https URL, including relative, absolute, and fully-
    // qualified variations. This pattern is designed to output matching sub-
    // expressions close to what the browser provides in the window.location 
    // object. The differences between this regexp's output and the location 
    // object (that I know of) are:
    //
    //    - non-existent fields will return undefined, instead of ""
    //    - if you specify a URL without a path (like http://clubwiki.org), then 
    //      this regexp will return undef for the pathname, whereas the location 
    //      object would report "/".
    //
    // Note that this pattern will match any string, even "" (a random string
    // is considered a URL with a relative path).
    //
    // Many attempts have been made to write regexps to match URLs. All have failed,
    // until this one! Ha, ha ha ha ha ha ha! Ha. Burp.
    // 
    // $1: protocol: "http:" or undef
    // $2: hostname: "www.clubwiki.org" or undef
    // $3: port: "7000" or undef
    // $4: pathname: "/foo/bar" or "/" or undef
    // $5: search: "?blah=hey", or undef if there's no "?" followed by something
    // $6: hash: "#something", or undef if there's no "#" followed by something
    PATTERN_URL: /^(?:(https?\:)\/\/([^\:\/\?#]+)(?:\:(\d+))?)?(\/?[^\?#]*)?(?:\?|(\?[^#]*))?(?:#|(#.*))?$/,
    
    // Given a URL of any form (fully-qualified, absolute, relative), returns a
    // hash object similar to the browser's location object. The properties are the 
    // same, and missing fields are normalized to "" (except pathname, which is 
    // normalized to "/").
    toHash: function( url ) {
        
        // It might be nice to accept an optional baseUrl parameter that would 
        // fully-qualify the output for a relative URL.
    
        url = U.trim( url );
        var matches = Url.PATTERN_URL.exec( url ) || []; // "||": failsafe; shouldn't be needed
        return {
            href:     matches[0] || "",
            protocol: matches[1] || "",
            host:   ( matches[2] || "" ) + ( matches[3] ? ":" + matches[3] : "" ),
            hostname: matches[2] || "",
            port:     matches[3] || "",
            pathname: matches[4] || "/",
            search:   matches[5] || "",
            hash:     matches[6] || ""
        };
    },
    
    // The inverse of toHash: accepts a hash object and returns the full href.
    fromHash: function( urlHash ) {
        
        $assert( U.isObject( urlHash ) );
        var out = [];
        if ( urlHash.protocol )
            out.push( urlHash.protocol, "//" );
        if ( urlHash.hostname )
            out.push( urlHash.hostname );
        if ( urlHash.port )
            out.push( ":", urlHash.port );
        if ( urlHash.pathname )
            out.push( urlHash.pathname );
        if ( urlHash.search )
            out.push( urlHash.search );
        if ( urlHash.hash )
            out.push( urlHash.hash );
        return out.join("");
    },
    
    // Returns true if the given URL points to the same protocol, hostname and port
    // as the current page. The url can be a string or a hash returned by Url.toHash.
    isLocal: function( url ) {
        var urlHash = Url._hashify( url );
        if ( window.FacebookData ) {
            // for the facebook app, the conditions are relaxed, as the current doc's location will
            // only be bandcamp.com, while the clicked url might be subdomain.bandcamp.com.  In that
            // case, if the location host is the terminal part of the url host, I consider it local 
            // (so subdomain.bandcamp.com/album/... can get intercepted and directed to 
            // bandcamp.com/fb_tab/album/....)
            // There's a similar problem with the protocol. It can be the case that the location 
            // protocal on FB is https. A simple click should be "local", that is, intercepted by 
            // the client-side controller and kept on https://,  even though the url is written as 
            // http -- and in that way, a right click or ctrl click continues to take the user to
            // to http://subdomain.bandcamp.com 
            if ( urlHash.protocol == location.protocol && urlHash.host == location.host )
                return true;
                
            var re = new RegExp( location.host + "$");
            if ( urlHash.host.match( re ) ) {
                return true;
            }
            
            return false;
            
        } else {
            return ( urlHash.protocol == location.protocol && urlHash.host == location.host );   
        }   
    },
    
    // Returns true if the given URL appears to be fully-qualified.
    isFullyQualified: function( url ) {
        var urlHash = Url._hashify( url );
        return ( urlHash.protocol && urlHash.host );
    }, 
    
    // Returns true if the two URLs point to the same resource. Note that this
    // does not mean they are identical as strings (one could end with "/", another
    // with "?", and they'd still be equal).
    // skipHash: if true, the hash portion is ignored during the comparison
    equals: function( urlA, urlB, skipHash ) {
        var hashA = Url._hashify( urlA );
        var hashB = Url._hashify( urlB );
        return ( 
            hashA.protocol       == hashB.protocol &&
            hashA.hostname       == hashB.hostname &&
            ( hashA.port || 80 ) == ( hashB.port || 80 ) &&
            hashA.pathname       == hashB.pathname &&
            hashA.search         == hashB.search && // TODO: normalize search params?
            ( skipHash || ( hashA.hash == hashB.hash ) )
        );
    },
    
    // Given a non-qualified URL (missing at least the protocol, hostname and port), 
    // interpret it as a local URL and return a fully-qualified version. Also handles
    // resolving relative URLs. 
    // url: a string, or a hash returned by Url.toHash
    // baseUrl: optional: a fully-qualified URL string or hash used to resolve 
    //   the missing url parts; if not specified, this defaults to window.location.
    fullyQualify: function( url, baseUrl ) {
        var urlHash = Url._hashify( url );
        baseUrl = baseUrl || location;
        var baseUrlHash = Url._hashify( baseUrl );
        
        $assert( !urlHash.protocol && !urlHash.hostname && !urlHash.port, "expected a non-qualified URL" );
        $assert( baseUrlHash.protocol && baseUrlHash.hostname, "expected a fully-qualified base URL" );
        
        $(["protocol", "hostname", "port"]).each(function(i,prop) {
                urlHash[prop] = baseUrlHash[prop];
            });
        
        if ( !urlHash.pathname )
            urlHash.pathname = "/";
        else if ( urlHash.pathname.charAt(0) != "/" ) {
            // relative pathname
            var basePath = baseUrlHash.pathname || "/";
            $assert( basePath.charAt(0) == "/", "expected a fully-qualified base URL path" );
            if ( basePath.charAt( basePath.length - 1 ) == "/" )
                urlHash.pathname = basePath + urlHash.pathname;
            else
                urlHash.pathname = basePath.replace( /[^\/]+$/, urlHash.pathname );
        }
        
        return Url.fromHash( urlHash );
    },   
    
    // Given the escaped query (search) portion of a URL, returns a hash object  with unescaped key/value pairs. Note
    // that if a key appears in the URL without a value, then its value in the hash will be "". This means you might
    // want to use hash.hasOwnProperty() to test if a key is present, because hash[key] will evaulate to false in those cases.
    parseQuery: function(query) {
        var out = {};
        $.each( Url.parseQueryArray(query), function() {
            out[this.name] = this.value;
        });
        return out;
    },
    
    // The inverse of parseQuery: accepts a hash of unescaped name/value pairs and joins them into a URL-escaped 
    // string (without a leading '?').
    joinQuery: function(queryHash) {
        var out = [];
        for (var key in queryHash) {
            if (queryHash.hasOwnProperty(key))
                out.push( {name: key, value: queryHash[key]} );
        }
        return Url.joinQueryArray(out);
    },

    // like parseQuery, but instead of returning a hash of name-value pairs, returns an array in which each element is a
    // {name: "name", value: "value"} hash (the format used by $.param). Useful when the order of params is important,
    // or when there are duplicate param names.
    parseQueryArray: function(query) {
        // strip off leading '?' or leading/trailing '&' or whitespace
        query = query.replace( /^[\?&\s]*(.*?)[&\s]*$/, "$1" );
        var out = [];
        if (query) {
            var pairs = query.split( /&+/ );
            $.each(pairs, function() {
                if (this && this != "=") {
                    var pair = this.split( "=" ), paramName, paramValue;
                    try {
                        paramName = decodeURIComponent(pair[0]);
                        paramValue = (pair[1] ? decodeURIComponent(pair[1]) : "");
                    }
                    catch (e) {
                        // malformed URL parameters can cause decodeURIComponent to throw URIErrors
                        Log.error("parseQueryArray: error when decoding URL parameter, skipping; ", e);
                        return true;  // continue
                    }
                    out.push( {name: paramName, value: paramValue} );
                }
            });
        }
        return out;
    },

    // Given an array of unescaped name-value pairs, joins them into an escaped query string (without the leading "?").
    // The input is the format returned by parseQueryArray: an array of {name: "name", value: "value"} objects. 
    joinQueryArray: function(arr) {
        // We could use $.param here as a shortcut, but I didn't like its handling of null or "" values
        arr = arr || [];
        var out = [], param;
        for (var i=0; i < arr.length; i++) {
            param = arr[i];
            if (param && (param.name != null && param.name != "")) {
                if (out.length)
                    out.push("&");
                out.push( encodeURIComponent(param.name) );
                if (param.value != null && param.value != "") {
                    out.push("=", encodeURIComponent(param.value));
                }
            }
        }
        return out.join('');
    },
    
    // Convienince function to add a hash of name-value pairs to an exisiting URL, 
    // returning the result as a string. Existing query parameters can be 
    // overwritten.
    addQueryParams: function( url, hash ) {
        
        if ( !hash )
            return url;
        
        // We could use Url.toHash here, but that might be overkill.
        var queryIndex = url.indexOf( "?" ) + 1;
        var query = ( queryIndex > 0 ? url.substr( queryIndex ) : "" );
        var queryHash = Url.parseQuery( query );
        for ( var key in hash )
            queryHash[ key ] = hash[ key ];
        var prefix = ( queryIndex > 0 ? url.substring( 0, queryIndex ) : url + "?" );
        return prefix + Url.joinQuery( queryHash );
    },

    getQueryParam: function(url, param) {
        var u = Url.toHash(url);
        return Url.parseQuery(u.search)[param];
    },
    
    _hashify: function( url ) {
        return U.isString( url ) ? Url.toHash( url ) : url;
    },

    // this generic module's concession to living in the BC codebase
    // to test the current page's hostname, leave hostnameMinusPort undefined
    isCustomDomain: function(hostnameMinusPort) {
        $assert(window.siteroot, "expected siteroot");
        var hostname = hostnameMinusPort || location.hostname;
        var baseDomainPattern = new RegExp( "\\.?" + Url.toHash(siteroot).hostname.replace(/\./g, "\\.") + "$" );
        return !baseDomainPattern.test(hostname);
    }
};

//sdg TODO: find a way to name this "Dom" and merge in the rest of the Dom methods later.
//kj: YAHOO.lang.augment/augmentObject?
var DomBoot = {
        
    // Accepts an element ref, a string ID, or an array of IDs.
    // Returns an element ref or an array of element refs.
    elt: U.elt,
  
    // In IE because "old" or saved event objects are not accessible, so 
    // sometimes you need to clone them.
    cloneEvent: function( event ) {
    
        // Note: I saw a problem in FF in which, if we cloned the event,
        // the event's default action would always occur. This makes no
        // sense, because cloning is a read-only operation, but to fix it
        // I simply skip the merge in FF, where it's unnecessary anyway.
        //  - sdg 2008.04.25
        if ( event && Browser.type == "ie" )
            //NTcleanup
            return Y.lang.merge( event );
        return event;
    }
};

//shortcuts
var elt = DomBoot.elt;

// makeclass and makesubclass allow you to declare a
// class by providing a classdef hash which contains:
// {
//      ctor: function() { ... },
//      prototype : { /* objects/functions to be added to prototype */ },
//      statics : { /* objects/functions to be added to the class */ }
// }

//fixme: remove this, once playerviews.js no longer uses it
var LangUtils = {
    makeclass : function(classdef) {
        return LangUtils.makesubclass(null, classdef);
    },
    
    makesubclass : function(superclass, classdef) {
        var f = function() {};
        if(classdef.ctor) {
            f = classdef.ctor;
            classdef.ctor = null;
        }
    
        if(superclass) {
            YAHOO.lang.extend(f, superclass);
        }
    
        for(var x in classdef.prototype)
        {
            f.prototype[x] = classdef.prototype[x];
        }

        for(var x in classdef.statics)
        {
            f[x] = classdef.statics[x];
        }
        return f;
    }
};

// utility for keeping track of a list of "listeners"
// for a particular event.  the static 'create' routine
// adds the appropriate "onXXXX" setter to the provided
// object and returns the "fire" method used to trigger
// the event.  Used like this:
//
// this._foohappened = EventSender.create(this, "foohappened");
// ...
// // someone subscribes to the event:
// someobj.onfoohappened(myhandler, myhandlercalltarget)
//
// // you fire the event:
// this._foohappened(args);
//
// TODO: should it handle removing event listeners?  do
// people do that?
//
// Any reason to prefer this over YAHOO.util.Event.CustomEvent?  - sdg 2008.07.02

var EventSender = LangUtils.makeclass({
        ctor : function() {
            this._listeners = [];
        },
        prototype : {
            get_adder : function() {
                var that = this;
                return function(callback, target) {
                    that._listeners.push({ callback : callback, target : target });
                }
            },
            get_remover : function() {
                var that = this;
                return function(callback, target) {
                    for(var i=0; i<that._listeners.length;)
                    {
                        if(that._listeners[i].callback == callback &&
                           that._listeners[i].target == target)
                        {
                            that._listeners.splice(i, 1);
                        }
                        else
                        {
                            i++;
                        }
                    }
                }
            },
            fire : function() {
                for(var i=0; i<this._listeners.length; i++)
                {
                    var l = this._listeners[i];
                    try
                    {
                        l.callback.apply(l.target, arguments);
                    }
                    catch(e)
                    {
                        Log.debug("exception caught in event handler: " + l.callback.toString());
                    }
                }
            }
        },
        statics : {
            create : function(obj, eventname){
                var sender = new EventSender();
                // adding a serial number to the EventSender helps debugging
                sender.serial = EventSender.serial++;
                obj["on" + eventname] = sender.get_adder();
                obj["remove_on" + eventname] = sender.get_remover();
                return function() { sender.fire.apply(sender, arguments); };
            },
            serial : 1
        }
    });

var FormUtils = {
        
    showHideAlert: function( elem, text ) {
        elem = elt( elem );
        if (!elem) return;
        
        if ( typeof(text) != "boolean")
            elem.innerHTML = text || "";
        
        //NTcleanup
        if ( text )
            Y.util.Dom.addClass( elem, "alertActive" );
        else {
            Y.util.Dom.removeClass( elem, "alertActive" );
            if ( window.Form && window.Form.validate )
                Form.validate.remove_onchange_listeners( elem );
        }
    }
};


// Here I defined a sort of "proto" Form object to support user actions, like clicking
// on a submit button before the page is fully loaded. In some cases, you will want 
// to put up a simple message saying "wait until the page is fully loaded". In others 
// you might want to capture the user action and wait until the page is fully loaded 
// (so you can validate for instance), but submit automatically wihtout a second user
// action -- as is the case in login. The rest of the form object is defined in form.js.  
// (wrs 5/17/2010)

var Form = {
    
    _classDefinition : 1,
    _allowSubmit : false,
    _submitTimer : null,      
    
    // delaySubmitUtilReady
    // set your onload hanlder attribute in your html to this, pass in:
    // 1) the submit event
    // 2) your custom submit funtion, 
    // 3) any function to change the ui (for example to disable the submit button, 
    // 4) and a delay interval. Delay_interval defaults to 100 millis.
    // None are required. 
    //
    // The custom submitter can have any signature that has at least two params 
    // -- the first of which is the event (and when called via the closure is 
    // null), and a boolean needs_validation, which is always true when called 
    // from here, and indicates that the regular form validation has not been
    // so that you can validate as needed. 
    delaySubmitUntilReady : function ( e, submitter, change_ui, delay_interval ) {
        
        if( !delay_interval ) delay_interval = 100;      
        var debugstring =  "event: " + e.type + ", delay_interval: " + delay_interval + ", change_ui: " + typeof (change_ui);
        Log.debug("delaySubmitUntilReady: " + debugstring );

        if ( !Form._allowSubmit ) {
            //NTcleanup
            Y.util.Event.stopEvent(e);
            
            // sometimes you might want to alter the ui while you are waiting, 
            // for example disabling the submit button %}
            if( change_ui )
                change_ui();  
                  
            if( submitter )  {
                fn = Form.makeSubmitClosure( delay_interval, submitter );
                Form._submitTimer = setTimeout( fn, delay_interval );                    
            } 
            else {
                alert("The page is still loading; please wait just a moment...");
            }       

        }
        else{
            ; //noop: just let submit-event listener from form library take over.
        }  
    },
    
    // makeSubmitClosure
    // Creates a closure so the custom submitter can be executed on a timer. 
    // Should probably be used only by Form.delaySubmitUntilReady.
    makeSubmitClosure : function(delay, submitter){
        
        return function() {  
               Log.debug("anon fn: delay interval: " + delay ); 
               
               if(Form._submitTimer)    
                    clearTimeout( Form._submitTimer );    

                if ( !Form._allowSubmit ) {
                    Log.debug("delaying " + delay + " millis...");  
                    var nextTry = Form.makeSubmitClosure(delay, submitter )
                    Form._submitTimer = setTimeout( nextTry, delay );  
                } 
                else {
                    Log.debug("Allowing Submit");
                    submitter( null, true);
                }
            };
    }
};

var WriteJS = {

    bestImg: function( html, phoneURL ) {
        var mv = window.MediaView;
        if (mv && mv.mode == "phone" && phoneURL) {
            // It would be cleaner to use jquery to parse the html, modify it as a DOM, and then serialize it back out.
            // But this method is performance-sensitive, and string manipulation is much faster:
            html = html.replace( /src=("[^"]*"|'[^']*')/, 'src="' + Text.escapeHtml(phoneURL) + '"' );
        }
        if (html)
            document.write(html);
    },

    bestImgFormat: function( html, phoneFormat ) {
        var mv = window.MediaView;
        if (mv && mv.mode == "phone") {
            html = html.replace(/(\/img\/a?[0-9]+)_[0-9]+\./, "$1_" + Text.escapeHtml(phoneFormat) + ".");
        }
        if (html)
            document.write(html);
    },

    bestHTML: function( html, phoneHTML ) {
        var mv = window.MediaView;
        var out = (mv && mv.mode == "phone") ? phoneHTML : html;
        if (out)
            document.write(out);
    }
};

function TimeIt( fn ) {
    var start = new Date().getTime();
    fn();
    return new Date().getTime() - start;
}
;
/* ------------- BEGIN flashproxy.js --------------- */;
// Copyright 2008 Bandcamp, Inc.  All Rights Reserved
// Author: Neal Tucker (ntucker@august20th.com)
//
// FlashProxy -- javascript code for bootstrapping
//               AS ObjectProxy classes
//
// sample usage: FlashProxy.whenclassready('MyClass', function() {
//                                  var mc = new FlashProxy.MyClass();
//                                  ...etc
//                              });
// prerequisite: swfobject.js

function FPDebug(str) {
    //Log.debug(str);
}

function FPTrace(str) {
    //Log.debug(str);
}

var FlashProxy = {
    // tells FlashProxy about a SWF containing
    // classes to be proxied.  This information is used
    // to dynamically load SWFs in response to whenclassready()
    // calls
    register_proxy : function(swfurl, classnames) {
        for(var i=0; i<classnames.length; i++)
        {
            FlashProxy._class_urls[classnames[i]] = swfurl;
        }
    },

    // asks FlashProxy to load a SWF containing the class
    // if necessary and notify via callback when it is ready
    // to be used
    whenclassready : function(classname, callback, errorcallback) {

        FPTrace("whenclassready(" + classname + ") called");

        if( FlashProxy.error ) {
            if(errorcallback) {
                FPTrace("flash proxy error for class " + classname + "; calling error callback");
                errorcallback();
            }
            return;
        }

        if( FlashProxy.find_by_classname(classname) ) {
            FPDebug("whenclassready(" + classname + "): class is already ready");
            callback();
            return;
        }

        if(!FlashProxy._proxywaiters[classname])
            FlashProxy._proxywaiters[classname] = [];


        var swfurl = FlashProxy._class_urls[classname];
        if(!swfurl)
        {
            Log.error("No SWF URL found for class " + classname);
            // hmm, what do to here.  this may be an error and it
            // may not.  in some cases, we just want to wait for
            // this class to appear since the SWF is inline in HTML,
            // as opposed to being dynamically loaded.  Timeout?
        }

        FPTrace("loading swf " + swfurl);
        FlashProxy._proxywaiters[classname].push({ success: callback, failure: errorcallback});

        if(swfurl)
        {
            if(!FlashProxy._loadswf(swfurl))
            {
                FlashProxy._onproxyerror(classname);
            }
        }
    },

    // the invalidate functions are used to indicate that a
    // proxy is no longer any good, and associated objects
    // (object instances, proxy classes, and swfs) should
    // be tossed
    invalidate_class : function(classname) {
        var entry = FlashProxy._by_classname[classname];
        FlashProxy._invalidate_entry(entry);
    },
    invalidate_swf : function(url) {
        var entry = FlashProxy._by_swfurl[classname];
        FlashProxy._invalidate_entry(entry);
    },
    invalidate_proxyid : function(id) {
        var entry = FlashProxy._by_proxyid[id];
        FlashProxy._invalidate_entry(entry);
    },
    _invalidate_entry : function(entry) {
        if(!entry) return;
        for(var i=0; i<entry.classes.length; i++)
        {
            FPDebug("invalidating class " + entry.classes[i]);
            FlashProxy._by_classname[entry.classes[i]] = null;
            FlashProxy[entry.classes[i]] = null;
        }

        if(entry.proxyid)
        {
            FPDebug("invalidating proxy id " + entry.proxyid);
            FlashProxy._by_proxyid[entry.proxyid] = null;
        }

        if(entry.swfurl)
        {
            FPDebug("invalidating proxy swfurl " + entry.swfurl);
            FlashProxy._by_swfurl[entry.swfurl] = null;
        }

        //fixme: invalidate instances?
    },
    is_proxy_valid : function(proxyid) {
        return FlashProxy.find_by_proxyid(proxyid) != null;
    },
    _is_entry_valid : function(entry) {
        if(entry)
        {
            // is element a descendant of document?
            var is_in_document = function(elem) {
                try {
                    var cur = elem;
                    while(cur) {
                        cur = cur.parentNode;
                        if(cur == document) {
                            return true;
                        }
                    }
                } catch(e) {
                }
                FPDebug("entry is not valid because it is not a descendant of document!");
                return false;
            }

            // if this entry is pending (meaning we are in the
            // middle of _loadswf), it is automatically valid.
            // Otherwise, check to make sure it has a swfobject
            // property, that the swfobject has the getproxynames
            // function, and that the swfobject is actually in
            // the document
            var swfExists = (typeof entry.swfobject != "undefined") && entry.swfobject; // typeof null == "object"
            if(entry.pending || (swfExists && entry.swfobject.getproxynames && is_in_document(entry.swfobject)))
            {
                return true;
            }
            FPDebug("entry is not valid: entry.swfobject=" + entry.swfobject + ", entry.swfobjects.getproxynames=" + ( swfExists ? entry.swfobject.getproxynames : "[undef]" ) );

            // if it is not valid, make sure everyone knows it
            FlashProxy._invalidate_entry(entry);
        }
        return false;
    },

    // routines to look for an entry based on classname, swf url, or proxyid.
    // all validate that the entry is ok before returning it
    find_by_classname : function(classname) {
        var entry = FlashProxy._by_classname[classname];
        if(FlashProxy._is_entry_valid(entry))
            return entry;
        return null;
    },
    find_by_swfurl : function(url) {
        var entry = FlashProxy._by_swfurl[url];
        if(FlashProxy._is_entry_valid(entry))
            return entry;
        return null;
    },
    find_by_proxyid : function(proxyid) {
        var entry = FlashProxy._by_proxyid[proxyid];
        FPDebug("found proxy entry by id \"" + proxyid + "\": " + entry);
        if(FlashProxy._is_entry_valid(entry))
            return entry;
        FPDebug("proxy entry is not valid");
        return null;
    },

    // one special convenience: get the swfobject (as opposed to
    // the entry) for a given proxyid.
    find_proxy : function(proxyid) {
        var entry = FlashProxy.find_by_proxyid(proxyid);
        return entry ? entry.swfobject : null;
    },

    // dynamically load the given swf, creating an entry for
    // it and presumably triggering callbacks from flash which
    // result in classes being defined
    _loadswf : function(url) {
        var existing = FlashProxy.find_by_swfurl(url);
        if(existing)
            return existing;

        var create_confirm_button = false;

        // a little special case hardcoded here for nugget.swf:
        // create the SWF large enough to become an "OK" button
        // which can be used for getting around restricted APIs
        // throwing exceptions unless we are clicking directly
        // on the flash object.  This does not need to be hard-
        // coded to only work for nugget.swf, but we'd need to
        // make a table of which SWFs get this functionality (it
        // can't be all of them, since InlineVis is already sized),
        // so for now I'll just hardcode the decision here.
        
        var nuggetname = "nugget2.swf";
        if(url.substr(url.length-nuggetname.length, nuggetname.length) ==
            nuggetname)
        {
            create_confirm_button = true;
        }
        
        //generate proxy id
        var proxyid = FlashProxy._next_proxy_id++;
        var entry = { classes : [], swfurl : url, proxyid : proxyid, pending : true };
        //fixme: list of instances?
        if(FlashProxy._by_swfurl[url])
        {
            FlashProxy._invalidate_entry(FlashProxy._by_swfurl[url]);
        }

        FlashProxy._by_swfurl[url] = entry;
        FlashProxy._by_proxyid[proxyid] = entry;

        entry._container_id = "proxy_container_" + proxyid;
        entry._object_id = "proxy_swfobject_" + proxyid;

        var width = "0";
        var height = "0";

        var swfobject = new SWFObject(url, entry._object_id, width, height, "8", "#F0F0F0");
        swfobject.addParam("allowscriptaccess", "always");
        swfobject.addVariable("proxyid", proxyid.toString());
        swfobject.addVariable("namespace", "FlashProxy"); //fixme: does this matter?

        var elem = document.createElement("DIV");
        if(create_confirm_button)
        {
            elem.style.position = "absolute";
            elem.style.zIndex = "9999";
            swfobject.addParam("style", "z-index: 9999;");
            swfobject.addParam("width", width);
            swfobject.addParam("height", height);
        }
        elem.id = entry._container_id;
        document.body.appendChild(elem);

        //fixme: how does version error get back?

        if(!swfobject.write(entry._container_id))
        {
            //fixme: set some error status in entry and throw
            //an error?
            FlashProxy.flash_has_version = swfobject.installedVer.major + "." + swfobject.installedVer.minor;
            FlashProxy.error = true;
            return null;
        }
        entry.swfobject = document.getElementById(entry._object_id);
        FPTrace("swfobject id is " + entry._object_id);
        entry.pending = false;
    
        return entry;
    },

    // flash calls back to _onproxyready after setting up the
    // externally-visible methods which expose the class.  The
    // proxyid that was passed in as a flashvar is passed back
    // as well.  If the flash object was not instantiated by
    // _loadswf, then the proxyid flashvar should be set to
    // the DOM element id of the swf object.
    _onproxyready : function(proxyid, classname) {
        try {
            var entry = FlashProxy.find_by_proxyid(proxyid);
            FPTrace("_onproxyready: existing entry: " + entry);
    
            // at this point there may or may not be
            // an entry for the given proxyid, because
            // the SWF may have been instantiated due
            // to being place inline in the HTML
            if(!entry)
            {
                FPDebug("no object for proxid " + proxyid + ".  Checking for HTML element.");
                var elem = document.getElementById(proxyid);
                FPTrace("elem: " + elem);
                if(!elem || !elem.getproxy)
                {
                    FPTrace("Did not find HTML element for proxyid " + proxyid + " either.  Waiting a bit (elem = " + elem + ").");
                    setTimeout(function() {
                            FlashProxy._onproxyready(proxyid, classname);
                        }, 0);
                    FPTrace("timeout set");
                    return;
                }
    
                entry = { swfobject : elem, proxyid : proxyid, classes : [] };
                FlashProxy._by_proxyid[proxyid] = entry;
                FPDebug("set FlashProxy._by_proxyid[\"" + proxyid + "\"] to entry containing swfobject=" + entry.swfobject);
            }
    
            // now that we have an entry, it may not have its swfobject
            // set yet, because in some cases (only in IE it seems), the
            // flash can do external callbacks before the JS code which
            // created it has finished, so the assignment to entry.swfobject
            // has not yet occurred.  In this case, just reschedule this
            // callback for a moment.
            if(!entry.swfobject)
            {
                setTimeout(function() {
                        FlashProxy._onproxyready(proxyid, classname);
                    }, 0);
                return;
            }
    
            FPDebug("calling into swfobject: " + entry.swfobject);
            FPDebug("creating class FlashProxy." + classname);
            var jscode = "FlashProxy." + classname + " = " + entry.swfobject.getproxy(classname) + ";";
            FPDebug("retrieved JS proxy code for " + classname);
            //FPTrace("JS code: " + jscode);
            eval(jscode);
            FPDebug("FlashProxy." + classname + " created");
    
            entry.classes.push(classname);
            FlashProxy._by_classname[classname] = entry;
    
            // notify any waiting callbacks that this class is ready
            var waiters = FlashProxy._proxywaiters[classname];
            if(waiters)
            {
                FPDebug("" + waiters.length + " waiters waiting for " + classname);
                var waiter;
                while(waiter = waiters.pop())
                {
                    try
                    {
                        FPTrace("calling waiter: " + waiter.toString());
                        waiter.success();
                    }
                    catch(ex)
                    {
                        FPDebug("flash proxy 'whenclassready' handler for " + classname + " failed");
                    }
                }
            }
    
            FPTrace("onproxyready(" + proxyid + ", " + classname + ") exiting");
            return true;
        }
        catch(exc)
        {
            FPDebug("_onproxyready caught: " + exc.message);
            setTimeout(function() {
                    FlashProxy._onproxyready(proxyid, classname);
                }, 0);
        }
    },
    _onproxyerror : function(classname) {
        // notify any waiting callbacks that this class is ready
        var waiters = FlashProxy._proxywaiters[classname];
        if(waiters)
        {
            FPDebug("" + waiters.length + " waiters waiting for " + classname);
            var waiter;
            while(waiter = waiters.pop())
            {
                try
                {
                    if(waiter.failure)
                        waiter.failure();
                }
                catch(ex)
                {
                    FPDebug("flash proxy 'whenclassready' error handler for " + classname + " failed");
                }
            }
        }
    },

    _next_proxy_id : 1,
    _by_swfurl : {},
    _by_classname : {},
    _by_proxyid : {},

    //mapping from classname to swf url
    _class_urls : {},

    _proxywaiters : {},

    // _fire_event()
    //
    // Called by ActionScript in order to invoke
    // an event on a particular object instance.
    // This looks up the corresponding JS object 
    // and fires any handlers that have been registered
    // for this event.  Note that this function is
    // always called, regardless of whether there are
    // event listeners, and the dispatching is done
    // from here.  This reduces the number of
    // ExternalInterface calls that are made for events
    // with multiple subscribers, but increases the number
    // of calls made for events with no subscribers.
    
    _fire_event : function(ref, eventname, arg) {

		// Safari can fail to flush DOM changes to the screen if they
		// are made synchronously from within a call that originated
		// inside Flash (e.g. a progress bar).  So we notify the handlers
		// on a timeout. This is new for all events as of 2009.01.08;
		// we expect this won't matter, will deal with it later if it
		// does.  See FB 66 for repro details.  -- kj
        // 2012.11.29: updated to eliminate dependency on YUI's 'later',
        // which is overkill

        var that = this;
        function refire() {
            that._do_fire_event.call(that, ref, eventname, arg);
        }
        setTimeout(refire, 1);
    },

	// _do_fire_event
	//
	// Inner utility for firing event handlers synchronously.
	// See _fire_event for details.
    
    _do_fire_event : function(ref, eventname, arg) {
        var obj = FlashProxy._ref_to_obj[ref];
        var handlers = obj._events[eventname];
        for(var i=0; handlers != null && i<handlers.length; i++)
        {
            try
            {
                handlers[i](obj, arg);
            }
            catch (e)
            {
                var msg = "caught exception in \"" + eventname + "\" handler: ";
                msg += e.message ? e.message : e;
                if (e.stack) {
                    msg += "\n" + e.stack;
                }
                FlashProxy.logerror(msg);
            }
        }
    },

    // _register_instance
    //
    // Called by the each javascript proxy class' constructor
    // in order to create a mapping from the ActionScript 'ref'
    // to the actual JS object instance.
    _register_instance : function(ref, obj) {
        if(FlashProxy._ref_to_obj[ref])
        {
            FlashProxy.logerror("flash proxy: trying to register an instance that already exists! (ref: " + ref + ")");
            return;
        }

        FlashProxy._ref_to_obj[ref] = obj;
    },

    logerror : function(str) {
        if(typeof Log != "undefined" && typeof Log.error != "undefined")
        {
            Log.error("flash proxy error: " + str);
        }
    },

    _confirmation_dialog : null,
    _confirmation_dialog_container : null,

    _confirm_restricted_api : function(proxyid, message, title, includeCancel) {
        var entry = FlashProxy.find_by_proxyid(proxyid);
        var swfobject = FlashProxy.find_proxy(proxyid);
        var container = elt(entry._container_id);

        title = title || "Flash confirmation"

        $assert(swfobject && container);

        if ( includeCancel != true ) includeCancel = false; // normalize

        FlashProxy._confirmation_dialog = Dialog.openTemplate(title, "flash_confirmation", { message: message, proxyid: proxyid, includeCancel: includeCancel }, [] );

        FlashProxy._confirmation_dialog.cancelEvent.subscribe( function() {
            FlashProxy._confirmation_dialog = null;
            FlashProxy._dismiss_confirmation(proxyid);
        });

        // hide the flash button when dragging the dialog
        FlashProxy._confirmation_dialog.dragEvent.subscribe( function() {
            swfobject.height = "1px";
            swfobject.width = "1px";
            container.style.top = "0px"
            container.style.left = "0px"
        });

        // reposition the flash button when the dialog moves
        FlashProxy._confirmation_dialog.moveEvent.subscribe( function() {
            FlashProxy._position_confirmation_button(proxyid);
        });
    },

    // stick the "OK" button flash movie directly on top
    // of the OK button image that is already sitting on the
    // dialog.
    _position_confirmation_button : function(proxyid) {
        var entry = FlashProxy.find_by_proxyid(proxyid);
        var swfobject = FlashProxy.find_proxy(proxyid);
        var container = elt(entry._container_id);
        var okimg = elt("flashconfirmok");

        $assert(swfobject && container && okimg);

        swfobject.height = "31";
        swfobject.width = "85";

        // wrapper for YUI setXY which checks to
        // make sure there was no rounding problem with the pos
        // and resets if so.
        var setXYHack = function(elem, xy) {
            var desired = [].concat(xy);
            Y.util.Dom.setXY(elem, desired);
            var actual = Y.util.Dom.getXY(elem);
            desired[0] += desired[0] - Math.round(actual[0]);
            desired[1] += desired[1] - Math.round(actual[1]);

            Y.util.Dom.setXY(elem, desired);
        }

		// Reset the z-index, we float it beneath the page 
		// at hide time:
        container.style.zIndex = 9999;

        var pos = Y.util.Dom.getXY(okimg);
        pos[0] += 2;
        pos[1] += 2;
        setXYHack(container, pos);
    },

    _hide_confirmation_dialog : function(proxyid) {
        var entry = FlashProxy.find_by_proxyid(proxyid);
        var swfobject = FlashProxy.find_proxy(proxyid);
        var container = elt(entry._container_id);
        FlashProxy._confirmation_dialog_container = container;
        
        $assert(swfobject && container);

        swfobject.height = "1px";
        swfobject.width = "1px";
        container.style.zIndex = -1;
            // We used to do this as well:
            // container.style.top = "0px";
            // container.style.left = "0px";
            // But Safari blocks AS-to-JS communication if the SWF is not visible
            // on the screen (not just on the page-- if it's scrolled off, it's disabled).
            // Even setting left leaves us vulnerable in cases where the screen is small, or
            // zoomed way in-- which should be rare, of course, and we use it mostly
            // in editors these days (pages for bands, not fans).  Setting the zIndex will
            // float it beneath the page body which is good enough.

        if(FlashProxy._confirmation_dialog)
        {
            FlashProxy._confirmation_dialog.destroy();
            FlashProxy._confirmation_dialog = null;
        }
    },

    _dismiss_confirmation : function(proxyid) {

        var entry = FlashProxy.find_by_proxyid(proxyid);
        var swfobject = FlashProxy.find_proxy(proxyid);
        var container = elt(entry._container_id);
        $assert(swfobject && container);
        FlashProxy._hide_confirmation_dialog(proxyid);
        swfobject.cancel_confirmation();
    },

    // the mapping table for _register_instance
    _ref_to_obj : {},

    noFlashError : function(sitch) {
        if ( sitch == "upload" && Browser.platform == "iphone" ) {
            // Special case.  Should only happen with iOS 5 and below (already scarce):
            Dialog.alert( "Upload", "To upload files, visit Bandcamp from a desktop computer." );
            return;
        }

        var title = "Flash Required"; //UISTRING
        var message = "In order to use this feature, you must have the Adobe Flash Player installed."; //UISTRING

        var situations = { //UISTRINGs
            "share" : "In order to embed the music player on another site, you must have the Adobe Flash Player installed.",
            "player" : "In order to use the music player, you must have the Adobe Flash Player installed.",
            "upload": "In order to upload files, you must have the Adobe Flash Player installed.",
            "download": "In order to download, you must have the Adobe Flash Player installed."
        }

        if(situations[sitch]) message = situations[sitch];

        Dialog.openTemplate(title, "flash_required", { title: title, message : message }, Dialog.buttons.ok()); //UISTRING
    }, 
    
    cleanUpHack: function(){
        // put any resources here that might later need cleaning up.
        // by later, I mean, after all the AS-to-JS communication is done.
        // this list is not meant to be exhaustive; it's a list of things
        // we've run into that cause problems.
        if ( FlashProxy._confirmation_dialog_container )
            Y.util.Dom.setXY(FlashProxy._confirmation_dialog_container, [0,0]);
    }
};

// we can actually get the list of classes proxied from the SWFs if we
// want, but specifying a list here allows us to load the SWFs on demand,
// rather than having to load them in order to find out what they hold.

FlashProxy.register_proxy(siteroot_current + "/js/shared/nugget2.swf", ["Downloader", "Uploader", "SoundPlayer"]);

// fixme: flashproxy has no way to export global functions that
// exist in a SWF; it only proxies methods on classes.  So for now,
// I am hacking in some knowledge that certain SWFs implement
// certain global functions

FlashProxy.log_enable = function(str) {
    for(var x in FlashProxy._by_proxyid) {
        FlashProxy._by_proxyid[x].swfobject.log_enable(str);
    }
};
FlashProxy.set_clipboard = function(str) {
    FlashProxy.whenclassready("Uploader", function() {
            FlashProxy._by_classname["Uploader"].swfobject.set_clipboard(str);
        });
};

/*
if(isDebug)
{
    setTimeout(function() {
        FlashProxy.whenclassready("Downloader", function() {
            FlashProxy._by_classname["Downloader"].swfobject.act_like_flash10();
        });
    }, 5000);
}
*/

;
/* ------------- BEGIN html5sound.js --------------- */;
//HTML5Player:  wrapper which implements our SoundPlayer interface (normally
//implemented by Flash) using HTML5 audio element
HTML5Player = function(){

    var nextId = 1;

    function HTML5Player() {
        var platform = Browser.platform,
            browserMake = Browser.make,
            browserType = Browser.type,
            volumeCookie = Cookie.get('volume');

        if (volumeCookie) {
            volumeCookie = parseFloat(volumeCookie, 10);
        }

        this._id = nextId;
        nextId++;

        this._options = {
            debug: false,  // log more detail, including most native HTML5 audio events

            // workarounds (active)
            reloadOnSeek:         (browserMake == "chrome" && (platform == "win" || platform == "nix" || platform == "mac")),
            simulateEndedAndroid: (browserMake == "chrome" && platform == "android"),
            simulateEndedSafari:  (browserMake == "safari" && (platform == "iphone" || platform == "mac")),
            safeLoad:             (browserMake == "androidbrowser" && platform == "android"),
            playKick:             (browserMake == "androidbrowser" && platform == "android" && Browser.version[0] < 4),
            loadStartKick:        (browserMake == "androidbrowser" && platform == "android" && Browser.version[0] >= 4),
            deferPlayEvents:      ((browserMake == "chrome" || browserMake == "androidbrowser") && platform == "android"),
            retryErrors:          (browserType == "gecko"),
            volume:               volumeCookie || 0.7,

            // workarounds (deprecated September 2013)
            deferredSeeks: false,
            resetOnStall: false
        };

        // for testing, allow URL params to override the default options
        if (window.Url) {
            var params = Url.parseQuery(location.search);
            for (var opt in this._options) {
                if (params.hasOwnProperty(opt)) {
                    if (opt == "volume") {
                        var v = parseFloat(params[opt]);
                        if (v)
                            this._options[opt] = v;
                    } else
                        this._options[opt] = !(params[opt] == "0" || params[opt] == "false");
                }
            }
        }

        this._handlers = {
            state : [],
            time : [],
            loaded : [],
            info : [],
            volume : []
        };

        this._listeners = [];
        this._volume = this._options.volume;
        this._recentpos = []; // holds the last few time positions during playback

        if (this._options.debug) {
            var msg = ["constructed; options: "];
            for (var k in this._options)
                msg.push( k, "=", this._options[k], "; " );
            this._info(msg.join(""));
        }

        this._createmedia();
        this._changestate(IDLE);
        
        if (Browser.platform == "iphone") {
            // On iphone, the DOM/JS page state is usually saved if you navigate to another page 
            // and then use the Back button. When we navigate away from the original page, the html5 
            // player element appears to pause itself and report its own position as 0, despite the fact that 
            // if you play() it, it actually maintained its position. The result is that after navigating 
            // back, the player 1) still displays the "playing" state even though it is paused, and 
            // 2) displays the playhead at time 0, which is incorrect.
            //
            // To work around this bug, we originally listened for the pagehide event and paused the 
            // player, to force a UI/player resync (note the unload event does not fire when Safari is going
            // to cache the page state). But this caused playback to cease whenever pagehide fired, 
            // which was often -- for example, when the screen turned off, or when switching to another app. 
            // Instead, we now continually keep track of the last few audio time values during playback. 
            // When we detect the end of a page navigation (using the more-specific popstate event), we look 
            // at the last two time values, and if they suggest the bug has occurred, we reset the player 
            // state accordingly.  - sdg 2012.08.24
            var that = this;
            window.addEventListener( "popstate", function() {
                var recent = that._recentpos;
                if ( that._state == PLAYING && recent.length ) {
                    // at this point, the page must have come out of the back/forward cache, so correct the play/pause UI
                    that.pause();
                    if ( recent.length > 1 && recent[recent.length-1] == 0 && recent[recent.length-2] > 0 ) {
                        // looks like we hit the position == 0 bug
                        var restorePos = recent[recent.length-2];
                        that._warn( "detected iOS page navigation bug; resetting playhead position to " + restorePos );
                        that._fire_event( "time", { position: restorePos } );
                        recent.pop(); // not strictly necessary, but let's not repeat ourselves after another back/forward
                    }
                }
            } );
        }

        // In Android Browser on the HTC One, running Android 4.1.2, calling the native load() method when switching
        // from one track to the next throws an exception: INVALID_STATE_ERR: DOM Exception 11. Strangely, if we catch
        // this exception and then continue, the new track loads and plays correctly.  - sdg 2013.09.03
        if (this._options.safeLoad) {
            this._nativeLoad = this._nativeLoadSafe;
        }
    }

    HTML5Player.prototype = {
        load : function(url) {
            this._debug("load()");
            this._stallcount = 0;
            this._errorRetryCount = 0;
            this._loadedurl = url;
            this._wantstoplay = false;
            this._recentpos.length = 0; // truncate
            if(!_useLocationHack) {
                this._nativePause();
                this._nativeLoad();  // why do this here?  - sdg 2013.08.30
                this._changestate(BUFFERING);
                this._nativeSrc(url);
                this._nativeLoad();
                this._finishedloading = false;
                this._loadStartKicked = false;
                this._playingEventDeferred = false;
            }
        },
        play : function() {
            this._debug("play()");
            if(_useLocationHack) {
                location = this._loadedurl;
            } else {
                if(!this._wantstoplay) {
                    this._wantstoplay = true;
                    this._nativePlay();
                }
            }
        },
        pause : function () {
            this._debug("pause()");
            this._cancelPlayKick();
            this._wantstoplay = false;
            this._nativePause();
        },
        playpause : function() {
            this._debug("playpause()");
            switch(this._state) {
                case PLAYING:
                case BUFFERING:
                    this.pause(); break;
                default:
                    this.play();
            }
        },
        stop : function() {
            this._debug("stop()");
            this._cancelPlayKick();
            this._wantstoplay = false;
            this._nativePause();
        },
        seek : function(seconds) {
            this._debug("seek() to " + seconds);

            /* awful hack time -- this code triggers a refresh of the stream URL
            without rate limits after seeking. This is only required on desktop
            Chrome, which isn't smart enough to use range requests to seek within
            MP3 files */
            var performed_reload_seek = false,
                that = this;
            
            if(this._options.reloadOnSeek && this._mediaElem.src.substring(this._mediaElem.src.length - 5) != "&nl=1") {
            
                /* check if we've already buffered the area being seeked to */
                var already_buffered = false;
                for(var i=0; i < this._mediaElem.buffered.length; i++) {
                    if(this._mediaElem.buffered.start(i) <= seconds && seconds <= this._mediaElem.buffered.end(i)) {
                        already_buffered = true;
                        break;
                    }
                }
                
                if(!already_buffered) {
                    this._debug("refreshing with non-rate-limited URL");
                    this._nativePause();
                    this._nativeSrc(this._mediaElem.src + "&nl=1");
                    
                    var seek_on_metadata_load = function(e) {
                        this.removeEventListener("loadedmetadata", seek_on_metadata_load);
                        
                        that._nativeSeek(seconds);
                        that._nativePlay();
                    }
                    
                    this._mediaElem.addEventListener("loadedmetadata", seek_on_metadata_load, false);
                    this._nativeLoad();
               
                    performed_reload_seek = true;
                }
            }
            
            if(!performed_reload_seek) {

                if (this._options.deferredSeeks) {
                    // DEPRECATED: deferred seeks were originally added in rev 20294 to work around an IE seeking bug.
                    // I can't reproduce that bug, and the deferral was causing a new problem when seek(0) is used
                    // as a synonym for play() by higher-level code, which is often. So deprecating this until
                    // we decide it can be removed.  - sdg 2013.08.30
                    this._wantstoplay = true;
                    switch(this._state) {
                        case PLAYING:
                        case BUFFERING:
                            this._debug("doing deferred seek during playback");
                            this._wantseek = true;
                            this._wantpos = seconds;
                            break;
                        default:
                            this._seek_inner(seconds);
                    }
                }
                else {
                    this._seek_inner(seconds);
                }
            }
        },
        _seek_inner : function (seconds) {
            if (this.position() == seconds) {
                this._debug("seek: new position (" + seconds + ") matches current, so taking no action");
            }
            else {
                try {
                    this._nativeSeek(seconds);
                }
                catch(e) {
                    this._warn("caught error seeking -- perhaps your downloader does not support byte ranges? " + e);
                }
            }
            this.play();
        },
        
        position : function() {
            return this._mediaElem && this._mediaElem.currentTime;
        },
        state : function() {
            return this._state;
        },
        setrate : function(r) {
            this._mediaElem.playbackRate = r;
        },
        vol_up : function() { this.setvol(this._volume + 0.05); },
        vol_down : function() { this.setvol(this._volume - 0.05); },
        setvol : function(vol) {
            if(vol > 1) vol = 1;
            else if (vol < 0) vol = 0;
            if(this._volume != vol) {
                this._volume = vol;
                this._debug("setting media element volume to " + this._volume);
                try {
                this._mediaElem.volume = this._volume;
                } catch (e) {
                    this._warn("caught exception setting volume: " + e);
                }
            }
            this._fire_event("volume", { volume : this._volume });
        },
        getvol : function() {
            return this._volume;
        },
        onstate : function(handler) {
            this._add_event_handler("state", handler);
        },
        ontime : function(handler) {
            this._add_event_handler("time", handler);
        },
        onloaded : function(handler) {
            this._cancelReset();
            this._add_event_handler("loaded", handler);
        },
        oninfo : function(handler) {
            //fixme: these never actually get fired
            this._add_event_handler("info", handler);
        },
        onvolume : function(handler) {
            this._add_event_handler("volume", handler);
        },

        //methods to create and destroy the media element.  this needs
        //to happen when switching tracks apparently, because the iphone
        //sometimes seems to have trouble changing the .src property and
        //actually switching the stream to the new track.  This hooks up
        //the appropriate event handlers via _addlistener, which keeps
        //track of the listeners so _destroymedia can remove them all
        //before removing the element.
        _createmedia : function() {
            this._mediaElem = document.createElement("audio");
            this._mediaElem.style.width = "0px";
            this._mediaElem.style.height = "0px";
            this._mediaElem.style.visibility = "hidden";
            this._mediaElem.controls = false;
            document.body.appendChild(this._mediaElem);

            if (this._options.debug) {
                for(var i=0; i < this._loggedEvents.length; i++)
                    this._logevt(this._loggedEvents[i]);
            }

            this._mediaElem.volume = this._volume;
            this._addlistener("loadstart", this._handle_loadstart, this);
            this._addlistener("timeupdate", this._handle_timeupdate, this);
            this._addlistener("progress", this._handle_progress, this);
            this._addlistener("canplay", this._handle_canplay, this);
            this._addlistener("canplaythrough", this._handle_canplay, this);
            this._addlistener("durationchange", this._handle_durationchange, this);
            this._addlistener("playing", this._handle_playing, this);
            this._addlistener("pause", this._handle_pause, this);
            this._addlistener("ended", this._handle_ended, this);
            this._addlistener("stalled", this._handle_stalled, this);
            this._addlistener("waiting", this._handle_waiting, this);
            this._addlistener("error", this._handle_error, this);
        },

        _loggedEvents: [
            "abort",
            "canplay",
            "canplaythrough",
            "durationchange",   
            "emptied",
            "ended",
            "error",
            "loadeddata",
            "loadedmetadata",
            "loadstart",
            "pause",
            "play",
            "playing",
            "progress",
            "ratechange",
            "seeked",
            "seeking",
            "stalled",
            "suspend",
            "timeupdate",
            "volumechange",
            "waiting"
        ],
        _logevt : function(name) {
            this._addlistener(name, this._loghandler(name), this);
        },
        _destroymedia : function() {
            this._removelisteners();
            if(this._mediaElem) {
                document.body.removeChild(this._mediaElem);
                this._nativePause();
                this._mediaElem = null;
            }
        },
        _addlistener : function(name, fn, instance) {
            var handler = function() { fn.apply(instance, arguments); };
            this._listeners.push({name: name, handler: handler});
            this._mediaElem.addEventListener(name, handler, false);
        },
        _removelisteners : function() {
            if(!this._mediaElem) return;

            while(this._listeners.length > 0) {
                var info = this._listeners.pop();
                this._mediaElem.removeEventListener(info.name, info.handler, false);
            }
        },

        _handle_loadstart: function(arg) {

            // Android Browser in Android 4 (tested in 4.1 and 4.3 so far) appears to have a bug where, sometimes,
            // a track will start loading with duration=1 and readyState=4 and will then immediately end, as if the
            // track was really only 1 second long. The symptom is the Pause button immediately switches back to Play,
            // with no audio output. Resetting the src property early in the load sequence appears to work around this.
            //  - sdg 2013.09.06
            var media = this._mediaElem;
            if (this._options.loadStartKick && !this._loadStartKicked && media.duration == 1 && media.readyState == 4) {
                this._loadStartKicked = true;
                this._warn("loadstart: looks like Android Browser duration=1 bug; kicking media.src...");
                this._nativeSrc(media.src);
            }
        },

        _handle_waiting : function(arg) {
            this._debug("waiting");
        },

        // audio element telling us seek pos has changed
        _handle_timeupdate : function(arg) {
            try {
            var media = this._mediaElem;

            if (this._options.deferredSeeks && this._wantseek) {
                this._debug("applying deferred seek");
                this._seek_inner(this._wantpos);
                this._wantseek = false;
            }

            this._cancelPlayKick();
            
            if (this._recentpos.length == 5) // 5: arbitrary; we just want to save a few
                this._recentpos.shift();
            this._recentpos.push(media.currentTime);

            if (this._playingEventDeferred && this._state == BUFFERING) {
                this._warn("Play event was deferred; simulating it now...");
                this._playingEventDeferred = false;
                this._handle_playing_inner();
            }
 
            var evtparams = { position: media.currentTime };
            
            // iphone sends 0 for media.duration for a while, which is
            // never a useful piece of data.  Leave undefined in thise case.
            // Note that we used to ignore media.duration completely on IOS
            // because it was always 0, but that seems to be fixed.
            if(isFinite(media.duration) && media.duration > 0) {
                evtparams.duration = media.duration;
            }
            this._fire_event("time", evtparams);

            if(this._options.simulateEndedSafari && this._mediaElem.ended) {
                this._handle_ended_inner()
            }

            //hack: chrome does not send "progress"
            //      events as it is supposed to.  Use
            //      the timeupdate event handler to
            //      poll for load progress, since we
            //      already have some code running frequently.
            //      Stop doing this when we notice it's done.

            if(!this._finishedloading) {
                var amtLoaded = this._amountLoaded();
                if(amtLoaded >= media.duration) {
                    this._finishedloading = true;
                }
                if(amtLoaded != this._lastloaded) {
                    this._lastloaded = amtLoaded;
                    var evtparams = { loaded: amtLoaded };
                    if(isFinite(media.duration))
                        evtparams.total = media.duration;

                    this._cancelReset();
                    this._fire_event("loaded", evtparams);
                }
            }
            } catch(e) {
                this._warn("exception in _handle_timeupdate: " + e);
            }
        },

        _handle_progress: function() {
            var media = this._mediaElem;

            // Chrome on Android: On the Nexus 4 running Android 4.2.2, the browser appears not to send "ended" events
            // for many tracks. The problem is consistent: some tracks show it, some don't. When it occurs, we receive
            // "progress" events in which the media.duration, media.currentTime, and media.buffered.end() values are all
            // fixed and nearly identical, but the media.ended property remains false and the "ended" event never
            // occurs. I say "nearly identical", because they don't match exactly: the currentTime and buffered values
            // are floating-point numbers very slighly less than the duration, which always seems to be rounded to the
            // third decimal place. I believe this is probably the cause of the bug: the browser is waiting for
            // currentTime >= duration before considering the track ended, and that doesn't occur without the proper
            // rounding. When the situation is reversed (the currentTime is a slight fraction larger than the duration),
            // the ended event fires as expected. For comparison, on the HTC One running Android 4.1.2, all three values
            // appear to be rounded to three decimal places, so the problem doesn't occur. Our workaround attempts to
            // detect the bug and then simulates an ended event.
            //
            // Examples:
            //
            // bug occurs:
            //    duration=5.042; currentTime=5.041999816894531; buffered=5.041999816894531
            // bug doesn't occur:
            //    duration=2.482; currentTime=2.4820001125335693; buffered=2.4820001125335693
            //
            //   - sdg 2013.09.03
            if ( this._options.simulateEndedAndroid && (this._state == PLAYING) && !media.paused && !media.ended && 
                !isNaN(media.duration) ) {

                var rnd = function(val) { return Math.round(val * 1000); },
                    cur = rnd(media.currentTime),
                    dur = rnd(media.duration),
                    buf = rnd(this._amountLoaded());

                if ( (cur > 0) && (cur === dur) && (cur === buf) ) {
                    this._warn("Did we just hit the Chrome/Android bug in which the 'ended' event isn't fired?");
                    this._warn("Compensating by simulating the event ourselves...");
                    this._handle_ended_inner();
                }
            }
        },

        _handle_ended : function() {
            this._debug("_handle_ended");
            if(!this._options.simulateEndedSafari) {
                this._handle_ended_inner();
            }
        },
        _handle_ended_inner : function() {
            this._debug("_handle_ended_inner");
            try {
                this._wantstoplay = false;
                this._changestate(COMPLETED);
            } catch(e) {
                this._warn("exception in _handle_ended: " + e);
            }
        },

        // In response to "stalled" events, we would like to 
        // perform a media.load() in order to kick the browser
        // into reloading the stream.  However, some versions of
        // safari send spurious "stalled" events on streams that
        // are not stalled, so what we are going to do is schedule
        // the media.load for 7.5 seconds in the future, and only
        // actually do it if the stream really appears stalled
        // (based on whether or not the amount buffered has changed).
        // If data has loaded since the browser claimed to be
        // stalled, just ignore the event.
        _scheduleReset : function(timeout) {
            if (!this._options.resetOnStall) return;

            this._cancelReset();

            var media = this._mediaElem;
            var that = this;
            this._warn("scheduling media reset in " + timeout + "ms");
            this._resetTimer = setTimeout(function(){
                    that._resetTimer = null;
                    that._warn("Resetting media (amtloaded = " + that._amountLoaded() + ")");
                    that._nativeLoad();
                }, timeout);
        },

        _cancelReset : function() {
            if (!this._options.resetOnStall) return;
            
            if(this._resetTimer) {
                this._warn("canceling media reset due to load progress (amtloaded = " + this._amountLoaded() + ")");
                clearTimeout(this._resetTimer);
                this._resetTimer = null;
            }
        },

        _schedulePlayKick : function(timeout) {
            if (!this._options.playKick) return;
            
            this._cancelPlayKick();
            var media = this._mediaElem;
            var that = this;
            this._warn("scheduling playkick in " + timeout + "ms");
            this._playKickTimer = setTimeout(function() {
                    that._warn("kicking");
                    that._playKickTimer = null;
                    that._nativePause();
                    that._nativePlay();
                    that._warn("kicked");
                }, timeout);
        },
        _cancelPlayKick : function() {
            if (!this._options.playKick) return;

            if(this._playKickTimer) {
                this._warn("canceling playkick timer");
                clearTimeout(this._playKickTimer);
                this._playKickTimer = null;
            }
        },

        _amountLoaded : function() {
            if(this._mediaElem.buffered.length > 0) {
                return this._mediaElem.buffered.end(this._mediaElem.buffered.length - 1);
            }
            return 0;
        },

        _handle_stalled : function() {
            if(this._mediaElem.readyState == HAVE_ENOUGH_DATA) {
                // occasionally we get a stalled event even though the data
                // is all loaded.  Ignore that.
                return;
            }

            this._stallcount += 1;

            if(this._stallcount > MAX_STALLS) {
                // if we stall too many times, just give up by pretending
                // the track has ended.
                this._error("Too many stalls.  Giving up on this track.");
                this._nativePause();
                this._changestate(COMPLETED);
            } else {
                this._debug("stalled, readyState=" + this._mediaElem.readyState + ", amtloaded=" + this._amountLoaded());
                this._scheduleReset(7500);
            }
        },

        _handle_playing : function() {
            if (!(this._options.deferPlayEvents && this._state == BUFFERING))
                this._handle_playing_inner();
            else {
                // Android: Browser and Chrome often appear to trigger the "playing" event several seconds
                // before audio playback actually begins. To avoid this, wait until the first timeupdate instead.
                // This appears more effective in Android 4 than in 2.3, but it doesn't hurt either way.
                //   - sdg 2013.09.09
                this._debug("deferring play event to the next timeupdate");
                this._playingEventDeferred = true;  // see comment in _handle_timeupdate
            }
        },
        _handle_playing_inner : function() {
            try {
                this._changestate(PLAYING);
            }
            catch(e) {
                this._warn("exception in _handle_playing_inner: " + e);
            }
        },
        _handle_pause : function() {
            if ( this._state === COMPLETED &&
                (this._options.simulateEndedSafari || this._options.simulateEndedAndroid) ) {
                // our simulated 'ended' event sometimes causes us to decide to go
                // into the COMPLETED state before getting the 'pause' event at
                // the end of playback.  Ignore that pause if we're simulating 'ended'
                // and we're in the COMPLETED state.
                this._debug("ignoring 'pause' event because state is COMPLETED");
                return;
            }
            if ( this._mediaElem.paused ) {
                this._changestate(PAUSED);
            }
        },
        _handle_canplaythrough : function() {
            this._handle_canplay();
        },
        _handle_canplay : function() {
            try {
            if(this._wantstoplay) {
                this._nativePlay();
            }
            } catch(e) {
                this._warn("exception in _handle_canplay: " + e);
            }
        },

        _handle_error : function(arg) {
            var errorCode = this._mediaElem.error && this._mediaElem.error.code;
            this._error("got native error event; error.code=" + errorCode);

            // called if there's an error downloading content. For Firefox,
            // this can mean that the CDN URL has expired, since it keeps
            // using the redirected URL instead of hitting popplers each
            // time it needs to make a new request. Workaround: force a reload.
            if(this._options.retryErrors) {
                if (this._errorRetryCount < 5)  {
                    // TODO: examine the error code here?
                    this._errorRetryCount += 1;
                    this._warn("assuming error is due to an expired stream URL and reloading; count=" + this._errorRetryCount);
                    this._nativeLoad();
                }
                else {
                    this._warn("exceeded maximum number of error retries; giving up on this track");
                    this._nativePause();
                    this._changestate(COMPLETED);
                }
            }
        },
        
        _handle_durationchange : function() {
            // old android (2.3):
            // some devices get stuck in a mode where the media
            // element claims to be playing but it is not actually
            // playing.  This happens at the same time we receive
            // a durationchange event.  So here we set up a timer
            // which, if we haven't received any 'timeupdate' events
            // indicating play progress) in 500ms, we'll unstick
            // playback by calling .pause() and .play() on the element.
            // This kick is canceled if play is paused or stopped.
            this._schedulePlayKick(500);
        },

        // generate a dummy event handler which just logs the event to debug log
        _loghandler : function(name) {
            var self = this;
            return function() {
                var media = self._mediaElem,
                    buffered = null;
                try {
                    buffered = media.buffered.end(media.buffered.length - 1);
                } 
                catch(e) {}
                this._debug(
                    "[native] " + name + "; paused=" + media.paused + "; ended=" + media.ended + 
                    "; readyState=" + media.readyState + "; duration=" + media.duration + 
                    "; currentTime=" + media.currentTime + "; buffered=" + buffered
                );
            };
        },

        _isbuffering : function() {
            try {
            return this._mediaElem.readyState < HAVE_FUTURE_DATA;
            } catch (e) {}
            return false;
        },

        _changestate : function(newstate) {
            if(newstate == PLAYING && this._isbuffering()) {
                newstate = BUFFERING;
            }

            if(newstate != this._state) {
                var oldstate = this._state;
                this._state = newstate;
                this._debug("state changed from " + oldstate + " to " + newstate);
                this._fire_event("state", { newstate : this._state, oldstate : oldstate });
            }
        },

        _fire_event : function(name, arg) {
            // this._debug("firing event: " + name + " with arg: ", arg);
            handlers = this._handlers[name];
            if(handlers) {
                for(var i=0; i<handlers.length; i++) {
                    try {
                        handlers[i](this, arg);
                    } catch (e) {
                        this._warn("caught exception in handler for event \"" + name + "\": " + e);
                    }
                }
            }
        },
        _add_event_handler : function(eventname, handler) {
            this._handlers[eventname].push(handler);
        },

        // thin native method/property wrappers, to make debugging easier
        _nativeSrc: function(url) {
            this._debug("[native] setting src to: " + url);
            this._mediaElem.src = url;
        },
        _nativeLoad: function() {
            this._debug("[native] load()");
            this._mediaElem.load();
        },
        _nativeLoadSafe: function() {
            this._debug("[native] load() -- with exception handling");
            try {
                this._mediaElem.load();
            }
            catch (e) {
                this._warn("Got exception when calling native load() -- assuming this is okay and continuing: " + e);
            }
        },
        _nativePlay: function() {
            this._debug("[native] play()");
            this._mediaElem.play();
        },
        _nativePause: function() {
            this._debug("[native] pause()");
            this._mediaElem.pause();
        },
        _nativeSeek: function(position) {
            this._debug("[native] setting currentTime to: " + position + "; previous position: " + this._mediaElem.currentTime);
            this._mediaElem.currentTime = position;
        },

        _debug: function(str) {
            if (this._options.debug)
                this._log("debug", str);
        },
        _info: function(str) {
            this._log("info", str);
        },
        _warn: function(str) {
            this._log("warn", str);
        },
        _error: function(str) {
            this._log("error", str);
        },
        _log: function(level, str) {
            if (typeof Log != "undefined") {
                Log[level]( "HTML5Player-" + this._id + ": " + str );
            }
        }
    };

    var BUFFERING = "BUFFERING";
    var PLAYING = "PLAYING";
    var PAUSED = "PAUSED";
    var IDLE = "IDLE";
    var COMPLETED = "COMPLETED";
        // constants from html5 media interface
    var NETWORK_LOADING = 2;
    var HAVE_FUTURE_DATA = 3;
    var HAVE_ENOUGH_DATA = 4;
    var MAX_STALLS = 20;
    var _useLocationHack = false;

    HTML5Player.supportedFormats = function() {
            var formats = {
            };
             
            function iphoneVersion(uastring) {
                var match = uastring.match(/Version\/([0-9\.]*)/);
                if(!match) return null; //couldn't find version number
                
                return _parseversion(match[1]);
            }

            if(navigator.userAgent.indexOf("iPhone") != -1) {
                var ver = iphoneVersion(navigator.userAgent);
                if(ver && (ver[0] < 4 || (ver[0] == 4 && (ver[1] == 0) && (ver.length == 2 || ver[2] == 0))))
                    return {};
            }
    
            try {
                var media = document.createElement("audio");
                var canplay = media.canPlayType("audio/mpeg");
                formats["mp3-128"] = (canplay == "probably" || canplay == "maybe");
                
                canplay = media.canPlayType('audio/mpeg; codecs="mp4a.40.2"');
                formats["aac-lo"] = (canplay == "probably" || canplay == "maybe");
                
                /* Some browsers (IE mostly) respond to 'audio/mp4' instead, so check that, too */
                if(!formats["aac-lo"]) {
                    canplay = media.canPlayType('audio/mp4; codecs="mp4a.40.2"');
                    formats["aac-lo"] = (canplay == "probably" || canplay == "maybe");
                }

                canplay = media.canPlayType('audio/ogg; codecs="vorbis"');
                formats["vorbis-lo"] = (canplay == "probably" || canplay == "maybe");

                canplay = media.canPlayType('audio/ogg; codecs="opus"');
                formats["opus-lo"] = (canplay == "probably" || canplay == "maybe");
                
                // no version of chrome actually supports opus yet
                if(formats["opus-lo"] && navigator.userAgent.indexOf(" Chrome/") != -1) {
                    formats["opus-lo"] = false;
                }

            } catch(e) {}

            if(!formats) {
                // android < 2.3 lets us play the stream, but not using the HTML5
                // interfaces, so we'll return that it's supported so that the
                // player gets set up, then this implementation will use the location
                // trick on play().
                match = navigator.userAgent.toString().match(/Android ([0-9\.]*)/);
                if(match) {
                    var ver = _parseversion(match[1]);
                    if ((ver[0] < 2) || (ver[0] == 2 && ver[1] < 3)) {
                        _useLocationHack = true;
                        Log.debug("using location <= stream workaround");
                        formats["mp3-128"] = true;
                        // I guess old Android can play AAC, too -- test this assertion before relying on it
                        formats["aac-lo"] = true;
                    }
                }
            }
    
            return formats;
        };
        
    HTML5Player.needLocationHack = function() {
            var match = navigator.userAgent.toString().match(/Android ([0-9\.]*)/);
            if(!match) return false;

            var v = _parseversion(match[1]);

            // need location hack if version less than 2.3
            return (v[0] < 3) || (v[0] == 3 && v[1] < 3)
        };

        function _parseversion(str) {
            var vparts = str.split('.');
            for(var i=0; i<vparts.length; i++) {
                vparts[i] = Number(vparts[i]);
            }
            return vparts;
        }

    return HTML5Player;
}();
;
/* ------------- BEGIN image_utils.js --------------- */;
/* global TemplGlobals, uploadImage */
/* exported ImageUtils */

var ImageUtils = (function () {
    'use strict';

    var FORMAT_EXTENSIONS = {
            "JPEG": "jpg",
            "PNG": "png"
        };
    // This duplicates the url formatting of Image.dynamic_urls(). Keep them in sync!
    function dynamicURL(kind, image_id, format, is_https) {
        if (!image_id) {
            return TemplGlobals.static_siteroot + '/img/blank.gif';
        }

        format = getFormat(format);
        var siteroot = ImageUtils.imageRoot(is_https);
        var ext;
        if (format.file_format) {
            ext = "." + FORMAT_EXTENSIONS[format.file_format];
        }
        else {
            ext = "";
        }
        image_id = ("000000000" + image_id).slice(-10);
        return siteroot + "/img/" + kind + image_id + "_" + format.id + ext;
    }

    function getFormat(format) {
        if (typeof(format) === "object") return format;

        var fmts = TemplGlobals.image_formats;
        if (fmts) {
            for (var i = 0; i < fmts.length; ++i) {
                if (fmts[i].id == format || fmts[i].name == format) {
                    return fmts[i];
                }
            }
        }
        Log.error('bad image format', format);
        return null;
    }

    // This duplicates the computations in Image.dynamic_dimensions().
    function calculateDimensions(width, height, format) {
        format = getFormat(format);
        var format_width, format_height;

        if (!format || format.resize_algo == 'original') {
            format_width  = width;
            format_height = height;
        } else if (format.resize_algo == 'thumb') {
            format_width  = format.width;
            format_height = format.height;
        } else if (format.resize_algo == 'fit') {
            // resize image on one dimension to fit within a maximum size
            // make sure this logic matches the logic that ImageMagick itself applies
            if (width <= format.width && height <= format.height) {
                // maintain original dimensions if image is within max height and width
                format_width = width;
                format_height = height;
            } else {
                // FIXME: do we need to do any rounding here when scaling dimensions? -- leigh 2013-04-16
                if ((width / format.width) > (height / format.height)) {
                    // shrink width to max, shrink height to match
                    format_width  = format.width;
                    format_height = Math.round(height * (format.width / width));
                } else {
                    // shrink height to max, shrink width to match
                    format_width  = Math.round(width * (format.height / height));
                    format_height = format.height;
                }
            }
        } else {
            Log.error('bad image resize algo', format);
            format_width  = width;
            format_height = height;
        }

        return {width: format_width, height: format_height};
    }

    var returnVal = {
        imageURL: function (image_id, format, is_https) {
            return dynamicURL('', image_id, format, is_https);
        },

        artURL: function (art_id, format, is_https) {
            return dynamicURL('a', art_id, format, is_https);
        },

        imageFormat: getFormat,
        imageDimensions: calculateDimensions,

        imageRoot: function (is_https) {
            if ('undefined' === typeof is_https) {
                is_https = window.location.protocol === 'https:';
            }
            return is_https ? TemplGlobals.image_siteroot_https : TemplGlobals.image_siteroot;
        }
    };

    if ('uploadImage' in window) {
        // ImageUtils.uploadImage() is just an alias for the global uploadImage() function for now.
        returnVal.upload = uploadImage;
    }

    return returnVal;
})();
;
/* ------------- BEGIN sound.js --------------- */;
var Sound = {

    // 'whenloaded' -- get a callback when
    // the sound system is loaded, or immediately
    // if it's already done
    //
    // 'callback' is a function that takes
    // an status hash that indicates info
    // about the sound startup result
    //   soundcallback(status) {}
    //      info => {
    //          success: true/false,
    //          subsystem: "flash"|"html5",
    //          has_viz: true/false,
    //          error: brief error code string (only set if success=false)
    //      }

    _callbacks : [],
    _status : null,     // keep a copy of status info
    _loadstarted : false,
    
    whenloaded : function(callback) {
        Sound._showdebug("wl");
        if(!Sound._status) {
            // sound is not loaded yet.  load it.

            Sound._showdebug("init");
            Sound._callbacks.push(callback);
            Sound._load_wrapper();
        } else {
            try {
                callback(Sound._status)
            } catch (e) {
            }
        }
    },

    _docallbacks : function() {
        while(Sound._callbacks.length > 0) {
            Sound._docallback(Sound._callbacks.pop());
        }
    },

    _docallback : function(cb) {
        try {
            cb(Sound._status);
        } catch (e) {
            Log.error("caught error in Sound.whenloaded callback: " + e)
        }
    },
    _showdebug : function(text) {
        var e = document.getElementById("sounddebug");
        if(e) {
            e.innerText = text;
        }
    },
    _load_wrapper : function() {
        Sound._status = {
            success: true,
            subsystem: "wrapper",
            has_viz: "false"
        };
        Sound.SoundPlayer = WrapperSoundPlayer;

        // Log.debug("using Wrapper for sound");

        Sound._docallbacks();
    }

};

var FlashSound = {
    _callbacks : [],
    _loadstarted : false,
    _status : null,
    
    whenloaded : function(callback) {
        FlashSound._showdebug("wl");
        if(!FlashSound._status) {
            // sound is not loaded yet.  load it.

            FlashSound._showdebug("init");
            FlashSound._callbacks.push(callback);

            if(!FlashSound._loadstarted) {
                FlashSound._loadstarted = true;
                FlashProxy.whenclassready("SoundPlayer", FlashSound._flashready, FlashSound._flashfailed);
            }
        } else {
            try {
                callback(FlashSound._status)
            } catch (e) {
            }
        }
    },

    _docallbacks : function() {
        while(FlashSound._callbacks.length > 0) {
            FlashSound._docallback(FlashSound._callbacks.shift());
        }
    },

    _docallback : function(cb) {
        try {
            cb(FlashSound._status);
        } catch (e) {
            Log.error("caught error in FlashSound.whenloaded callback: " + e)
        }
    },

    _flashready : function() {
        Log.debug("flash is ready for sound!");
        FlashSound._status = {
            success : true,
            subsystem : "flash",
        };
        FlashSound._showdebug("flash");
        FlashSound._docallbacks();
    },

    _showdebug : function(text) {
        var e = document.getElementById("sounddebug");
        if(e) {
            e.innerText = text;
        }
    },

    _flashfailed : function() {
        Log.debug("All sound subsystems failed to load.");
        FlashSound._status = {
            success : false,
            error : "noflash"
        };
        FlashSound._docallbacks();
        FlashProxy.noFlashError("player");
    }
};
    
var WrapperSoundPlayer = function() {
    function WrapperSoundPlayer() {
        var self = this;
        self._html5player = null;
        self._flashplayer = null;
        self._html5formats = HTML5Player.supportedFormats();
        self._flashstate = null;
        self._currentplayer = null;
        self._handlers = {
            state : [],
            time : [],
            loaded : [],
            info : [],
            volume : []
        };
        
        /*  on load, check if we support any HTML5 formats. If we do, create a HTML5 player.
            If we don't, we do nothing.
            Later, if we have no HTML5 player, or content that we can't play using HTML5,  we
            can lazily create a Flash player.
        */
        var formatsSupported = [];
        
        for(var format in self._html5formats) {
            if(self._html5formats.hasOwnProperty(format) && self._html5formats[format] == true) {
                formatsSupported.push(format);
            }
        }
        
        if(formatsSupported.length > 0) {
            // Log.debug("WrapperSoundPlayer: using HTML5 for player (where possible)");
            // Log.debug("formats supported " + formatsSupported);
            self._html5player = new HTML5Player();
            self._html5player.ontime(function(target, x) {
                self._fire_event("time", x);
            });
            self._html5player.onstate(function(target, x) {
                self._fire_event("state", x);
            });
            self._html5player.onloaded(function(target, x) {
                self._fire_event("loaded", x);
            });
            self._html5player.oninfo(function(target, x) {
                self._fire_event("info", x);
            });
            self._html5player.onvolume(function(target, x) {
                self._fire_event("volume", x);
            });
            
            self._currentplayer = "html5";
        } 
        
        self._add_event_handler = function(eventname, handler) {
            self._handlers[eventname].push(handler);
        }
        // don't wrap these. instead, keep track of all the event handlers, then call them when the
        // underlying players trigger these events
        self.onstate = function(handler) {
            self._add_event_handler("state", handler);
        }
        self.ontime = function(handler) {
            self._add_event_handler("time", handler);
        }
        self.onloaded = function(handler) {
            //self._cancelReset();
            self._add_event_handler("loaded", handler);
        }
        self.oninfo = function(handler) {
            //fixme: these never actually get fired
            self._add_event_handler("info", handler);
        }
        self.onvolume = function(handler) {
            self._add_event_handler("volume", handler);
        }
        self._fire_event = function(name, arg) {
            //Log.debug("firing " + name + " events");
            handlers = self._handlers[name];
            if(handlers) {
                for(var i=0; i<handlers.length; i++) {
                    try {
                        if(self._currentplayer == "html5") {
                            handlers[i](self._html5player, arg);
                        } else {
                            handlers[i](self._flashplayer, arg);
                        }
                    } catch (e) {
                        Log.debug("caught exception in handler for event \"" + name + "\": " + e);
                    }
                }
            }
        }
        self.createFlashPlayer = function() {
            self._flashstate = "loaded";
            self._flashplayer = new FlashProxy.SoundPlayer();
            self._flashplayer.ontime(function(target, x) {
                self._fire_event("time", x);
            });
            self._flashplayer.onstate(function(target, x) {
                self._fire_event("state", x);
            });
            self._flashplayer.onloaded(function(target, x) {
                self._fire_event("loaded", x);
            });
            self._flashplayer.oninfo(function(target, x) {
                self._fire_event("info", x);
            });
            self._flashplayer.onvolume(function(target, x) {
                self._fire_event("volume", x);
            });
        }
        
        self.load = function(url) {
            var preferredformat = null;
            var preferredurl = null;
            
            if(typeof url === 'string') {
                // assume MP3
                preferredurl = url;
                preferredformat = "mp3-128";
            } else {
                var formats = ["aac-lo", "mp3-128", "opus-lo", "vorbis-lo"];
                for(var i=0; i < formats.length; i++) {
                    if(self._html5formats[formats[i]] && url[formats[i]]) {
                        preferredformat = formats[i];
                        break;
                    }
                }
                
                if(!preferredformat) {
                    // no available HTML5-supported format -- fall back to Flash-supported formats
                    var flashformats = ["aac-lo", "mp3-128"];
                    for(var i=0; i < flashformats.length; i++) {
                        if(url[flashformats[i]]) {
                            preferredformat = flashformats[i];
                            break;
                        }
                    }
                }
                
                /*if(!preferredformat) {
                    // should never get here, but if we do, default to aac-lo
                    preferredformat = "aac-lo";
                }*/
                preferredurl = url[preferredformat];
            }
            
            if(self._html5formats[preferredformat]) {
                // use HTML5 player
                self._currentplayer = "html5";
                self._html5player.load(preferredurl);
            } else {
                // use flash player
                self._currentplayer = "flash";
                if(self._flashplayer) {
                    self._flashplayer.load(preferredurl);
                } else {
                    Log.debug("WrapperSoundPlayer: HTML5 playback doesn't support " + preferredformat + ", loading flash");
                    self._flashstate = "loading";
            
                    FlashSound.whenloaded(function() {
                        self.createFlashPlayer();
                        self._flashplayer.load(preferredurl);
                    });
                }
            }
        }
        
        // returns a proxy method that will call the corresponding method on _soundplayer
        // after an asynchronous call to Sound.whenready results in _soundplayer being created.
        function make_lazy_stub(fname) {
            return function() {
                var args = arguments;
                if(self._currentplayer == "html5") {
                    // Log.debug("html5 proxy method " + fname);
                    self._html5player[fname].apply(self._html5player, args);
                } else {
                    Log.debug("flash1 proxy method " + fname);
                    FlashSound.whenloaded(function() {
                        // Log.debug("flash2 proxy method " + fname);
                        self._flashplayer[fname].apply(self._flashplayer, args);
                    });
                }
            }
        }
        // returns a proxy method that will call the corresponding method on _soundplayer
        function make_simple_proxy(fname) {
            return function() {
                var args = arguments;
                if(self._currentplayer == "html5") {
                    self._html5player[fname].apply(self._html5player, args);
                } else {
                    if(self._flashplayer) {
                        try {
                            self._flashplayer[fname].apply(self._flashplayer, args);
                        } catch(e) {
                            if(!self._loggedException) {
                                self._loggedException = true;
                                Log.error("WrapperSoundPlayer proxy for " + fname + "(): caught exception: " + e);
                            }
                        }
                    } else {
                        Log.error("WrapperSoundPlayer proxy for " + fname + "(): no _soundplayer instance!");
                    }
                }
            }
        }
    
        // the following stubs will lazily cause an async call to Sound.whenloaded.  All other
        // stubs will just proxy straight through to the underlying instance.  This list must
        // be a complete set of all the methods that might be the first method invoked on a
        // SoundPlayer instance.  If one of these isn't invoked first, the others will fail.
        // Note that some methods in SoundPlayer cannot be lazystubs because they return
        // values.
        var lazystubs = ["play", "pause", "stop", "seek"];
        var lazymap = {};
        for(var i=0; i<lazystubs.length; i++) {
            lazymap[lazystubs[i]] = true;
        }

        for(var k in HTML5Player.prototype) {
            if(k == "load") continue;
            if(k == "ontime") continue;
            if(k == "onstate") continue;
            if(k == "onloaded") continue;
            if(k == "oninfo") continue;
            if(k == "onvolume") continue;
            
            if((typeof HTML5Player.prototype[k]) == "function" && k.substr(0,1) != "_") {
                if(lazymap[k]) {
                    self[k] = make_lazy_stub(k);
                } else {
                    self[k] = make_simple_proxy(k);
                }
            }
        }
    }
    return WrapperSoundPlayer;
}();

// LazySound is still used in a couple of places. It can be removed once those are gone
var LazySound = function() {
    function LazySound() {
        var self = this;
        self._soundplayer = null;
        self._loggedException = false; // if we catch an exception, don't keep logging them

        self.whenInstanceReady = function(callback) {
            Sound.whenloaded(function(status) {
                if(status.success) {
                    if(!self._soundplayer) {
                        // Log.info("LazySound creating SoundPlayer instance");
                        self._soundplayer = new Sound.SoundPlayer();
                    }
                    callback(self._soundplayer);
                } else {
                    Log.error("LazySound: Sound.whenloaded failed: ", status);
                }
            });
        }

        // returns a proxy method that will call the corresponding method on _soundplayer
        // after an asynchronous call to Sound.whenready results in _soundplayer being created.
        function make_lazy_stub(fname) {
            return function() {
                var args = arguments;
                self.whenInstanceReady(function(sp) {
                        sp[fname].apply(sp, args);
                    });
            }
        }

        // returns a proxy method that will call the corresponding method on _soundplayer
        function make_simple_proxy(fname) {
            return function() {
                var args = arguments;
                if(self._soundplayer) {
                    try {
                        self._soundplayer[fname].apply(self._soundplayer, args);
                    } catch(e) {
                        if(!self._loggedException) {
                            self._loggedException = true;
                            Log.error("LazySound proxy for " + fname + "(): caught exception: " + e);
                        }
                    }
                } else {
                    Log.error("LazySound proxy for " + fname + "(): no _soundplayer instance!");
                }
            }
        }

        // the following stubs will lazily cause an async call to Sound.whenloaded.  All other
        // stubs will just proxy straight through to the underlying instance.  This list must
        // be a complete set of all the methods that might be the first method invoked on a
        // SoundPlayer instance.  If one of these isn't invoked first, the others will fail.
        // Note that some methods in SoundPlayer cannot be lazystubs because they return
        // values.
        var lazystubs = ["play", "pause", "stop", "load", "onstate", "ontime", "onloaded", "oninfo", "onvolume", "seek"];
        var lazymap = {};
        for(var i=0; i<lazystubs.length; i++) {
            lazymap[lazystubs[i]] = true;
        }

        for(var k in HTML5Player.prototype) {
            if((typeof HTML5Player.prototype[k]) == "function" && k.substr(0,1) != "_") {
                if(lazymap[k]) {
                    self[k] = make_lazy_stub(k);
                } else {
                    self[k] = make_simple_proxy(k);
                }
            }
        }
    }
    return LazySound;
}();
;
/* ------------- BEGIN cookie.js --------------- */;
// Copyright 2008 Bandcamp, Inc. All rights reserved.

var CommUtils = {

    beacon: function( url, args ) {
        return this._loadImage( url, args, true );
    },

    loadImage: function( url ) {
        return this._loadImage( url );
            // TODO: might want to manage these, in an array,
            // sending them out sequentially... not sure it
            // matters for our purposes. We use them it loading
            // up the large versions of package gallery images
            // after page load. -- kj
    },

    _loadImage: function( url, args, randomize, on_finish ) {
        var bcn = document.createElement('img');
        var save_my_bcn = bcn;
            // an alternate reference because on older IEs,
            // our closure can actually fire before we return--
            // and nulling out bcn before the return statement!

        bcn.style.display = "none";
        bcn.onload = bcn.onerror = function() {
                var e;
                // ran into a problem where a script error in here would
                // break all future YUI dialogs (?!?).  Bullet-proofing:
                try {
                    bcn = null; // break closure
                    if ( on_finish ) on_finish(); // call external callback
                } catch ( e ) { }
            };

        if ( randomize && !args.rand )
            args.rand = Math.random().toString().substring( 2 );

        bcn.src = Url.addQueryParams( url, args );

        return save_my_bcn;
    },

    zzz: null
};

var Cookie = {

    // the header in which the cookie will be sent as an alternate
    // to the normal cookie header (so we can force e.g. flash to
    // send it)
    ALT_IDENTITY_PARAM : 'BandcampIdentity',
        
    // Returns the specified cookie values by name, or null if not found.
    // If there are multiple matches, they are returned in an array.
    get: function( cookieName ) {
    
        $assert( Text.notEmpty( cookieName ) );
        
        var cookie = Cookie.getAll()[ cookieName ];
        if ( cookie == null )
            cookie = null; // normalize undef to null
        return cookie;
    },
    
    // Returns all active cookies in a hash object, with the cookie names 
    // as the keys. If more than one cookie was found with the same name 
    // (possible, if the cookies had different paths, domains, or secure settings),
    // then that value will be an array.
    getAll: function() {
        
        function push( name, val ) {
            var existingVal = out[ name ];
            if ( !existingVal )
                out[ name ] = val;
            else if ( U.isArray( existingVal ) )
                existingVal.push( val );
            else
                out[ name ] = [ existingVal, val ];
        }
        
        var pairs = document.cookie.split( /;\s*/ );
        var out = {};
        for ( var i=0; i < pairs.length; i++ ) {
            var pair = pairs[i].split( "=" );
            if ( pair[1] ) {
                var paramName, paramValue;
                try {
                    paramName  = decodeURIComponent( pair[0] );
                    paramValue = decodeURIComponent( pair[1] );
                }
                catch (e) {
                    // malformed URL encoding can cause decodeURIComponent to throw URIErrors;
                    // this shouldn't happen here (we created the cookie, after all), but let's be cautious
                    Log.error("Cookie.getAll: error when decoding URL parameter, skipping; ", e);
                    continue;
                }
                push( paramName, paramValue );
            }
        }
        return out;
    },    
    
    // Sets the named cookie. The only required value is cookieName.
    set: function( cookieName, cookieValue, maxAge, path, domain, secure ) {
        
        $assert( Text.notEmpty( cookieName ) );
        $assert( maxAge == null || U.isNumber( maxAge ) );
        
        if ( cookieValue == null )
            cookieValue = "";
        if ( !path )
            path = "/";
        if ( !domain )
            domain = Cookie._secondLevelDomain();
        var expiresDate;
        if ( maxAge != null ) {
            // FF (and possibly others) support the newer max-age option directly,
            // but IE still wants the older expires syntax.
            expiresDate = new Date( new Date().getTime() + ( maxAge * 1000 ) );
        }
        
        var enc = encodeURIComponent;
        var cookie = enc( cookieName ) + "=" + enc( cookieValue ) +
                        ";path=" + path + 
                        ( domain != null ? ";domain=" + domain : "" ) +
                        ( expiresDate ? ";expires=" + expiresDate.toUTCString() : "" ) +
                        ( secure ? ";secure" : "" );
        document.cookie = cookie;
        return cookie; // for debugging
    },
    
    // Clears the named cookie. Note that the path, domain, and secure
    // settings must match what was used when the cookie was created.
    clear: function( cookieName, path, domain, secure ) {
        
        // the max-age=-1 here is what does the magic
        return Cookie.set( cookieName, "", -1, path, domain, secure );
    },
    
    _secondLevelDomain: function() {
        
        var parts = location.hostname.split( "." );
        var len = parts.length;
        $assert( len >= 1 );
        if ( len == 1 )
            return null; // FF, at least, won't save the cookie if we specify a dotless domain
        return "." + parts[ len - 2 ] + "." + parts[ len - 1 ];
    }
};
var HiddenParams = {};
(function() {
    var cookie = Cookie.get("hiddenParams");
    if (cookie) {
        Cookie.clear("hiddenParams");
        var query = Url.parseQuery(cookie);
        if (query) { HiddenParams = query }
    }
})();
;
/* ------------- BEGIN cookie_comm.js --------------- */;
// This file requires Cookie to be loaded first.


// A cookie-based communication channel used to pass data between two or
// more frames or in-process windows from different origins (protocols, hostnames, 
// and/or ports). This requires that communicating documents be served from the 
// same primary domain. To listen for messages, register a message handler using
// the .subscribe method and call the startListening method. When a message arrives,
// subscribers will be called with the following array parameter:
//    [sendingChannelId, messageName, arg1, arg2...]
// To send a message, call the send method.
// channelName: an identifier for the communication channel. Each participant in
//    the conversation must specify the same name.
// uniquify: if true, the passed-in name will be suffixed with a globally
//    unique ID. You can discover the resulting name with the getName() method.
//    A randomized name is useful if you can pass it to the other instances in
//    the conversation (for example, via a URL), because then the conversation 
//    won't overlap with any other in other windows or tabs.
if( !window.Cookie )
    throw "expected Cookie library";

Cookie.CommChannel = function( channelName, uniquify ) {
    
    $assert( Text.notEmpty( channelName ) );

    this._id = Math.round( Math.random() * 1e9 );
    if ( uniquify )
        channelName += this._id;
    this._channelName = channelName;
    var namePrefix = Cookie.CommChannel.COOKIE_NAME_PREFIX + channelName;
    this._cookieName = namePrefix + "_" + this._id;
    this._namePattern = new RegExp( "^" + Text.regexpEscape( namePrefix ) + "_(\\d+)$" );
    this._queue = { last: 0, msgs: [] }; // serialized and stored in our cookie
    this._lastSeen = {}; // a hash of remote ids mapped to the last seen index for each
    this._scanTimer = null;
    
    Cookie.clear( this._cookieName );
};

Cookie.CommChannel.EVENT_NAME = "cookiecomm_message";
Cookie.CommChannel.COOKIE_NAME_PREFIX = "_comm_";
Cookie.CommChannel.MAX_QUEUE_SIZE = 5; // conservatively small to limit cookie size
Cookie.CommChannel.SCAN_TIMEOUT = 250; // 4 scans per second
Cookie.CommChannel.COOKIE_MAX_AGE = 5; // Give listeners 5 seconds to recv messages

Cookie.CommChannel.prototype = {
        
    getName: function() {
    
        return this._channelName;
    },
        
    // Starts scanning for messages from remote instances.  
    startListening: function() {
        
        if ( !this._scanTimer ) {
            var that = this;
            var timerCallback = function() { that._scanAllQueues() };
            this._scanTimer = setInterval(timerCallback, Cookie.CommChannel.SCAN_TIMEOUT); 
            Log.info('Cookie comm channel ' + this.getName() + ' started listening.');
        }
    },
    
    // Stops scanning for messages
    stopListening: function() {
        
        if ( this._scanTimer ) {
            clearInterval(this._scanTimer);
            this._scanTimer = null;
            Log.info('Cookie comm channel ' + this.getName() + ' stopped listening.');
        }
    },

    subscribe : function(callback) {
        $(document).on(Cookie.CommChannel.EVENT_NAME + "_" + this._id, callback);
    },
    unsubscribe : function(callback) {
        $(document).off(Cookie.CommChannel.EVENT_NAME + "_" + this._id, callback);
    },
    
    // Adds a message to this object's queue and publishes it to all remote listeners.
    // They will a chance to receive the new data the next time they poll.
    // Note that if you call this method many times in a short period, it's 
    // possible that older messages will drop off the queue before they're seen 
    // by remote listeners.
    // msgName: a string identifying the message. Recognized names include
    //    "close" (for closing the dialog) and "height" (for updating the 
    //    dialog height). For custom messages, pick any name you prefer.
    // arg1, arg2...: any additional parameters associated with the message.
    //    This data should be JSON-compatiable.
    send: function( msgName /* arg1, arg2... */ ) {

        $assert( U.isString( msgName ) );
        
        // convert the arguments object to a real array
        // (otherwise, the json serializer doesn't treat it as such)
        var msg = Iter.collect( arguments );
        Log.debug('Cookie comm channel ' + this.getName() + ' sending message ' + msg[0], msg);
        // for cookie compactness, strip off any null/undef values at
        // the end of the message array (they're probably unused optional params)
        for ( var i = msg.length - 1; i > 0; i-- ) {
            if ( msg[i] == null )
                msg.pop();
            else
                break;
        }
        
        var msgs = this._queue.msgs;
        msgs.push( msg );
        this._queue.last++;
        
        if ( msgs.length > Cookie.CommChannel.MAX_QUEUE_SIZE )
            this._queue.msgs = msgs.slice( 1 );
            
        // Write the cookie asynchronously so multiple sends within this tick
        // will be written to the cookie at once.
        if (this._writeTimeout) clearTimeout(this._writeTimeout);
        var self = this;
        this._writeTimeout = setTimeout(function () {
            self._writeQueue();
        }, 0);
    },
    
    // Stops the listening timer, clear data and removes the cookie associated 
    // with this instance.
    cleanup: function() {
        Cookie.clear( this._cookieName );
        this.stopListening();
        this._lastSeen = this._queue = null;
    },
    
    _writeQueue: function() {
        
        //sdg TODO: we run the risk of exceeding the browser's cookie length
        //   limits, depending on how much data is in the queue. We might want
        //   to complain if a message's serialization is too long.
        //sdg TODO: these cookies are intended for client-side only communication,
        //   but like all cookies, they are included in each HTTP request to
        //   the server. We could look into stripping these cookies out of
        //   XHR requests (by setting the Cookie header ourselves, if that works).
        //   There's nothing we can do to prevent them going out with non-XHR
        //   requests.

        var json = JSON.stringify( this._queue );
        Cookie.set( this._cookieName, json, Cookie.CommChannel.COOKIE_MAX_AGE );
    },
    
    // Examines all remote queues for new messages, notifying the listener
    // for each that has something new.
    _scanAllQueues: function() {
    
        var cookies = Cookie.getAll();
        for ( var name in cookies ) {
            var match = this._namePattern.exec( name );
            if ( !match )
                continue;
            var queueId = match[1] - 0;
            if ( queueId === this._id )
                continue; // ignore our own messages
            var json = cookies[ name ];
            $assert( !U.isArray( json ), "we expect only one cookie per name" );
            var queue = eval( "(" + json + ")" );
            this._scanOneQueue( queueId, queue );
        }
    },
    
    _scanOneQueue: function( queueId, queue ) {
        
        var lastIndex = queue.last;
        $assert( U.isNumber( lastIndex ) );
        var lastSeenIndex = this._lastSeen[ queueId ] || 0;
        var newCount = lastIndex - lastSeenIndex;
        if ( newCount > 0 ) {
            var newMsgs = queue.msgs.slice( -newCount );
            $assert( newMsgs.length );
            this._lastSeen[ queueId ] = lastIndex;
            
            // notify subscribers about each message in turn
            for ( var i=0; i < newMsgs.length; i++ ) {
                var msgArr = newMsgs[i];
                Log.debug('Cookie comm channel ' + this.getName() + ' received from ' + queueId + ' message ' + msgArr[0], msgArr);
                msgArr.unshift( queueId ); // add the sender ID as the first entry
                $.event.trigger( Cookie.CommChannel.EVENT_NAME + "_" + this._id, [msgArr] );
                if ( !this._scanTimer )
                    break; // a subscriber called cleanup while handling the event
            }
        }
    }
};

;
/* ------------- BEGIN stats.js --------------- */;
/* global CommUtils */

var Stats = (function () {
    "use strict";
    return {
        RECORD_URL : "/stat_record",
        
        record : function(args) {      
            try {
                CommUtils.beacon( Stats.RECORD_URL, args );
            } catch (e) {
            }
        },

        _recorded_clicks : {},
        record_click_once : function(click) {
            if (!Stats._recorded_clicks[click]) {
                Stats._recorded_clicks[click] = true;
                Stats.record({kind: "click", click: click});
            }
        },

        share_menu_click : function(variant) {
            // variant must correspond to a sym constant in StatClick
            if (variant == 'wordpress')
                variant = 'wordpress.com';
            Stats.record({kind: "share menu", click: variant});
        }
    };
})();

    //utility for sending multi-phase stats that are correlated
    //by a reference number.  The reference number is generated
    //by the constructor and the stat for the initial phase is
    //sent, and each time you call change_phase(phase) after that,
    //the new phase and all the params are sent.
    //
    // add_params(p) takes a new param blob and merges it with
    //               the existing params
    // done()        is an alias for change_phase("complete")
    // error(info)   adds the "info" field to the params and changes
    //               the phase to "error"
    //
Stats.PhasedStat = function() {
    "use strict";
    function PhasedStat(params, phase) {
            this._params = params;
            this._params.phase = phase;
            this._params.reference_num = Math.round(Math.random()*1e9);
            
            Stats.record(this._params);
        }
    PhasedStat.prototype = {
            change_phase : function(phase) {
                this._params.phase = phase;
                Stats.record(this._params);
            },
            done : function() {
                //everyone's got a "complete" phase these days
                this.change_phase("complete");
            },
            error : function(info) {
                this._params.info = info;
                this.change_phase("error");
            },
            add_params : function(params) {
                this._params = this.merge(this._params, params);
            },
            merge : function(a, b) {
                var result = {}, i;
                for(i in a) { result[i] = a[i]; }
                for(i in b) { result[i] = b[i]; }
                return result;
            }
        };

    return PhasedStat;
}();
;
/* ------------- BEGIN playlist.js --------------- */;
var Player = {};

//fixme: factor out Cookie stuff

// the playlist class holds a list of trackinfo objects
// which contain metadata about the tracks, including keeping
// track of the playstate.  It is used by the various player
// 'view' classes to control a common playlist for the page

Player.TrackInfo = function(){
    function TrackInfo(hash) {
        this.update(hash);
    }
    TrackInfo.prototype = {
        update : function(hash) {
            var props = PROPS;
            for (var i=0; i<props.length; i++) {
                this[props[i]] = hash[props[i]];
            }
            return this;
        },
        is_playable : function() {
            return !!this.file;
        },
        is_busy : function() {
            return this.encoding_pending && !this.encoding_error;
        },
        mark_as_capped : function() {
            this['is_capped'] = true;
        },
        copy : function() {
            var result = {};
            var props = PROPS;
            for (var i=0; i<props.length; i++) {
                result[props[i]] = this[props[i]];
            }
            return result;
        }
    };
    TrackInfo.is_same = function(trackinfo_a, trackinfo_b) {
        var props = PROPS;
        for (var i=0; i<props.length; i++) {
            if (trackinfo_a[props[i]] != trackinfo_b[props[i]]) {
                return false;
            }
        }
        return true;
    };
    var PROPS = [   
        "tracknum", 
        "file", 
        "encoding_error", 
        "encoding_pending", 
        "title", 
        "title_link", 
        "id", 
        "has_lyrics", 
        "has_info", 
        "is_downloadable", 
        "free_album_download", 
        "has_free_download", 
        "download_tooltip", 
        "duration",  
        "private", 
        "album_private", 
        "artist", 
        "album_preorder", 
        "unreleased_track", 
        "alt_link", 
        "continuous",
        "video_source_type", 
        "video_caption",
        "video_id", 
        "video_mobile_url",
        "is_capped"
    ];

    return TrackInfo;
}();
 
Player.Playlist = function() {
    /*
        options is a hash supporting the following options so far:
            .no_trackstate -> suppress tracking playstate in a cookie
                              to continue play across navigation
            .savepos       -> when PlaylistCoordinator automatically
                              stops this player, use pause() instead of stop() so
                              the position is not lost
    */
    function Playlist(player, playing_from, referer, options) {
        options = options || {};
        this._options = options;
        this._player = player;
        this._playlist = [];
        this._playing_from = playing_from;
        this._referer = referer;
        this._track = 0;
        this._loadedtrack = -1;
        this._loadpercent = 0;
        this._duration = null;
        this._state = "IDLE";
        this._unloaded = true;
        this._scrubbed = false;
        this._trackstate = !(options.no_trackstate); //controls whether or not state is saved/loaded in cookie
        this._trackchanged = EventSender.create(this, "trackchanged");
        this._trackplayed = EventSender.create(this, "trackplayed");
        this._trackcapped = EventSender.create(this, "trackcapped");
        this._scrubbedback = EventSender.create(this, "scrubbedback");
        this._completedplay = EventSender.create(this, "completedplay");
        this._playlistchanged = EventSender.create(this, "playlistchanged");
        this._statechanged = EventSender.create(this, "statechanged");
        this._loaded = EventSender.create(this, "loaded");
        this._timechanged = EventSender.create(this, "time");
        this.first_playable_track = -1;     // first and last *playable*
        this.last_playable_track = -1;      // tracks, since some have no audio.
        this._ui_listeners = new Object();  // whoever instantiates the playlist may want to listen for certain events.

        this._usecomm = true;

        var that = this;
        this._player.onstate(function(target, arg) {
            if (that._unloaded) return;
            // note: use that._state here for oldstate because we may have ignored
            // some player state changes due to being 'unloaded', so arg.oldstate
            // may not actually reflect the state we have reported to our listeners
            that._handle_state({ oldstate: that._state, newstate: arg.newstate });
        });
        this._player.ontime(function(target, arg) {
            if (that._unloaded) return;
            that._handle_time(arg);
        });
        this._player.onloaded(function(target, arg) {
            if (that._unloaded) return;
            that._handle_load(arg);
        });

        // automatically add all playlists to a global PlaylistCoordinator owned by
        // the Playlist class
        if (!Playlist.coordinator) {
            Playlist.coordinator = new Player.PlaylistCoordinator();
        }
        Playlist.coordinator.add(this);
    }

    Playlist.prototype = {
        getoption : function(key) {
            return this._options[key];
        },
        add_track : function(trackinfo) {
            var trackinfo = new Player.TrackInfo(trackinfo);
            var result = this._playlist.push(trackinfo) - 1;
            this._playlist[result].tracknum = result;
            if (trackinfo.is_playable()) {
                if (this.first_playable_track == -1) {
                    this.first_playable_track = result;
                    this._track = result;
                }
                this.last_playable_track = result;
            }

            this._playlistchanged();
            return result;
        },
        set_initial_track : function(i) {
            if (this._playlist[i] && this._playlist[i].is_playable()) {
                this._track = i;
            }
        },
        update_trackinfo : function(i, trackinfo) {
            trackinfo.tracknum = i;
            trackinfo = this._playlist[i].update(trackinfo);
            // force a reload-- might in fact be a completely different track
            this._loadedtrack = -1;
            
            // the first/last playable indices in the
            // playlist may have changed.  update them.
            if (trackinfo.is_playable()) {
                if (this.first_playable_track == -1 || i < this.first_playable_track) {
                    this.first_playable_track = i;
                }
                if(this.last_playable_track == -1 || i > this.last_playable_track) {
                    this.last_playable_track = i;
                }
            } else {
                if (i == this.first_playable_track) {
                    this.first_playable_track = -1;
                    for (var j = i+1; j<this._playlist.length; j++) {
                        if (this._playlist[j].is_playable()) {
                            this.first_playable_track = j;
                            break;
                        }
                    }
                }
                if (i == this.last_playable_track) {
                    this.last_playable_track = -1;
                    for (var j = i-1; j>=0; j--) {
                        if (this._playlist[j].is_playable()) {
                            this.last_playable_track = j;
                            break;
                        }
                    }
                }
            }

            this._playlistchanged();

            if (this._state == "BUSY" && trackinfo.is_playable()) {
                this.play();
            }
        },
        playpause : function() {
            var result = null;
            switch (this._state) {
                case "IDLE":
                case "COMPLETED":
                case "PAUSED":
                    this.play();
                    result = 1;
                    break;
                case "PLAYING":
                case "BUFFERING":
                    this._player.pause();
                    this._comm_stop();
                    result = -1;
                    break;
                case "BUSY":
                    this._player.stop();
                    this._comm_stop();
                    this._handle_state({ newstate: "IDLE", oldstate: this._state });
                    result = 0;
                    break;
            }
            return result;
        },

        play : function() {
            var tinfo = this._playlist[this._track];
            if (tinfo && tinfo.is_capped) {
                this._reset();
                this._trackcapped(tinfo.id);
                return;
            }

            switch (this._state) {
                case "IDLE":
                case "COMPLETED":
                case "BUSY":
                    Log.debug("playlist loading track " + this._track);

                    if (!tinfo) break; // happens with empty album

                    while (!tinfo.is_playable() && this._track < this.last_playable_track) {
                        this._track++;
                        tinfo = this._playlist[this._track];
                    }

                    //if this track is not playable and it
                    //is the only track and it is currently
                    //processing, go do the "BUSY" state
                    if (!tinfo.is_playable() && this._playlist.length == 1 && tinfo.encoding_pending) {
                        this._handle_state({ newstate: "BUSY", oldstate: this._state });
                    } else if (this._playlist[this._track].file) {
                        this._load();
                        this._player.play();
                        if (this._usecomm) {
                            try {
                                this._comm_start();
                                this._stop_other_players();
                            } catch (e) { }
                        }
                    }
                    break;
                case "PAUSED":
                case "BUFFERING":
                    this._player.play();
                    if (this._usecomm) {
                        try {
                            this._comm_start();
                            this._stop_other_players();
                        } catch (e) { }
                    }
                    break;
            }
            
            var idx = this._track;
            this._trackplayed(idx);
        },
        pause : function() {
            switch (this._state) {
                case "PLAYING":
                case "BUFFERING":
                    this._player.pause();
                    this._comm_stop();
                    break;
                case "BUSY":
                    this._player.stop();
                    this._comm_stop();
                    this._handle_state({ newstate: "IDLE", oldstate: this._state });
                    break;
            }
        },
        stop : function() {
            this._player.stop();
            this._handle_state({ newstate: "IDLE", oldstate: this._state });
        },
        seek : function(pos) {
            this._unloaded = false;

            var tinfo = this._playlist[this._track];
            if (tinfo && tinfo.is_capped) {
                this._reset();
                this._trackcapped(tinfo.id);
                return;
            }

            if (pos <= 2 && this._playstat == null) {
                var tinfo = this._playlist[this._track];
                if (tinfo && tinfo.is_capped) {
                    this._reset();
                    this._trackcapped(tinfo.id);
                    return;
                } else if (tinfo) {
                    this._scrubbedback(tinfo.id);
                }
                this._scrubbed = true;
            }

            this._player.seek(pos);
        },
        play_track : function(num, pos) {
            var tinfo = this.get_track_info(num);
            if (tinfo && tinfo.is_capped) {
                this._reset();
                this._trackcapped(tinfo.id);
                return;
            }

            if (this._loadedtrack != num) {
                this._state = "IDLE";
                this._player.stop();
                this._track = num;
                this._load();
            }
            this._unloaded = false;
            if (pos != null) {
                this.seek(pos)
            } else {
                this.play();
            }
        },
        percent_loaded : function() {
            return this._loadpercent || 0;
        },
        position : function() {
            return this._position;
        },
        duration : function() {
            if (this._duration != null) {    
                // prefer _duration because it comes back from sound as actual
                // duration of stream
                return this._duration;
            } else {
                // fall back to current track's stated duration if stream not actually
                // loaded yet
                var current_track = this.get_track_info();
                if (current_track) {
                    return current_track.duration;
                }
                return 0;
            }
        },

        // called to indicate the initialization is done
        // and all the tracks have been loaded
        init_complete : function() {
            if (this._trackstate && this._loadstate()) {
                // done
            } else {
                // otherwise, navigate to the first playable track; this makes views
                // that show track names more sensible in their initial, non-playing state
                // (i.e. don't show title of track 0 if we'll just be skipping it on Play).
                if(this._track > 0) {
                    this._trackchanged(this._playlist[this._track]);
                }
            }
        },
        
        register_listener : function(event_name, listener) {  
            var evlisteners = this._ui_listeners[event_name];
            if (evlisteners) {
                $assert($.isArray(evlisteners), "expected array of event listeners");
                evlisteners.push( listener );
            } else {
                evlisteners = new Array();
                evlisteners.push( listener );
                this._ui_listeners[event_name] = evlisteners;
            }  
        },
        player : function() {
            return this._player;
        },
        unload : function() {
            this.stop();
            this._unloaded = true;
            this._playlist = [];
            this._track = 0;
            this._loadedtrack = -1;
            this._loadpercent = 0;
            this._position = 0;
            this.first_playable_track = -1;
            this.last_playable_track = -1;
            this._playlistchanged();
            this._handle_state({ newstate: "IDLE", oldstate: this._state });
        },
        load : function(tracks) {
            this.unload();
            for (var i=0; i<tracks.length; i++) {
                this.add_track(tracks[i]);
            }
        },
        _reset : function() {
            this.stop();
            this._track = this.first_playable_track;
            this._trackchanged(this._playlist[this._track]);
            this._loadedtrack = -1;
        },
        _handle_state : function(arg) {
            if (this._state == arg.newstate) return;

            if (!(arg.newstate == "PLAYING" || arg.newstate == "BUFFERING")) {
                if(arg.newstate != "PAUSED") {
                    this._position = 0;
                }
                this._clearstate();
            }

            this._state = arg.newstate;
            if (arg.newstate == "COMPLETED" && (arg.oldstate == "PLAYING" || arg.oldstate == "BUFFERING" || arg.oldstate == "PAUSED")) {
                // special case where the playlist needs to be
                // aware of the UI: if the user is actively
                // seeking in a playing track, we don't want to do
                // anything when we get to the end, because when
                // he lets go of the thumb we will seek and want
                // to stay in the playing state.
                if (!this.seeking) {
                    if (this._track + 1 <= this.last_playable_track) {
                        this._state = "IDLE";
                        this._player.stop();
                        var current_track = this.get_track_info();
                        if (current_track && current_track.continuous == false) {                          
                            // leave this._track intact and fire off the state/track changed
                            this._statechanged(arg);
                        } else {
                            this.next_track();
                        }
                    } else {
                        // the last playable track has completed playback;
                        // reset to the first playable track so that subsequent
                        // plays function normally
                        this._track = 0;
                        this._loadedtrack = -1;
                        this._statechanged(arg);
                        this._trackchanged(this._playlist[this.first_playable_track]);
                    }
                }
            } else {
                this._statechanged(arg);
            }
        },
        _handle_load : function(arg) {
            if (arg.total == 0) {
                this._loadpercent = 0;
            } else {
                this._loadpercent = 100 * arg.loaded / arg.total;
            }

            this._loaded(this._loadpercent);
        },
        _handle_time : function(arg) {
            if (this._trackstate) {
                this._savestate(arg.position);
            }

            this._position = arg.position;
            this._duration = arg.duration;
            this._timechanged(arg);
            var trackinfo = this._playlist[this._track];
            
            if (this._playstat && arg.duration > 0) {
                if (!this._playstat.play_progress(arg.position, arg.duration)) {
                    this._playstat = null;
                    if (trackinfo && trackinfo != 'undefined') {
                        this._completedplay(trackinfo.id);
                    }
                }
            }

            var is_complete = Player.PlayStat.is_complete(arg.position, arg.duration);
            if (is_complete && this._scrubbed) {
                this._scrubbed = false;
                if (trackinfo && trackinfo != 'undefined') {
                    this._completedplay(trackinfo.id, true);
                }
            }
        },
        prev_track : function() {
            var idx = this._track;
            do {
                idx--;
            } while (idx >= 0 && !this._playlist[idx].file);

            if (idx == -1) {
                idx = 0;
            }

            this._track = idx;
            if (this._isplaying()) {
                this._state = "IDLE";
                this._player.stop();
            }

            this.play();
        },
        next_track : function() {
            var idx = this._track;
            do {
                idx++;
            } while (idx < this._playlist.length && !this._playlist[idx].file);

            if (idx == this._playlist.length) {
                idx = 0;
            }

            this._track = idx;
            if (this._isplaying()) {
                this._state = "IDLE";
                this._player.stop();
            }
            this.play();
        },
        get_state : function() { return this._state; },
        get_track : function() { return this._track; },

        // return a *copy* of the trackinfo hash for the specified
        // track (or the current track if none specified).
        get_track_info : function(index) {
            if (this._playlist.length == 0) return null;

            if (typeof index != "undefined") {
                return this._playlist[index].copy();
            }
            return this._playlist[this._track].copy();
        },

        cap_playback_for_track : function(track_id) {
            for (var i=0; this._playlist && i < this._playlist.length; i++) {
                var ti = this._playlist[i];
                if (ti.id == track_id) {
                    ti.mark_as_capped();
                    break;                  // what if this track_id is in this playlist multiple times?
                }
            }
        },

        length : function() { return this._playlist.length; },

        _notify_listeners : function( notification, idx ){

            var listeners = this._ui_listeners[notification];
            //this is a method that the client can add a listener for.
            if (listeners) {
                for (var i=listeners.length-1; i >= 0; i--){
                   listeners[i](idx);
                }
            } 
        },

        _load : function() {
            if (this._loadedtrack == this._track) { 
                this.seek(0);
                return;
            }

            this._loadedtrack = this._track;
            this._unloaded = false;
            this._player.load(this._playlist[this._track].file);
            this._loadpercent = 0;
            var trackinfo = this._playlist[this._track];
            this._trackchanged(trackinfo);
            this._playstat = new Player.PlayStat(trackinfo, this._playing_from, this._referer);
            this._scrubbed = false;
        },
        _isplaying : function() {
            return this._state == "PLAYING" || this._state == "PAUSED" || this._state == "BUFFERING";
        },

        _managestate: (Browser.platform != "iphone"),
        
        // check to see if there is a saved playerstate cookie
        // and if so, whether the track that was last playing
        // is in our playlist.  If so, load it up at the correct
        // time index and play.
        _loadstate : function () {
            if (!this._managestate) return false;
            Log.debug("reading/clearing playlist state");
            var used_saved_state = false;

            try {
                var state = Cookie.get(COOKIE_NAME);
                Cookie.clear(COOKIE_NAME);
                if (state = JSON.parse(state)) {
                    for (var i=0; i<this._playlist.length; i++) {
                        if (this._playlist[i].id == state.track_id) {
                            Log.debug("found player state, playing track " + i + " at pos " + state.pos);
                            this.play_track(i, state.pos);
                            used_saved_state = true;
                            break;
                        }
                    }
                }
            } catch (e) {}

            return used_saved_state;
        },
        _clearstate : function() {
            if (!this._managestate) return;
            try {
                Cookie.clear(COOKIE_NAME);
            } catch (e) {}
        },

        // if necessary, save the player state in a cookie in case
        // we switch pages and need to continue playing
        _savestate : function(pos) {
            if (!this._managestate || (this._state != "PLAYING" && this._state != "BUFFERING")) {
                return;
            }

            //cookie lifetime in seconds.  only needs to
            //live long enough to get us to the next page
            var track_id = this._playlist[this._track].id;

            // if the position has moved past the latency
            // threshold or if the track has changed, save
            // the state
            if (Math.abs(this._saved_pos - pos) > SAVE_LATENCY || track_id != this._saved_track_id) {
                this._saved_track_id = track_id;
                this._saved_pos = pos;

                var params = { track_id : track_id, pos : pos };
                try {
                    var value = JSON.stringify(params);
                    Cookie.set(COOKIE_NAME, value, COOKIE_LIFE);
                } catch(e) {}
            }
        },

        _comm_start : function() {
            if (!this._comm) {
                this._comm = new Cookie.CommChannel("playlist");
                this._comm.subscribe($.proxy(this._comm_recv, this));
            }
            this._comm.startListening();
        },

        _comm_stop : function() {
            if (this._comm) {
                this._comm.stopListening();
            }
        },

        _comm_recv : function(event, args) {
            switch (args[1]) {
                case "stop":
                    Log.debug("received cookie comm stop command.  stopping.");
                    this.stop();
                    break;
            }
        },

        _stop_other_players : function() {
            this._comm.send("stop");
        }
    };

    Playlist.timestr = function(sec) {
        var str = "";

        //match the behavior of the server: truncate fractions away.
        sec = Math.floor(sec);
        while (sec > 0) {
            var part = (sec % 60)
            var partstr = part.toString();
            if (partstr.length < 2) partstr = "0" + partstr;
            if (str.length > 0) {
                str = partstr + ":" + str;
            } else {
                str = partstr;
            }

            sec -= part;
            sec /= 60;
        }
        if(str.length == 0) {
            str = "00:00";
        } else if(str.length < 3) {
            str = "00:" + str;
        }

        return str;
    };

    var COOKIE_NAME = "playlist_state";
    var COOKIE_LIFE = 30; // in seconds. needs to last long enough for a page switch
    var SAVE_LATENCY = 1;  // in seconds.  how often we write the playstate
    var PLAY_TRACK = "play_track";

    Playlist.PLAY_TRACK = PLAY_TRACK;

    return Playlist;
}();

// PlaylistCoordinator's sole purpose is to make sure multiple playlists that live on
// a page are aware of each other and don't play at the same time.  It is assumed that
// starting playback happens due to some other event, and any time any playlist starts
// playback, all other playlists controlled by PlaylistCoordinator have their "stop"
// methods invoked.  PlaylistCoordinator's only public method is "add", which takes
// a Playlist as an argument.
Player.PlaylistCoordinator = function() {
    function constructor() {
        this._playlists = [];
        this._playingcount = 0;
        this._playing = EventSender.create(this, "playing");
        this._stopped = EventSender.create(this, "stopped");
    }
    constructor.prototype.add = function(pl) {
        var self = this;
        // if this playlist's state changes, call our _handle_playlist_statechange,
        // which may or may not fire our 'playing' event
        pl.onstatechanged(function(arg) {
            self._handle_playlist_statechanged(pl, arg);
        });

        // subscribe to the 'playing' event on this playlists' behalf, invoking
        // playlist.stop() if it's a different playlist playing
        this.onplaying(function(playingplaylist) {
            if (pl != playingplaylist) {
                // if the playlist has the 'savepos' option, use pause() instead of stop()
                if (pl.getoption("savepos")) {
                    pl.pause();
                } else {
                    pl.stop();
                }
            }
        });
    };
    constructor.prototype._handle_playlist_statechanged = function(playlist, arg) {
        var isplaying = arg.newstate == "PLAYING" || arg.newstate == "BUFFERING";
        var wasplaying = arg.oldstate == "PLAYING" || arg.oldstate == "BUFFERING";

        // track the number of playlists playing and issue a "stopped"
        // event when transitioning from n>0 to n==0.  Even though the whole
        // point of the playlist coordinator is to ensure only one playlist
        // is playing at once, this is done as a refcount because an individual
        // stop() is done in response to another play(), which means that while
        // looping through the listeners, multiple players are technically playing.
        // This allows us to not care about the ordering and just issue a "stopped"
        // event when it stabilizes at 0.

        if (isplaying && !wasplaying) {
            this._playingcount++;
        } else if (wasplaying && !isplaying) {
            this._playingcount--;
            if (this._playingcount == 0) {
                this._stopped();
            }
        }

        if (isplaying) {
            this._playing(playlist);
        }
    };

    return constructor;
}();

// PlayStat is reimplemented as bandcamp.stats.PlayStat in
// flash and these two implementations should always match
//
// ick! eek! ^^
Player.PlayStat = function() {

    function PlayStat(trackinfo, playing_from, referer) {
        params = { 
            kind : "track play",
            track_id : trackinfo.id,
            from : playing_from,
            from_url : referer || location.toString()
        };
        _super.call(this, params, "started");
    }

    // inherit methods and _super from PhasedStat
    var _super = Stats.PhasedStat;
    for (var k in Stats.PhasedStat.prototype) { PlayStat.prototype[k] = Stats.PhasedStat.prototype[k]; }

    PlayStat.prototype.play_progress = function(secs_played, secs_total) {
        // returns a boolean indicating if this needs to
        // be called any more.  (returns false once "complete" is sent)
        var partial = PlayStat.is_partial(secs_played, secs_total);
        var complete = PlayStat.is_complete(secs_played, secs_total);

        if (!this._partial_sent && partial) {
            // Log.info("partial play!");
            this._partial_sent = true;
            this.change_phase("partial");
        }
        if (!this._complete_sent && complete) {
            // Log.info("complete play!");
            this._complete_sent = true;
            this.change_phase("complete");
            return false;
        }

        return true;
    };

    // SKIP_WINDOW and COMPLETE_WINDOW define the starting
    // and ending windows for purposes of determining whether
    // a play is a "skip", a "partial", or a "complete" play.
    // They are expressed in percentage of total track length;
    PlayStat.is_partial = function(secs_played, secs_total) {
        var SKIP_WINDOW = 10;
        var is_it = false;
        if (secs_played && secs_total) {
            partial = secs_total * SKIP_WINDOW / 100;
            is_it = secs_played > partial;
        }
        return is_it;
    };

    PlayStat.is_complete = function(secs_played, secs_total) {
        var COMPLETE_WINDOW = 10;
        var is_it = false;
        if (secs_played && secs_total) {
            complete = secs_total * (100 - COMPLETE_WINDOW) / 100;
            is_it = secs_played > complete;
        }
        return is_it;
    };

    return PlayStat;
}();

;
/* ------------- BEGIN color.js --------------- */;
// Color utilities adapted from farbtastic's private functions.

var Color = {
    isDark: function (hexcolor) {
        var rgb = this.hex2rgb(hexcolor);
        return this.rgb2hsl(rgb)[2] < 0.5;
    },
    
    rgb2hex: function (rgb) {
      var r = Math.round(rgb[0] * 255);
      var g = Math.round(rgb[1] * 255);
      var b = Math.round(rgb[2] * 255);
      return (r < 16 ? '0' : '') + r.toString(16) +
             (g < 16 ? '0' : '') + g.toString(16) +
             (b < 16 ? '0' : '') + b.toString(16);
    },
  
    hex2rgb: function (color) {
      color = color.replace(/^#/, '');
      if (color.length == 6) {
        return [parseInt('0x' + color.substring(0, 2)) / 255,
          parseInt('0x' + color.substring(2, 4)) / 255,
          parseInt('0x' + color.substring(4, 6)) / 255];
      }
      else if (color.length == 3) {
        return [parseInt('0x' + color.substring(0, 1)) / 15,
          parseInt('0x' + color.substring(1, 2)) / 15,
          parseInt('0x' + color.substring(2, 3)) / 15];
      }
    },
  
    hsl2rgb: function (hsl) {
      var m1, m2, r, g, b;
      var h = hsl[0], s = hsl[1], l = hsl[2];
      m2 = (l <= 0.5) ? l * (s + 1) : l + s - l*s;
      m1 = l * 2 - m2;
      var hueToRGB = function (m1, m2, h) {
          h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
          if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
          if (h * 2 < 1) return m2;
          if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
          return m1;
      };
      return [hueToRGB(m1, m2, h+0.33333),
              hueToRGB(m1, m2, h),
              hueToRGB(m1, m2, h-0.33333)];
    },
  
    rgb2hsl: function (rgb) {
      var min, max, delta, h, s, l;
      var r = rgb[0], g = rgb[1], b = rgb[2];
      min = Math.min(r, Math.min(g, b));
      max = Math.max(r, Math.max(g, b));
      delta = max - min;
      l = (min + max) / 2;
      s = 0;
      if (l > 0 && l < 1) {
        s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
      }
      h = 0;
      if (delta > 0) {
        if (max == r && max != g) h += (g - b) / delta;
        if (max == g && max != b) h += (2 + (b - r) / delta);
        if (max == b && max != r) h += (4 + (r - g) / delta);
        h /= 6;
      }
      return [h, s, l];
    }
};
;
/* ------------- BEGIN share.js --------------- */;
// EmbedCode:
// manage options for an embed code and handle the details of
// generating the hash to be passed to the embed code template
//
// given that we no longer do 1) direct SWF embeds, or 2) myspace variants, this EmbedCode
// business is way more complicated than it needs to be.  My next pass on this code is going
// to be to cut it down to a simple args hash.

var EmbedCode = LangUtils.makeclass({
    ctor : function(embeddata) {
        this._size = "venti";
        this._isdemo = false;
        this._scriptAccess = "never";
        this._embedData = embeddata;
        this._customLayout = null;
        this._customWidth = null;
        this._customHeight = null;
        this._variant = "other";
        this._vis = null;
    },
    prototype : {
        colors : {
            bgcolor : "#FFFFFF",
            linkcolor : "#0687f5"
        },
        getParams : function() {
            if(!this._embedData) {
                throw "you must set embed_info before you can get the embed code hash";
            }

            var result = {
                variant: this._variant,
                url : this._embedData.swf_base_url + "/EmbeddedPlayer",
                urlbase : this._embedData.swf_base_url,
                params : [
                    { name : "quality", value : "high" },
                    { name : "allowNetworking", value : "always" },
                    { name : "wmode", value : "transparent" }
                ],
                url_args : [
                ]
            };

            if(this._forceflash) {
                result.url += ".swf";
            }

            var scriptaccess = "never";
            var isAlbum = this._embedData.tralbum_param.name == "album";

            result.url_args.push(this._embedData.tralbum_param);
            var embed_data_params = [
                "tralbum_param", "art_id", "linkback", "title", "artist", "album_title"
            ];
            for(var i=0; i<embed_data_params.length; i++) {
                result[embed_data_params[i]] = this._embedData[embed_data_params[i]];
            }

            if(this._customLayout) {
                var layouturl = EmbedCode.encodeLayoutURL(this._customLayout);
                EmbedCode.pushParam(result, "url_args", "layout", layouturl);
                result.layout = layouturl;
                result.width = this._customWidth;
                result.height = this._customHeight;
            } else {
                if(this._customWidth && this._customHeight) {
                    result.width = this._customWidth;
                    result.height = this._customHeight;
                    result.include_dimensions = true;
                } else {
                    var dims = EmbedCode.getDims(this._size, isAlbum, this._variant);
                    if(!dims) {
                        throw "failed to find layout: " + this._size + '/' + this._variant;
                    }
                    result.width = dims.w;
                    result.height = dims.h;
                }

                result.size = this._size;
                EmbedCode.pushParam(result, "url_args", "size", this._size);
            }

            // the colors are used in various forms for different
            // portions of the embed(s).  Some places want it in
            // #-prefixed form, some want it without, and some want
            // it as a CSS rgb(x,y,z) value, so provide it all those
            // ways here rather than force the liquid to do the string
            // manipulation
                
            var bgcolor = this.colors.bgcolor.replace(/^#/, "");
            var linkcolor = this.colors.linkcolor.replace(/^#/, "");
            result.bgcolor = bgcolor;
            result.bgcolor_css = EmbedCode._hex_to_rgb(bgcolor);
            EmbedCode.pushParam(result, "params", "bgcolor", "#" + bgcolor);
            EmbedCode.pushParam(result, "url_args", "bgcol", bgcolor);

            result.linkcolor = linkcolor;
            result.linkcolor_css = EmbedCode._hex_to_rgb(linkcolor);
            EmbedCode.pushParam(result, "url_args", "linkcol", linkcolor);


            if(this._isDemo) {
                if(this._variant == "wordpress") {
                    result.variant = "other"
                }
                result.classname = "bcembed" + Math.round(Math.random()*10000);
                result.doproxy = true;
                scriptaccess = "always";

                // add "debug" flag to cause cache-busting of layouts
                EmbedCode.pushParam(result, "url_args", "debug", "true");
            }

            if(this._vis) {
                EmbedCode.pushParam(result, "url_args", "vis", this._vis);
            }

            if(this._transparent) {
                EmbedCode.pushParam(result, "url_args", "transparent", "true");
            }

            if(this._size == "biggie") {
                if(this._notracklist) {
                    result.notracklist = "true";
                    EmbedCode.pushParam(result, "url_args", "notracklist", "true");
                }
    
                if(this._packageid) {
                    result.package = this._packageid;
                    EmbedCode.pushParam(result, "url_args", "package", this._packageid);
                }
            }

            EmbedCode.pushParam(result, "params", "allowScriptAccess", scriptaccess);

            return result;
        },
        getEmbed : function(isDemo) {
            // as a convenience, allow isDemo to be
            // specified on getEmbed, since it is flipped
            // back and forth so frequently.  this is
            // implemented by saving and restoring the old value
            var oldDemoValue = this._isDemo;
            this._isDemo = isDemo;

            try
            {
                var params = this.getParams();
                var result = Templ.render('_embedded_player', params);
            } catch(e) {
                throw e;
            } finally {
                this._isDemo = oldDemoValue;
            }

            return result;
        },
        setEmbedData : function(ed) {
            this._embedData = ed;
        },
        setSize : function(s) {
            //validate size?
            this._customHeight = null;
            this._customWidth = null;
            this._customLayout = null;

            this._size = s;

        },
        getSize : function() {
            return this._size;
        },
        setVariant : function(v) {
            this._variant = v;
        },
        getVariant : function() {
            return this._variant;
        },
        setDims : function(w, h) {
            this._customHeight = h;
            this._customWidth = w;
        },
        getDims : function() {
            var result = { width: this._customWidth, height: this._customHeight };
    
            if(!(result.width && result.height)) {
                var isAlbum = this._embedData.tralbum_param.name == "album";
                var dims = EmbedCode.getDims(this._size, isAlbum, this._variant);
                if(!dims) {
                    throw "failed to find layout: " + this._size + '/' + this._variant;
                }
                result.width = dims.w;
                result.height = dims.h;
            }
            return result;
        },
        setPackage : function(pkgid) {
            this._packageid = pkgid;
        },
        getPackage : function() {
            return this._packageid;
        },
        setCustomLayout : function(url, h, w) {
            //assert(url && url.length > "http://".length, "invalid custom layout url");
            //assert(h > 0 && w > 0, "custom layout must have valid width and height");
            this._customHeight = h;
            this._customWidth = w;
            this._customLayout = url;

            this._size = null;
        },
        getCustomParams : function() {
            if(this._customLayout) {
                return {
                    layout : this._customLayout,
                    width : this._customWidth,
                    height : this._customHeight
                };
            }
            return null;
        },
        setTransparent : function(isTransparent) {
            this._transparent = isTransparent;
        },
        setVis : function(v) {
            // validate viz?
            this._vis = v;
        },
        setOptions : function(opts) {
            for(var x in opts) {
                Log.debug("EmbedCode option: " + x);
                switch(x) {
                    case "forceFlash":
                        this._forceflash = opts[x];
                        break;
                    case "size":
                        this.setSize(opts[x]);
                        break;
                    case "isDemo":
                        this._isDemo = true;
                        break;
                    case "notracklist":
                        this._notracklist = opts[x];
                        break;
                    case "vis":
                        this.setVis(opts[x]);
                        break;
                }
            }
        },
        getOption : function(name) {
            switch(name) {
                case "notracklist":
                    return this._notracklist;
                    break;
            }
        }
    },
    statics : {
        getDims : function(size,isAlbum,variant) {
            var dims = {
                normal : {
                    venti : { w : 400, h : 100 },
                    grande : { w : 300, h : 100 },
                    grande2 : { w : 300, h : 355 },
                    grande3 : { w : 300, h : 410 },
                    tall : { w : 150, h : isAlbum ? 295 : 270 },
                    tall2 : { w : 150, h : 450 },
                    short : { w : 46, h : 23 }
                },
                core : {
                    venti : { w : 287, h : 30 },
                    grande : { w : isAlbum ? 297 : 197, h : 30 },
                    tall : { w : 150, h : isAlbum ? 78 : 56 },
                    short : { w : 23, h : 23 }
                }
            };

            return dims["normal"][size];
        },
        pushParam : function(hash, paramtype, name, value) {
            if(!hash[paramtype]) {
                hash[paramtype] = [];
            }
            hash[paramtype].push( { name : name, value : value });
        },
        // er.  MySpace converts CSS color specifications in hex "#hhhhhh"
        // format to just "hhhhhh" (dropping the '#'), so we'll specify them
        // as "rgb(n,n,n)" format.  This routine does the conversion.
        _hex_to_rgb : function(color) {
            match = /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(color);
            if(match)
            {
                return "rgb(" + Number("0x" + match[1])
                + "," + Number("0x" + match[2])
                + "," + Number("0x" + match[3]) + ")";
            }
    
            // not sure what else to do here; we need a color
            return "rgb(255,255,255)";
        },
        encodeLayoutURL : function(url) {
            // slightly beyond url-escaping:
            // make sure all '/' and '_' characters are %-encoded,
            // then replace all '%' with '_'.  This ensures flash
            // will not decode our %2F-encoded slashes and choke on
            // them, and decoding is simple: replace '_' with '%' and
            // use the standard unescape()
            return escape(url).replace(/\//g, "%2F").replace(/_/g, "%5F").replace(/%/g, "_");
        }
    }
});

var Share = {
    _shareDialog : null,
    _shareFromEmbedDialog : null,
    _biggieSizePresets : { small : 350, medium: 500, large: 700 },

    embedcode : new EmbedCode(),


    showFromEmbed : function() {
        if(CfgShare2) {
            Share.panelAsDialog();
        } else {
            Share.embedcode.setEmbedData(EmbedData);
            var isTrack = (EmbedData.tralbum_param.name == "track");
            Share._shareFromEmbedDialog = Share._createDialog("Share", "_share_from_embed", {is_track : isTrack, permalink : EmbedData.linkback}, [Dialog.buttons.ok(), Dialog.buttons.cancel()], "26em");
        }
    },

    showFromEmbedCleanup : function() {
        if(Share._shareFromEmbedDialog) {
            Share._shareFromEmbedDialog.cancel();
            Share._shareFromEmbedDialog = null;
        }
    },

    showDialog : function( isTrack, permalink, variant, skipStats ) {
        // this may only be called from a page which is initializing
        // the player/playlist.  If the playlist (gplaylist) is not
        // available, we'll setTimeout until it is.
        if(!gplaylist && variant != "email")
        {
            if(FlashProxy.error)
            {
                FlashProxy.noFlashError("share");
                return;
            }
            else
            {
                setTimeout(Share.showDialog, 0);
                return;
            }
        }

        Share.embedcode.setEmbedData(EmbedData);
        Share.embedcode.setVariant(variant);
        var params = { permalink: permalink, siteroot : EmbedData.swf_base_url, variant: variant, is_track: isTrack };
        if (!skipStats)
            Stats.share_menu_click(variant);

        //UISTRING:
        var dlg = Share._createDialog((variant == "email")?"Share":"Share / Embed", "_share", params, [Dialog.buttons.ok()], (variant == "email")?"445px":"850px");
        
        // code box has different id's in the normal vs "email" cases
        $("#embedcode,#permalink").click(function(event) {
                $(event.target).focus().select();
            });

        if(variant != "email") {

            Share.embedcode.setSize("venti");
            Share.embedcode.setOptions( { forceFlash: false } );

            var size = Share.embedcode.getSize();
            if(size) elt("sharePlayerSize_" + size).checked = true;

            var colorelems = {
                "bgcolor" : "bgColorSwatch",
                "linkcolor" : "linkColorSwatch"
            };

            var customParams = Share.embedcode.getCustomParams();
            if(customParams) {
                if(!Share._canBeCustom(variant)) {
                    Share.embedcode.setSize("venti");
                } else {
                    Share.showSection("custom");
                    elt("layouturl").value = customParams.layout;
                    elt("customwidth").value = customParams.width;
                    elt("customheight").value = customParams.height;
                }
            }

            for(var x in colorelems)
                Share._hookupColorSwatch(x, colorelems[x]);
			
            Share._updateControls();
            elt("embedcode").value = Share.embedcode.getEmbed(false);
            elt("embedded_player_sample").innerHTML = Share.embedcode.getEmbed(true);
        }
        else{
            // copy-ready text in the permalink
            embedelt.focus();
            embedelt.select();
        }

        Share._addMerch(TralbumData.packages);
    },

    _createDialog : function(title, template, hash, buttons, width) {
        var delem = $('<div>');
        var dialogparams = {
            draggable: false,
            height: "630",
            position: { my: "top+5", at: "top", of: window },
            modal: true
        };
        if(width) dialogparams.width = width;
        var d = delem.dialog(dialogparams);

        d.html(Templ.render(template, hash));

        delem.on("click", Share._handleClick);

        d.on("dialogclose", function() {
                Share._cleanupPicker();
                delem.remove();
            });

        $("#layouturl,#customwidth,#customheight").on("change", Share._handleCustomUpdated)
        $("#transparent").on("change", Share._handleTransparentChanged);
        $("input[name=standard-shortcode]").on("change", Share._handleShortcodeTypeChanged);

        $("#sizePicker").on("change", Share._handleDimensionPickerChanged);
        $("#showTracklist").on("change", Share._handleShowTracklistChanged);

        if(false && width) {
            delem.css("width", width);
        }
        
        return d;
    },


    _updateControls : function() {
        var variant = Share.embedcode.getVariant();
        var size = Share.embedcode.getSize();

        var showColorOptions = true;
        var showHeight = true;
        var showSizePicker = false;

        switch(size) {
            case "short":
                showColorOptions = false;
                break;
            case "biggie":
                showColorOptions = false;
                showHeight = $("#showTracklist").attr("checked") == "checked";
                showSizePicker = true;
                Share._updateSizePicker();
                break;
            case "artonly":
                showColorOptions = false;
                showHeight = false;
                showSizePicker = true;
                Share._updateSizePicker();
                break;
        }

        $("#colorOptions").css("visibility", showColorOptions ? "visible" : "hidden"); 
        $("#playerHeightLabel").css("visibility", showHeight ? "visible" : "hidden"); 
        $("#playerHeightLabel").css("visibility", showHeight ? "visible" : "hidden"); 
        $("#sizePickerLabel").css("visibility", showSizePicker ? "visible" : "hidden");

        var hidebiggieopts = size != "biggie";
        if(hidebiggieopts != Share._biggie_opts_hidden) {
            Share._biggie_opts_hidden = hidebiggieopts;

            var biggieopts = $("#showTracklistLabel,#merchLabel");
            if(!hidebiggieopts) {
                biggieopts.animate({
                    height: 'show'
                }, 400, function() {
                    biggieopts.css("visibility", "visible");
                });
            } else {
                biggieopts.css("visibility", "hidden");
                biggieopts.animate({
                    height: 'hide'
                }, 400);
            }
        }
    },
    _updateSizePicker : function() {
        $("#sizePicker option").each(function(index, opt) {
                var w = Share._biggieSizePresets[opt.value];
                if(!w) { throw "invalid size selected: " + opt.value }

                var h = Share._recommendedBiggieHeight(w);

                $(opt).html(opt.value + " (" + w + "px x " + h + "px)");
            });
    },
    _updateEmbed : function() {

        $("#embedcode")[0].value = Share.embedcode.getEmbed(false);
        var dims = Share.embedcode.getDims();
        $("#embedded_player_sample").html(Share.embedcode.getEmbed(true));
        var iframe = $("#embedded_player_sample iframe");
        var warning = $("#sample_not_actual_size_warning");
           
        // these constants reflect how big the preview space in the dialog is
        var MAX_PREVIEW_HEIGHT = 554;
        var MAX_PREVIEW_WIDTH = 400;

        // start with the preview hidden, and if it's too large for the
        // dialog, truncate it and show a message saying it's not actual size
        iframe.css("display", "none");
        var ih = iframe.outerHeight();
        var iw = iframe.outerWidth();
        if(ih > MAX_PREVIEW_HEIGHT || iw > MAX_PREVIEW_WIDTH) {
            var hscale = MAX_PREVIEW_WIDTH / iw;
            var vscale = MAX_PREVIEW_HEIGHT / ih;
            var scale = Math.min(hscale, vscale);
            iframe.css({ height: ih * scale, width: iw * scale });
            warning.css("display", "block");
        } else {
            warning.css("display", "none");
        }
        iframe.css("display", "block");
    },

    refreshCustom : function() {
        // clear the innerHTML so that we are certain the flash gets reloaded
        // even if the new innerHTML is the same as the old (since it will be
        // most of the time).
        elt("embedded_player_sample").innerHTML = "";
        Share._updateEmbed();
    },

    _canBeCustom : function(variant) {
        switch(variant) {
            case "wordpress":
            case "other":
                return true;
                break;
        }
        return false;
    },

    _hookupColorSwatch : function(name, swatchname) {
        var textfield = elt(name);
        var swatch = elt(swatchname);
        var UPDATE_DELAY = 1000;
        var delayedUpdateTimer = null;
        var currentColor = Share.embedcode.colors[name];

        swatch.style.background = Share.embedcode.colors[name];
        textfield.value = Share.embedcode.colors[name];

        function doUpdate() {
            if(currentColor != Share.embedcode.colors[name]) {
                currentColor = Share.embedcode.colors[name];
                swatch.style.background = currentColor;
                Share._updateEmbed();
            }
        }

        // while focused, check the textbox periodically
        // to see if it has a valid hex value.  if so, use it.
        var selector = "#" + name;
        Share.pollWhileFocused(selector, function(elem) {
                var match;
                if(match = /^#?([0-9a-fA-F]{6})$/.exec($(selector)[0].value))
                {
                    Share.embedcode.colors[name] = "#" + match[1];
                    doUpdate();
                }
            });

        function colorChoiceHandler(color, finished) {
            swatch.style.background = color;
            textfield.value = color;
            Share.embedcode.colors[name] = color;

            if(delayedUpdateTimer)
                clearTimeout(delayedUpdateTimer);

            if(finished)
            {
                Share._updateEmbed();
            }
            else
            {
                delayedUpdateTimer = setTimeout(doUpdate, UPDATE_DELAY);
            }
        }

        $(swatch)
            .click(function (event) {
                Share._picker = PopupPicker.pick(event.pageX, event.pageY, currentColor, colorChoiceHandler);
                Share._picker.on("dialogclose", function() {
                     Share._cleanupPicker();
                });
            });
    },

    _addMerch : function(packages) {
        if(!packages) return;

        for(var i=0; i<packages.length; i++) {
            $("#merchSelect").append($('<option>', { value: packages[i].id, text: packages[i].title }));
        }

        $("#merchSelect").on("change", Share._handleMerchSelected);
    },
    
    _cleanupPicker: function() {
        if (Share._picker)
        {
            var picker = Share._picker;
            Share._picker = null;
            PopupPicker.destroy(picker);
        }  
    },

    showSection : function(sec) {
        var shownormal = true;
        var showcustom = false;
        var showbiggie = false;

        switch(sec) {
            case "normal":
                //use defaults above
                break;
            case "custom":
                shownormal = false;
                showcustom = true;
                break;
            case "biggie":
                showbiggie = true;
                shownormal = false;
                break;
        }

        $("#sizeChoices").css("display", shownormal ? "inline" : "none");
        $("#customLayoutChoices").css("display", showcustom ? "inline" : "none");
        $("#refreshlink").css("display", showcustom ? "inline" : "none");
        $("#biggieSizeChoices").css("display", showbiggie ? "inline" : "none");

        Share._updateControls();
    },

    _backToNormal : function() {
        if(Share.embedcode.getCustomParams()) {
            Share.embedcode.setSize("venti");
            Share._updateEmbed();
        }
        Share.showSection("normal");
    },

    _recommendedBiggieHeight : function(width) {
        // note: this recommendation is not actually critical since the
        // biggie player can be arbitrarily sized, but this calculates
        // a nice height based on the options shown.  This is highly
        // dependent on the biggie (and related) CSS, so the contants
        // in here may need tweaking if that changes
        var size = Share.embedcode.getSize();
        var notracklist = Share.embedcode.getOption("notracklist");
        var pkg = Share.embedcode.getPackage();

        var MIN_HEIGHT = 350;
        var MERCH_SECTION_HEIGHT = 62;
        var CONTROLS_HEIGHT = 79;
        var TRACKLIST_BASE_HEIGHT = 11;
        var TRACKLIST_ITEM_HEIGHT = 26;
        var CURRENTTRACK_HEIGHT = 13;
        var MAX_TRACKS = 10;

        // these are all based on a nominal artwork size of MIN_HEIGHT, so scale to actual width
        var scalefactor = width / MIN_HEIGHT;

        var h = MIN_HEIGHT;
        if(size == "artonly") return Math.round(MIN_HEIGHT * (scalefactor));

        h += CONTROLS_HEIGHT;

        if(pkg) h += MERCH_SECTION_HEIGHT;

        if(notracklist) {
            h += CURRENTTRACK_HEIGHT;
        } else {
            var num_tracks_to_show = Math.min(TralbumData.trackinfo.length, MAX_TRACKS);
            h += TRACKLIST_BASE_HEIGHT + num_tracks_to_show * TRACKLIST_ITEM_HEIGHT;
        }

        return Math.round(h * scalefactor);
    },

    _handleClick : function(event) {
        if(event.target.name == "sharePlayerSize") {
            if(event.target.id == "sharePlayerSize_venti" && event.shiftKey && Share._canBeCustom(Share.embedcode.getVariant())) {
                event.preventDefault();
                Share.showSection("custom");
                Share.dlgCustomUpdate();
                return;
            } else if (event.target.id == "sharePlayerSize_grande" && event.shiftKey) {
                event.preventDefault();
                Share.showSection("biggie");
                // fixme: setting a different radio button in the click handler for this
                // radio button does not ever seem to work.
                setTimeout(function() { Share._selectSize("artonly");}, 0);
                return;
            }
            Share._handleSizeSelected(event.target.value);
            return;
        }

        switch(event.target.id) {
            case "refreshlink_anchor":
                Share.refreshCustom();
                event.preventDefault();
                break;
            case "classicmode_link":
            case "backtonormal_link":
                Share._backToNormal()
                event.preventDefault();
                break;
        }
    },
    _handleCustomUpdated : function() {
        var url = elt("layouturl").value;
        var h = elt("customheight").value;
        var w = elt("customwidth").value;
        Share.embedcode.setCustomLayout(url,h,w);
        Share._updateEmbed();
    },
    _selectSize : function(sz) {
        var elem = $("#sharePlayerSize_" + sz);
        if(elem.attr("checked") != "checked") {
            elem.attr("checked", "checked");
            Share._handleSizeSelected(sz);
        }
    },
    _handleSizeSelected : function(sz) {
        Share.embedcode.setSize(sz);
        switch(sz) {
            case "biggie":
            case "artonly":
                Share._handleDimensionPickerChanged();
                break;
            default:
                Share._updateControls();
                Share._updateEmbed();
                break;
        }
    },
    _handleTransparentChanged : function() {
        Share.embedcode.setTransparent(elt("transparent").checked)
        Share._updateControls();
        Share._updateEmbed();
    },
    _handleDimensionPickerChanged : function(event) {
        var picker = $("#sizePicker")[0];
        var value = picker.value;
        var width = Share._biggieSizePresets[value];
        var height = Share._recommendedBiggieHeight(width);
        Share.embedcode.setDims(width, height);
        Share._updateControls();
        Share._updateEmbed();
    },
    _handleShowTracklistChanged : function(event) {
        var opts = { notracklist: !(event.target.checked) }
        Share.embedcode.setOptions(opts);
        Share._handleDimensionPickerChanged();
    },
    _handleMerchSelected : function(event) {
        Share.embedcode.setPackage(event.target.value);
        Share._handleDimensionPickerChanged();
    },
    _handleShortcodeTypeChanged : function(event) {
        var variant = "other";
        if(event.target.value == 1) {
            variant = "wordpress";
        }

        Share.embedcode.setVariant(variant)
        var embed_code = Share.embedcode.getEmbed(false);
        $('#embedcode').val(embed_code);
    },

    // This could probably be a generic utility, or could probably be done
    // in a better way.  Just moving this out of hookupColorSwatch in a more
    // generic form.
    pollWhileFocused : function(sel, callback, period) {
        if(!period) {
            period = 500;
        }

        var timer = null;

        function docallback() {
            if(callback) callback($(sel));
        }

        function onblur(event) {
            if(timer) {
                clearInterval(timer);
                timer = null;
            }

            $(sel).off("blur", onblur);
        }

        $(sel).on("focus", function(event) {
                timer = setInterval(docallback, period);
                $(sel).on("blur", onblur);
            })
    },
	

    openFacebookShare : function(url, title) {
        var fburl = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url);
        fburl += "&p[title]=ptitle&p[summary]=psummary"
        if(title) { 
            fburl += "&t=" + encodeURIComponent(title);
        }
        window.open(fburl, 'sharer','toolbar=0,status=0,width=626,height=436');        
        return false;
    },

    openTwitterShare : function(message) {
        // Twitter is dithering on the deprecation of this URL for Tweet submission. 
        // "http://twitter.com/intent/tweet/?text=" is the official format, but 
        // it doesn't submit text on the user's Twitter page (on an isolated, empty page instead),
        // and the page auto-closes immediately after twooting. Not terrible, but not ideal.
        Log.debug("opening twitter share with message: " + message);
        var twurl = 'http://twitter.com/?status=' + encodeURIComponent(message);
        window.open(twurl);
        return false;
    },

    doFacebook : function(url, title) {
        Stats.share_menu_click("facebook");
        return Share.openFacebookShare(url, title);
    },
    
    doTwitter : function( url, isTrack, source ) {
        
        if( source && source == "tweet_button" ) {
          Stats.record({kind:"click", click: "tweet_button"});
        } else {
            Stats.share_menu_click("twitter");
        }
        
        var tralbum = isTrack ? "track" : "album";
        var message = "omg best " + tralbum + " ever: " + url;
        return Share.openTwitterShare(message);
    },




    /////////////////////////////////////////////////////////////////////////////
    // new-style share/embed reveals a panel just below tralbum art

    panelLinkPromise: new $.Deferred(),  // resolved when the Share/Embed link is rendered
    _panelInited : false,
    _panelData: null,

    initPanel: function(isTrackPage, enableSocialButtons, linkback) {
        if ( MediaView.mode == "phone" || $(".share-embed").length ) 
            return;

        var twitterUsername;
        $("#band-links a").each(function () {
            var match = /twitter\.com\/(?:#!)?(\w+)/i.exec($(this).attr("href"));
            if (match) {
                twitterUsername = match[1];
                return false;
            }
        });

        Share._panelData = {
            linkback: linkback,
            is_track: isTrackPage,
            enable_social_buttons: enableSocialButtons,
            title: TralbumData.current.title, 
            artist: TralbumData.artist,
            twitter_username: twitterUsername,
            download_pref: TralbumData.current.download_pref
        };
        $(".share-panel-wrapper-desktop").append( Templ.render("tralbum_common/share_collect_controls") );
        $(".share-embed").click( function() {
            Share.togglePanel();
        });
        if (enableSocialButtons)
            Share.initSocialButtons();
        Share.panelLinkPromise.resolve();
    },

    initSocialButtons: function() {
        // Make sure the external SDKs load now, but don't render the buttons themselves until the panel is shown, if ever.
        FacebookUtils.initSDK();
        GPlusUtils.initSDK();
    },

    // same a togglePanel, except it brings up the panel
    // contents in a modal dialog.  Unlike the panel, this
    // dialog is created and destroyed on each invocation
    panelAsDialog: function() {
        // wait until panel initialization is done before bringing the dialog up.
        Share.panelLinkPromise.then(Share._panelAsDialog);
    },
    _panelAsDialog: function() {
        var data = Share._panelData;
        var delem = $(Templ.render("tralbum_common/share_embed_panel", data));
        var dialogparams = {
            draggable: true,
            position: "center",
            modal: true,
            title: "Share",
            width: 380,
            height: 260
        };
        var d = delem.dialog(dialogparams);

        // don't automatically put focus in the email link box
        d.find(".email-im-link-text").blur();

        Share._initPanelControls(d, data, function() {
                d.dialog("close");
            });
        if (Share._panelData.enable_social_buttons) {
            // Note that we attempted to preload the social button SDKs earlier, in initPanel.
            SocialControls.initFromDOM(d);
        }
    },
    _initPanelControls: function(root, data, closehandler) {
        var $root = $(root);
        $root.find(".close").click( function() {
            closehandler();
        });

        $root.find(".embed-other-services a").click( function() {
            Stats.record({kind:"click", click: "embed_other"});
            if(CfgShare2) {
                EmbedDialog.open();
            } else {
                Share.showDialog(data.is_track, null, 'other', true);
            }
            closehandler();
        });

        $root.find(".share-buttons").on("click", ".twitter-link, .tumblr-link", function() {
            closehandler();
        });

        $root.find('.email-im-link input')
            .focus(function() {
                EmailIMUtils.onFocus();
            })
            .click(function() {
                $(this).select();
            });
    },

    togglePanel : function() {
        var $root = null;
        if(!Share._panelInited) {
            var data = Share._panelData;
            var $root = $(".share-panel-wrapper-desktop").append( Templ.render("tralbum_common/share_embed_panel", data) );
            Share._initPanelControls($root, data, function() { Share.togglePanel(); });
            Share._panelRoot = $root;
        } else {
            $root = Share._panelRoot;
        }

        var container = $root.find('.share-embed-container');
        var willShow = container.css("display") == "none";
        container.slideToggle('fast', function() {
            if (willShow)
                Dom.scrollToElement( container, 20, true );
        });

        if (!Share._panelInited) {
            if (Share._panelData.enable_social_buttons) {
                // Note that we attempted to preload the social button SDKs earlier, in initPanel.
                SocialControls.initFromDOM($root);
            }
            Share._panelInited = true;
        }
    },

    xxx: null
};
;
/* ------------- BEGIN utils.js --------------- */;
// Copyright 2008 Bandcamp, Inc. All rights reserved.


/////////////////////////////////////////////////////////////
/// Utility APIs
///

var Dom = {
    
    _init: function( initElem ) {
        initElem = elt( initElem );
        if ( !initElem ) return false;

        
        // Do some one-time-only initialization to reduce the amount of
        // of logical branching at runtime.
        
        if ( !Y.lang.isUndefined( initElem.textContent ) ) {
            // W3C
            Dom.getText = function( elem ) { 
                elem = elt( elem );
                return elem ? elem.textContent : "";
            };
            Dom.setText = function( elem, text ) { 
                elem = elt( elem );
                if ( elem ) elem.textContent = text; 
            }; 
        }  
        else {
            // IE proprietary
            Dom.getText = function( elem ) { 
                elem = elt( elem );
                return elem ? elem.innerText : "";
            };
            Dom.setText = function( elem, text ) { 
                elem = elt( elem );
                if ( elem ) elem.innerText = text; 
            };
        }
        
        if ( Y.util.Dom.getStyle( initElem, "userSelect" ) ) {
            // proposed CSS3
            Dom.setUnselectable = function( elem ) {
                elem = elt( elem );
                if ( elem ) elem.style.userSelect = "none";
            };  
        }
        else if ( Y.util.Dom.getStyle( initElem, "MozUserSelect" ) ) {
            // Firefox 2
            Dom.setUnselectable = function( elem ) {
                // It appears that this cannot be undone by setting back
                // to "normal".
                elem = elt( elem );
                if ( elem ) elem.style.MozUserSelect = "none";
            }; 
        }
        else if ( typeof initElem.style.WebkitUserSelect !== 'undefined' ) {
            // Safari, Chrome
            Dom.setUnselectable = function( elem ) {
                elem = elt( elem );
                if ( elem ) elem.style.WebkitUserSelect = "none";
            };
        }
        else {
            // IE proprietary
            Dom.setUnselectable = function( elem ) {
                // Note that the unselectable property doesn't inherit,
                // so descendents of this one could still be selectable. 
                // If this turns out to be a problem, we could recurse here. 
                elem = elt( elem );
                if ( elem ) elem.unselectable = "on";
            };
        }
        
        initElem = null; // free the elem from closures
        return true;
    },
    
    // Returns the text content contained by the element.
    getText: function( elem ) {
        if ( Dom._init( elem )) // init lazily; this will overwrite us
            return Dom.getText( elem );
        else
            return "";
    },
    
    // Removes all children and adds a single text node containing
    // the specified text.
    setText: function( elem, text ) {
        if ( Dom._init( elem )) // init lazily; this will overwrite us
            Dom.setText( elem, text );
    },
    
    // Special handling for radio buttons and checkboxes, otherwise just returns formElem.value
    // radios: returns value of selected radio in the group
    // checkboxes: returns the value of the checkbox, only if it is currently checked, else null
    //
    // if you're passing in a string, it needs to be an ID, not a NAME (esp. important for radios)
    getValue: function( formElem ) {
        formElem = elt( formElem );

        switch ( formElem.type ) {
        case "checkbox":
            return ( formElem.checked ? formElem.value : null );

        case "radio":
            var radios = document.getElementsByName( formElem.name );
            for( var i=0, n=radios.length; i<n; i++ ) {
                if ( radios[i].checked ) {
                    return radios[i].value;
                }
            }
            return null; // none selected
        }

        return formElem.value;
    },
    
    // Mark an element as permanently unselectable.
    setUnselectable: function( elem ) {
        if ( Dom._init( elem )) // init lazily; this will overwrite us
            Dom.setUnselectable( elem );        
    },
    
    // For browsers which don't support document.activeElement (like Firefox
    // versions <= 2), simulate it.
    initActiveElement: function() {
        
        var noActiveElement = false;
        try {
            noActiveElement = Y.lang.isUndefined( document.activeElement );
        }
        catch (e) {
            // IE throws exceptions if we access document.activeElement too early
            return;
        }
        
        if ( noActiveElement && document.addEventListener ) {
            
            function handleFocus( event ) {
                var node = Y.util.Event.getTarget( event );
                if ( node )
                    document.activeElement = node;                    
            }
            
            function handleBlur( event ) {
                var node = Y.util.Event.getTarget( event );
                if ( node == document.activeElement )
                    document.activeElement = null;
            }

            document.activeElement = null; // guarantee we don't run again
            
            // The standard DOM focus/blur events don't bubble out of
            // form elements, so we can't listen for them at the document 
            // level using bubbling. We could instead listen for 
            // DOMFocusIn/DOMFocusOut, but at least Firefox <= 2 doesn't 
            // support those. Instead, we listen for focus/blur during the
            // capture stage instead of the bubble stage (the 'true' param
            // in these method calls). Note that we can't use Y.util.Event 
            // here, as their API doesn't expose event capturing.
            document.addEventListener( "focus", handleFocus, true );
            
            // Why listen for blur at all? Because other event handlers might
            // be listening for blur, which fires before focus. Unless we 
            // update activeElement during blur, those other handlers might
            // get an activeElement which is in effect obsolete.
            document.addEventListener( "blur", handleBlur, true );
        }  
    },
    
    // The element.focus method can fail because the element is hidden (IE)
    // or for esoteric reasons I've never understood (Firefox).
    focus: function( elem ) {
        elem = elt( elem );
        try {
            elem.focus();
        }
        catch (e) {}
    },

    // Not sure if the same is true of element.select, but let's be careful.
    select: function( elem, doFocus ) {
        elem = elt( elem );
        try {
            elem.select();
            if ( doFocus )
                elem.focus();
        }
        catch (e) {}
    },    
    
    // Similar to Y.util.Dom.getDocumentHeight, but corrects for a problem I
    // see in FF in which the document's scrollHeight value will not shrink after
    // DHTML updates result in a shorter page. OffsetHeight seems not to have
    // that problem.
    getDocumentHeight: function() {
        return document.documentElement[ Browser.type == "gecko" ? "offsetHeight" : "scrollHeight" ];
    },
    
    // Copy one or more style values from srcElem to destElem.
    copyStyles : function( srcElem, destElem /* prop1, prop2, ... */ ) {
        
        var destStyle = destElem.style;
        var getStyle = Y.util.Dom.getStyle;
        for ( var i=2; i < arguments.length; i++ ) {
            var propName = arguments[i];
            destStyle[propName] = getStyle( srcElem, propName );
        }
    },

    // Replaces the given elem with the wrapper, making elem a child of wrapper.
    // elem: element ref or id
    // wrapperElem: element ref, or tagName (not id) to create a new element
    // returns: the wrapperElem
    wrapElem: function( elem, wrapperElem ) {
        if ( Y.lang.isString( wrapperElem ) )
            wrapperElem = document.createElement( wrapperElem );
        Y.util.Dom.insertBefore( wrapperElem, elem ).appendChild( elem );
        return wrapperElem;
    },
    
    // Replaces one element with another.
    replaceElem: function( oldElem, newElem ) {
        
        Y.util.Dom.insertAfter( newElem, oldElem );
        oldElem.parentNode.removeChild( oldElem );         
    },

	removeElem: function( elem ) {
		elem.parentNode.removeChild(elem);
	},


    // We pass "null" through (including undefined)-- to clear the value
    // and return to whatever the value for the current CSS.
    // For false/0, we map to "none"; for true/non-zero we map to "block",
    // except for SPANs which map to "inline".
    // Pass "inline" if that's what you want in other cases.
    //
    display: function( elemOrId, displayValue ) {

        if ( Y.lang.isArray ( elemOrId )) {
            
            return Y.util.Dom.batch( elemOrId,
                                     function ( el ) {
                                        this.display( el, displayValue );
                                     },
                                     this,
                                     true );
        }


        elemOrId = Y.util.Dom.get( elemOrId );
        if ( !elemOrId ) return;

        if ( displayValue == undefined ) // null/undefined
            displayValue = "";
        else if ( displayValue == false ) // false/0
            displayValue = "none";
        else if ( displayValue && typeof displayValue != "string" ) // true-ish, but not a string
            displayValue = ( elemOrId.tagName == "SPAN" || elemOrId.tagName == "INPUT" ) ? "inline" : "block";
        
        if ( Browser.type != "ie" &&
                ( displayValue == "block" || displayValue == "inline" )) {

            switch ( elemOrId.tagName.toLowerCase() ) {
            case "tr": displayValue = "table-row"; break;
            case "td": displayValue = "table-cell"; break;
            }
        }

        Y.util.Dom.setStyle( elemOrId, "display", displayValue );

        //Log.debug( Y.util.Dom.get( elemOrId ).id + " display: " + Y.util.Dom.get( elemOrId ).style.display );
    },

    disable: function( elemOrId, disableValue ) {

        if ( Y.lang.isArray ( elemOrId )) {
            
            return Y.util.Dom.batch( elemOrId,
                                     function ( el ) {
                                        this.disable( el, disableValue );
                                     },
                                     this,
                                     true );
        }

        var el = elt( elemOrId );
        if ( el ) {
            el.disabled = disableValue;
        }
    },

    // Find the first ancestor (inclusive of self) with the given class
    //
    // See Y.util.Dom.getElementsByClassName( className, tag, root, apply )
    // for getting children
    //
    getParentByClassName: function( elemOrId, className ) {
        var D = Y.util.Dom;

        var el = elt( elemOrId );
        while( el ) {
            if( D.hasClass( el, className ))
                return el;
            el = el.parentNode; 
        }
        
        return el;
    },

    // Find the first cousin (any element with shared ancestor, inclusive of self)
    // with the given cousin-class, under the given parent-class.
    //
    getCousinByClassName: function( elemOrId, parentClassName, cousinClassName ) {
        var el = this.getParentByClassName( elemOrId, parentClassName );
        if ( !el ) return null;

        return Y.util.Dom.getElementsByClassName( cousinClassName, null, el )[0];
    },

    // This has one purpose: scroll the body or document element vertically to show
    // the given element on screen, with some clearance on top (negative).
    // If you want it to be more general, have at it!
    //
    scrollToElement: function ( revealElt, clearance, gently ) {

        // support for older, non-jquery-aware callers
        if ( revealElt.charAt && revealElt.charAt(0) != "#" )
            revealElt = "#" + revealElt;
        
        revealElt = $( revealElt );
        if ( !revealElt.length ) return;
        
        // Expose all parents.  Assumes hidden elements are done so with inline styles,
        // not CSS, and they can be shown be clearing the inline display style.
        revealElt.parents().each( function( i, domElem ) {
            if ( domElem.style && domElem.style.display == "none" )
                Dom.display( domElem );
        } );

        // was only testing document.documentElement.scrollTop != null here,
        // but on Safari that is 0 (non-null), and the body controls the scrolling
        // UPDATE: have to browser-branch here, as far as I can tell -- kj
        var animElt = Browser.type == "webkit" ? document.body :
                      (( document.documentElement && document.documentElement.scrollTop != null ) ?
                       document.documentElement : document.body );

        if ( clearance == null ) clearance = -10

        // Logic for "gently": don't scroll elements that are fully visible,
        // and if speced in the params, only scroll to show it whole, not
        // to the top of the view.  Jarring in most mobile scenarios, otherwise.
        // Note: Webkit has a "scrollIntoViewIfNeeded"... though their
        // scrollIntoView is lame (scrolls too much in some cases). --kj 
        if ( gently ) {
            var viewHeight = document.documentElement.clientHeight,
                eltHeight = revealElt.height();
            
            var viewTop = animElt.scrollTop,
                viewBottom = animElt.scrollTop + viewHeight,
                eltTop = revealElt.offset().top,
                eltBottom = revealElt.offset().top + eltHeight;

            if ( eltTop >= viewTop ) {
                if ( eltBottom < viewBottom ) {
                    // already fully visible-- don't scroll at all
                    return;
                }
                // item is fully or partially offscreen to the bottom; scroll enough to show the full element:
                clearance += eltBottom - viewHeight;
            } else {
                // item above the view-- simple scroll-to-top
                clearance += eltTop;
            }
        } else {
            // simple scroll-to-top
            clearance += revealElt.offset().top;
        }

        $(animElt).animate( {"scrollTop": clearance}, 500 );
    },
    
    // Look for the parameter in the current location, treat it as an element id to scroll to.
    // param defaults to 'goto'.  This survives round-tripping through login, unlike # url anchors
    scrollToParamElt: function( id_param ) {
        var e;
        id_param = id_param || "goto";

        try {
            // ignore if we came in with a #anchor on the url
            if ( window.location.search && window.location.href.indexOf( "#" ) == -1 ) {
                params = window.location.search.slice(1).split("&");
                for ( i=0, n=params.length; i<n; i++ ) {
                    param = params[i].split("=");
                    if ( param[0] == id_param && param[1] ) {
                        // Typically called during onDOMReady-- give some breathing room
                        Y.lang.later( 10, window, function(){ Dom.scrollToElement( elt( param[1] ) ); } );
                        break;
                    }
                }
            }
        } catch( e ) { }
    },
    
    // Disable (DOM property 'disable') all 'tagName's in the given element tree.
    // Useful along with enableControls for taking items in and out of the validation
    // process at submit time.
    // - tag can be a string or array of strings and defaults to form elements if missing
    disableControls: function ( rootElt, tag ) {
        tag = tag || [ "INPUT", "TEXTAREA", "SELECT", "BUTTON" ];

        if ( Y.lang.isArray( tag )) {
            for ( var i=0, n=tag.length; i<n; ++i ) {
                this.disableControls( rootElt, tag[i] )
            }
            return;
        }

        if ( Y.lang.isArray( rootElt )) {
            for ( var i=0, n=rootElt.length; i<n; ++i ) {
                this.disableControls( rootElt[i], tag )
            }
            return;
        }

        rootElt = elt( rootElt );
        if ( !rootElt ) return;

        var e, elts = rootElt.getElementsByTagName( tag );

        for ( var i=0, n=elts.length; i<n; ++i ) {
            try { elts[i].disabled = true; } catch ( e ) { }
        }
    },
    
    // Enable (DOM property 'disable') all 'tagName's in the given element tree.
    // Useful along with enableControls for taking items in and out of the validation
    // process at submit time.
    // - tag can be a string or array of strings and defaults to form elements if missing
    enableControls: function ( rootElt, tag ) {
        tag = tag || [ "INPUT", "TEXTAREA", "SELECT", "BUTTON" ];

        if ( Y.lang.isArray( tag )) {
            for ( var i=0, n=tag.length; i<n; ++i ) {
                this.enableControls( rootElt, tag[i] )
            }
            return;
        }

        if ( Y.lang.isArray( rootElt )) {
            for ( var i=0, n=rootElt.length; i<n; ++i ) {
                this.enableControls( rootElt[i], tag )
            }
            return;
        }

        rootElt = elt( rootElt );
        if ( !rootElt ) return;

        var e, elts = rootElt.getElementsByTagName( tag );

        for ( var i=0, n=elts.length; i<n; ++i ) {
            try { elts[i].disabled = false; } catch ( e ) { }
        }
    },

    // Assume a parent of the given class, with an ID ending
    // in an integer.  Returns the parsed integer.  Operates on
    // the given element directly if className is missing.
    //
    elementToIndex: function( element, className ) {
        element = className ? Dom.getParentByClassName( element, className ) : element;
        if ( !element || !element.id ) return null;
        
        var match = element.id.match( /\w(\d+)$/ );
        if ( !match || !match[1] ) return null;

        return parseInt( match[1] );
    },

    hideEverythingStack: [],
    
    // Generalized from the original Dialog version.  Pass in the elts. you want explicitly visible.
    // You can stack these calls (e.g. for nested dialogs). The api is strict, as it allows nesting--
    // to prevent unbalanced calls, you have to pass in at least one of the same elts at unhide time.  --kj
    // 
    // Android Browser, at least in OS versions 2.3 and below, has what appears to be a family of related 
    // bugs with layered elements. In general, tapping on something which is layered above another
    // tappable thing will sometimes result in no tap action, or the tap going to the wrong element
    // (flashback to the bad old days...). In the case I saw, a <select> layered above a link, button, etc. 
    // couldn't be activated. Several possible workarounds are detailed here:
    //    http://code.google.com/p/android/issues/detail?id=6721
    // but I found the only reliable solution was to hide every active element which could possibly 
    // interfere. The brute-force implementation here is obviously limited to dialogs, although the 
    // problem will likely show up in other scenarios. - sdg 2012.05.23
    // 
    hideEverythingThanksAndroid: function( /* pass elts to make visible over the body */ ) {
        if ( Browser.make == "androidbrowser" ) {
            var args = Array.prototype.slice.call( arguments );
            if ( args.length == 0 )
                return;
            
            var devlog = $( '.logView' )[0];
            if ( devlog ) args.push( devlog );
            // Log.note( "hide params: " + args.length );
            
            // make the current head inherit from the body:
            $( this.hideEverythingStack[0] ).css( "visibility", "inherit" );

            // show the items after hiding the old ones, to handle dupes e.g. the floating dev log
            $( args ).css( "visibility", "visible" );
            $( args ).each( function(i, elt) {
                    // Log.note( "hide: " + [ i, elt.tagName, elt.className, elt.id || 'no id', elt.style.visibility ].join( ', ' ) ); 
                } );

            this.hideEverythingStack.unshift( args );

            // Note that if any other element has an explicit visibility:visible, then this won't hide it:
            $( document.body ).css( "visibility", "hidden" );
        }
    },
    
    unhideEverythingThanksAndroid: function( /* pass in at least one of the elts you passed in at hide time */ ) {
        if ( Browser.make == "androidbrowser" ) {
            var args = Array.prototype.slice.call( arguments );
            var top = this.hideEverythingStack[0];
            var found_one = false;
            if ( top && top.length > 0 ) {
                $( args ).each( function(i, elti) {
                    $( top ).each( function(j, eltj) {
                            found_one = found_one || ( elti == eltj );
                        } );
                    } );
            }
 
            if ( !found_one ) {
                Log.error( "Elt not found unhiding for android fixup" );
                return;
            }
 
            // discard top item-- caller is responsible for clean-up
            this.hideEverythingStack.shift();
            
            // show the next item down, or the body:
            elems = this.hideEverythingStack[0] || document.body;
            $( elems ).css( "visibility", "visible" );
            $( elems ).each( function(i, elt) {
                    // Log.note( "unhide: " + [ i, elt.tagName, elt.className, elt.id || 'no id', elt.style.visibility ].join( ', ' ) ); 
                } );

            // Log.note( "unhide params: " + $( elems ).length );
        }
    },

    // When hijacking <a>'s for dthml-age, this will suppress some annoying
    // mobile-Safari-only behavior: the browser drops down the location field briefly,
    // even though the navigation is being prevented.  User can still press-hold to
    // open the link in a new tab.
    // 
    // Pass in your click handler, to ensure it's called after we restore the href.
    //
    hackLinkClicksThanksSafari: function( elts, clickHandler ) {
        elts = $( elts );

        if ( Browser.platform != "iphone" ) {
            if ( clickHandler )
                elts.on("click", clickHandler);
            return;
        }

        elts.on( {
            // on touchend, before the click event, mangle the href
            "touchend": function( ev ) {
                var href = this.getAttribute('href');
                if ( href && href.substring(0,1) != '#' ) {
                    this.setAttribute('href','#' + href);
                }
            },

            // restore it on click then call the handler
            "click": function( ev ) {
                var href = this.getAttribute('href');
                if ( href && href.substring(0,1) == '#' ) {
                    this.setAttribute('href',href.substring(1));
                }

                if ( clickHandler )
                    return clickHandler.apply( this, arguments );  // handler can 'return false'
            }
        } );
    },

    xxx: null
};


/////////////////////////////////////////////////////////////
/// Text field hints
///

var FieldHints = {
        
    WRAPPER_CLASS: "fieldHintWrapper",
    ACTIVE_CLASS: "fieldHintActive",
    HINT_CLASS: "fieldHint",
    
    // On browsers that support it, we just set the placeholder attribute.
    NATIVE_PLACEHOLDER: ('placeholder' in document.createElement('input')),
    
    // By default we get the hint text from the title attribute. Set this to false for templates that use placeholder.
    USE_TITLE_ATTR: true,
    
    // Finds all text fields under the rootNode and, if appropriate, 
    // displays hints in those fields. Call this once during page load, and
    // again whenever new fields are added to the document.
    init: function( rootNode ) {

        var FH = FieldHints;
        Iter.each( FH._getFieldElements( rootNode ), function( elem ) {
            if ( FH._getHintText(elem) ) {
                FH._setupHint( elem );
                FH._showHint( elem );
            }
        });
    },
    
    _getFieldElements: function( rootNode ) {
		rootNode = rootNode ? elt(rootNode) : null;
        rootNode = rootNode || document;
        var inputElems = rootNode.getElementsByTagName( "INPUT" );
        inputElems = Iter.findAll( inputElems, function( elem ) {
            return elem.type == "text";
        });
        var textareaElems = rootNode.getElementsByTagName( "TEXTAREA" );
        return inputElems.concat( Iter.collect( textareaElems ) );
    },
    
    _handleFocus: function( event ) {
        FieldHints._hideHint( this );
    },
    
    _handleBlur: function( event ) {
        FieldHints._showHint( this );
    },
    
    _handleHintClick: function( event ) {
        var elem = Y.util.Dom.getNextSibling( this );
        $assert( ( elem.tagName == "INPUT" && elem.type == "text" ) ||
                 elem.tagName == "TEXTAREA" );
        // Sometimes -- in certain fields -- IE7 refuses to keep focus
        // in the field if we call directly; a timeout appears to fix this:
        setTimeout( function() { Dom.focus( elem ); }, 10 );
    },

    updateHint : function( elem ) {
        elem = elt( elem );
        if ( !elem ) return;

        var wrapperEl = elem.parentNode;
        if ( Y.util.Dom.hasClass( wrapperEl, FieldHints.WRAPPER_CLASS ) )
            // already set up, just update title text
            Dom.setText(elem._fieldhint, this._getHintText(elem));
        else
            FieldHints._setupHint( elem );
    },
    
    _setupHint: function( elem ) {
    
        if (this.NATIVE_PLACEHOLDER) {
            if (this.USE_TITLE_ATTR) {
                elem.placeholder = elem.title;
            }
            return;
        }
        
        // The basic strategy here is to display the hint by overlaying
        // an element above the input field. This is a modified version
        // of the technique detailed in the following article:
        //
        //   http://www.alistapart.com/articles/makingcompactformsmoreaccessible
        //
        // In that case the author uses <label> elements to hold the hint text.
        // That makes sense if the hint is in effect the "name" of the field, but
        // in our design the hint is more often an example or supplementary info. 
        // By not relying on <label>s to build the hints, we remain free to
        // provide field labels whenever appropriate.
        
        var wrapperEl = elem.parentNode;
        if ( Y.util.Dom.hasClass( wrapperEl, FieldHints.WRAPPER_CLASS ) )
            return; // already set up
        
        // If the parent is already relatively positioned, repurpose it as the 
        // hint wrapper. This makes us compatible with the YUI autocomplete 
        // DOM structure.
        if ( Y.util.Dom.getStyle( wrapperEl, "position" ) != "relative" ) {
			// have to wrap textarea in a div b/c of valgeir's safari bug (where auto-adjusting textarea height caused
			// greek characters to appear). side-effect is that we won't be able to have inline textareas.
			var wrapperTagName = (elem.tagName == "TEXTAREA") ? "div" : "span";
            wrapperEl = Dom.wrapElem( elem, wrapperTagName );
		}
        Y.util.Dom.addClass( wrapperEl, FieldHints.WRAPPER_CLASS );
        
        var hintEl = document.createElement( "span" );
        // I'd prefer to insert the hint after the field, so that screen-readers
        // would announce the field first. But putting it first resolves some
        // difficult layout glitches in Safari. - sdg 2008.05.05
        Y.util.Dom.insertBefore( hintEl, elem );
        hintEl.className = FieldHints.HINT_CLASS;
        Dom.setText( hintEl, this._getHintText(elem) );
        Dom.setUnselectable( hintEl );
        elem._fieldhint = hintEl;
        
        // Make sure we line up vertically with the actual field text by
        // matching box and font properties.
        Dom.copyStyles( elem, hintEl, "paddingTop", "paddingLeft", 
                                      "borderTopWidth", "borderLeftWidth", 
                                      "marginTop", "marginLeft", 
                                      "fontSize", "lineHeight" );        

        var ieLessThan7 = ( Browser.type == "ie" && Browser.version[0] < 7 );
        
        // I'm not sure why this is necessary, but it helps (at least in FF)
        // to ensure that the top of the wrapper aligns with the top of the field.
        if ( !ieLessThan7 ) // it hurts in IE 6
            Dom.copyStyles( elem, wrapperEl, "paddingTop" );
        
        if ( Browser.type == "gecko" ) {
            
            // Firefox appears to have a problem in which it doesn't recognize
            // the relatively-positioned, inline wrapperEl as the Y-coord context 
            // for hintEl. Assuming hintEl.top is "auto", all the hints on the page
            // smash together somewhere far above where they should be. The best
            // solution is to set position:relative on a *block* ancestor, but I don't
            // want to make that a requirement for this class, as that would limit
            // our layout flexibility. Instead we make a manual correction here. Note
            // that this can look bad if the user resizes the font size. - sdg 2008.05.05
            hintEl.style.top = elem.offsetTop + "px";
            
            // More strangeness: if the field has a top margin, it creates an
            // equivalent error in the hint position. Using a negative margin
            // of the same amount corrects for it. - sdg 2008.05.05
            var marginTop = Y.util.Dom.getStyle( elem, "marginTop" );
            var marginTopInt = parseInt( marginTop );
            if ( !isNaN( marginTopInt ) )
                hintEl.style.marginTop = "-" + marginTop;
        }
        else if ( ieLessThan7 ) {
            hintEl.style.border = "none"; // no transparent borders in IE 6?
        }
        
        Y.util.Event.on( elem, "focus", FieldHints._handleFocus );
        Y.util.Event.on( elem, "blur", FieldHints._handleBlur );
        Y.util.Event.on( hintEl, "click", FieldHints._handleHintClick );
    },
    
    // HACK: if hints are created inside a display:none container in FF,
    // they can be slightly offset.  Call this to fix up position at show time.
    // Complaints about this solution will be cheerfully ignored.
    jiggleHint: function( elem ) {
        
        elem = elt( elem );
        if ( !elem ) return;
        
        var wrapperEl = elem.parentNode;
        if ( !Y.util.Dom.hasClass( wrapperEl, FieldHints.WRAPPER_CLASS ) )
            return; // only applies if already set up
        
        if ( Browser.type == "gecko" ) {
        
            var hintEl = elem.previousSibling;
            
            // Firefox appears to have a problem in which it doesn't recognize
            // the relatively-positioned, inline wrapperEl as the Y-coord context 
            // for hintEl. Assuming hintEl.top is "auto", all the hints on the page
            // smash together somewhere far above where they should be. The best
            // solution is to set position:relative on a *block* ancestor, but I don't
            // want to make that a requirement for this class, as that would limit
            // our layout flexibility. Instead we make a manual correction here. Note
            // that this can look bad if the user resizes the font size. - sdg 2008.05.05
            hintEl.style.top = elem.offsetTop + "px";
            
            // More strangeness: if the field has a top margin, it creates an
            // equivalent error in the hint position. Using a negative margin
            // of the same amount corrects for it. - sdg 2008.05.05
            var marginTop = Y.util.Dom.getStyle( elem, "marginTop" );
            var marginTopInt = parseInt( marginTop );
            if ( !isNaN( marginTopInt ) )
                hintEl.style.marginTop = "-" + marginTop;
        }
    },
    
    // My shame knows no bounds
    jiggleAll: function( rootElem ) {
        Y.util.Dom.getElementsByClassName( FieldHints.WRAPPER_CLASS, null, rootElem, function(elem) {
            if ( elem.firstChild && elem.firstChild.nextSibling ) FieldHints.jiggleHint( elem.firstChild.nextSibling );
        });
    },
    
    _getHintText: function (elem) {
        // All browsers support elem.title.
        // All browsers we tested except IE9 supports elem.placeholder, but everyone (including IE9) supports
        // getAttribute('placeholder').
        return (this.USE_TITLE_ATTR ? elem.title : elem.getAttribute('placeholder'));
    },
    
    _showHint: function( elem ) {
        if ( !this.NATIVE_PLACEHOLDER && this._getHintText(elem) && !elem.value && ( elem != document.activeElement ) )
            Y.util.Dom.addClass( elem.parentNode, FieldHints.ACTIVE_CLASS );
    },
    
    _hideHint: function( elem ) {
        if ( FieldHints._isHintVisible( elem ) )
            Y.util.Dom.removeClass( elem.parentNode, FieldHints.ACTIVE_CLASS );
    },
    
    _isHintVisible: function( elem ) {
        return Y.util.Dom.hasClass( elem.parentNode, FieldHints.ACTIVE_CLASS );
    }
};

/////////////////////////////////////////////////////////////
/// Ellipsis helper
///

//TODO: hook font resize event from YUI to recalc ellipses

var Ellipses = {
    _outerClass : "ellipsizer",
    _innerClass : "ellipsizee",
    _moreClass : "ellipsisWrapper",
    _spacerClass : "ellipsisSpacer",

    // Prerequisites: 
    // 1. Assign the classname "ellipsizer" to the elements you wish to affect.
    // 2. Make sure the elements have a line-height defined somewhere, either
    //    directly or inherited.
    // 3. Assign a max-height to each element. IMPORTANT: the max-height must be
    //    an even multiple of the line-height. For example, if the line-height 
    //    is 1.5em, then acceptable max-heights are 1.5em, 3em, 4.5em, etc. This
    //    is done in CSS so there is no visible jump when the JS code is run.
    //    To avoid truncation in non-JS clients, it's best to use a CSS rule 
    //    beginning with the ".js" selector.
    init : function( rootNode ) {
        
        rootNode = rootNode || document.body;

        if ( rootNode.style.maxHeight == null )
            return; // probably IE 6, which doesn't support max-height

        var elems = Y.util.Dom.getElementsByClassName(Ellipses._outerClass, null, rootNode, function(elem) {
            
            // Insert an inner element between the original element and the
            // text content. This inner element will be used to measure the
            // natural height of the text.
            var innerEl = document.createElement( "span" );
            innerEl.className = Ellipses._innerClass;
            var children = elem.childNodes;
            while ( children.length )
                innerEl.appendChild( children[0] );
            elem.appendChild( innerEl );
    
            Ellipses._updateElement(elem);
        });
    },

    _updateElement : function(elem) {
        var child = Y.util.Dom.getElementsByClassName(Ellipses._innerClass, null, elem)[0];

        if(child.offsetHeight > elem.offsetHeight)
        {
            Ellipses._show(elem);
        }
        else
        {
            Ellipses._hide(elem);
            
            // Even if the text is not truncated currently, it might be after the 
            // user increases the browser font size. Because we don't yet detect 
            // font size adjustments, let's at least make sure that all the text
            // will be visible in that case.
            elem.style.maxHeight = "none";
        }
    },

    _show : function(elem) {
        var moreElem = Y.util.Dom.getElementsByClassName(Ellipses._moreClass, null, elem)[0];
        var spacerElem = Y.util.Dom.getElementsByClassName(Ellipses._spacerClass, null, elem)[0];
        if(moreElem)
        {
            moreElem.style.display = "block";
            spacerElem.style.display = "block";
        }
        else
        {
            moreElem = document.createElement("div");
            moreElem.className = Ellipses._moreClass;
            elem.insertBefore(moreElem, elem.firstChild);
            // UISTRING
            moreElem.innerHTML = '<a class="morelink" href="#">&hellip;more</a>';

            var linkElem = Y.util.Dom.getElementsByClassName("morelink", null, elem)[0];
            Y.util.Event.addListener(linkElem, "click", Ellipses._toggle, elem, false);

            spacerElem = document.createElement("div");
            spacerElem.className = Ellipses._spacerClass;
            elem.insertBefore(spacerElem, elem.firstChild);
        }
        
        // Use the moreElem as a measuring stick to determine how many lines
        // are visible. This assumes that moreElem has the same line height and
        // font size as the rest of the text.
        //
        // The ratio here doesn't come out to an even number: there's some 
        // small error in both FF and IE which forces us to round the result.
        // I'm using round() because in one browser the ratio is slightly high,
        // and in the other it's slightly low.
        var numLines = Math.max( 1, Math.round( elem.offsetHeight / moreElem.offsetHeight ) );
        
        var numSpacerLines = numLines - 1;
        var brs = [];
        for ( var i=0; i < numSpacerLines; i++ )
            brs.push( "<br>" );
        // Using <br> elements means that the moreElem will be correctly positioned
        // (although not necessarily correctly visible) after the user resizes the
        // browser font.
        spacerElem.innerHTML = brs.join("");
    },

    _hide : function(elem) {
        var moreElem = Y.util.Dom.getElementsByClassName(Ellipses._moreClass, null, elem)[0];
        var spacerElem = Y.util.Dom.getElementsByClassName(Ellipses._spacerClass, null, elem)[0];
        if(moreElem)
        {
            moreElem.style.display = "none";
            spacerElem.style.display = "none";
        }
    },

    // todo (not important): this function handles collapsing
    //   the ellipsis, but _show() needs to replace the "(more)"
    //   link with a "(less)" link in order for that to look right,
    //   so that's currently disabled.
    
    _toggle : function(evt, elem) {
        var moreElem = Y.util.Dom.getElementsByClassName(Ellipses._moreClass, null, elem)[0];
        if(moreElem)
        {
            if(moreElem.oldHeight)
            {
                elem.style.maxHeight = "";
                elem.style.maxHeight = moreElem.oldHeight;
                moreElem.oldHeight = null;
            }
            else
            {
                moreElem.oldHeight = elem.style.maxHeight;
                elem.style.maxHeight = "none";
            }

            Ellipses._updateElement(elem);
        }
        Y.util.Event.stopEvent(evt);
    }

};


/////////////////////////////////////////////////////////////
/// Dialog helper
///
/// To add iframe dialog support, pull in cookie_comm.js.

var Dialog = {
    
    _id: 0,
    instances: [],
    
    // opens a dialog inside of faceboook Asynchronously -- after polling Facebook (yes, Asynchronously) 
    // for the correct scroll position. Use this to open a dialog when you don't need a reference to 
    // the dialog after it has opened. 
    asycnOpenOnFB: function( title, body, buttons, width, options ) {
        if (window.FacebookData) {
           var patchYui = false;
           FacebookUtils.correctSrollThen( patchYui, Dialog, Dialog.open_inner, title, body, buttons, width, options );
        } else {
            return Dialog.open(title, body, buttons, width, options);
        }
    },
    
    // Opens a basic dialog. Note that the any insecure parts of the body string 
    // should be HTML-escaped before calling this method.
    open: function( title, body, buttons, width, options ) {
    
        var elemId = "dlg" + Dialog._id++;
        var opts;
        var dlg;
        // var tr_corner;
        var attr;
        var phoneView = window.MediaView && window.MediaView.mode == "phone";
        
        opts = {
            width: ( !phoneView ? width || "30em" : null ),  // width is handled in CSS for phone view
            modal: true,
            close: true,
            underlay: "none",
            dragOnly: true,
            // Defer displaying the dialog until after it has been centered in the current viewport.
            // Otherwise, YUI focuses the default button, which scrolls the viewport to the top.
            visible: false
        };
        $.extend(opts, options || {});

        dlg = new Y.widget.Dialog(elemId, opts);

        dlg.setHeader( '<div class="content">' +
                          Text.escapeHtml( Text.collate( title, "Bandcamp" ) ) + //UISTRING 
                          '</div>' );

        dlg.setBody( Text.collate( body, "&nbsp;" ) ); // nbsp is a placeholder 

        if ( buttons && !Y.lang.isArray( buttons ) )
            buttons = [buttons];
        if (!buttons)
            buttons = Dialog.buttons.standardSet();
        dlg.cfg.queueProperty( "buttons", buttons );
        dlg.cfg.queueProperty( "keylisteners", Dialog.keyListeners.standardSet( dlg ) );
        dlg.cfg.queueProperty( "constraintoviewport", true );
        
        if ( window.MediaView && MediaView.mode == "phone" )
            dlg.cfg.addProperty( "autofocus", {value: false} );  // we invented this property; see below
        
        // Autocentering doesn't work correctly with zoomed-in mobile browsers. The
        // iphone/android test here is a crummy, short-term solution. - sdg 2012.03.28
        // Updated to respect a fixedcenter value passed in - dh 2014.01.22
        var useAutoCentering = !window.FacebookData && !phoneView && 
                               !(Browser.platform == "iphone" || Browser.platform == "android") &&
                               opts.fixedcenter === undefined;

        if ( useAutoCentering )
            dlg.cfg.queueProperty( "fixedcenter", true );
        
        dlg.hideEvent.subscribe( function() {
            Dialog.destacken(dlg);
            if ( phoneView )
                Dom.unhideEverythingThanksAndroid( dlg.element, dlg.mask );
            
            // destroy on a timeout, as the YUI code throws errors otherwise
            Y.lang.later( 0, dlg, dlg.destroy );

            $.event.trigger("bc_dialog_close");
        });
        
        dlg.destroyEvent.subscribe( function() {
            if ( phoneView )
                Dom.unhideEverythingThanksAndroid( dlg.element, dlg.mask );
            Dialog.destacken(dlg);
        });
        
        dlg.hideMaskEvent.subscribe( function() {
            // fix a YUI bug: don't remove the body's "masked" classname if there remain other open dialogs
            if ( Dialog.instances.length )
                $(document.body).addClass("masked");
        });
        
        // fix for IE-specific bug 468830.
        // (expanded to gecko 9/2011 - RS)
        // YUI dialogs have a document-level focus listener which is used
        // to make sure focus stays in a modal dialog.  Whenever an element
        // is focused, YUI checks to see if it's in the dialog, and if not,
        // focus is reset to the dialog.  In IE, flash objects also seem
        // to want to forcibly focus themselves when you click in them,
        // and the result is that they take turns stealing focus back and
        // forth for a while, with the browser hung all the while.  Eventually,
        // this times out, but it's on the order of minutes. We see this problem
        // when users click on the flash "OK" button in the upload confirmation dialog.
        //
        // This fix monkey-patches YUI's focus listener
        // (dialog._onElementFocus) and simply ignores these focus events
        // if they're on <object> or <embed> tags.
        if ( Browser.type == "ie" || Browser.type == "gecko" ) {
            // monkey patch dlg._onElementFocus to ignore focus events on object tags
            // (in our case, the flash nugget)
            dlg._onElementFocus_orig = dlg._onElementFocus;
            dlg._onElementFocus = function(e) {
                if ( Y.util.Event.getTarget(e).tagName != "OBJECT" && Y.util.Event.getTarget(e).tagName != "EMBED" )
                    dlg._onElementFocus_orig(e);
            };
        }
        
        dlg.render( document.body );
        
        if (buttons.length == 0) {
            dlg.footer.style.display = "none";
            Y.util.Dom.addClass(dlg.body, "footerless");
        } else {
            Y.util.Dom.addClass(dlg.body, "footered");
            // Insert divs inside the dialog buttons; this gives us better
            // CSS formatting control.
            Y.util.Dom.batch( dlg.footer.getElementsByTagName( "button" ), function( elem ) {
                elem.innerHTML = "<div>" + Text.escapeHtml( Dom.getText( elem ) ) + "</div>";
            });
        }
        
        // Fix bug 253: dialog doesn't show up in Opera until we re-center
        // (not sure why).  - sdg 2009.06.11
        if ( !useAutoCentering || Browser.type == "opera" )
            dlg.center();
        
        dlg.show();
        $.event.trigger("bc_dialog_open");
        
        if ( phoneView ) {
            
            // On phones, the dialog is allowed to scroll out of view. To mitigate this, taps on the
            // mask element should scroll it back.
            Y.util.Event.on( dlg.mask, "click", function() {
                Dom.scrollToElement( dlg.element );
            } );
            
            Dom.hideEverythingThanksAndroid( dlg.element, dlg.mask );
        }

        Dialog.enstacken( dlg );
        return dlg;
    },
    
    // Opens a dialog whose body contents are derived from a template.
    openTemplate: function( title, templName, hash, buttons, width, options ) {
        
        var body = Templ.render( templName, hash );
        return Dialog.open( title, body, buttons, width, options );
    },
    
    // Opens a dialog with a title, message, and an OK button.
    // message: you must HTML-escape this as necessary
    // onClose: if provided, this is called after the dialog closes
    // if showCancel is set, a cancel button will be added, and
    // onClose will NOT be called if it is clicked.
    alert: function( title, message, onClose, showCancel ) {
        if( window.FacebookData ) {
            var patchYui = false;
            return FacebookUtils.correctSrollThen( patchYui, Dialog, Dialog.alert_inner,  title, message, onClose, showCancel );
        } else {
            return Dialog.alert_inner(title, message, onClose, showCancel); 
        }
        
    },
    
    alert_inner: function( title, message, onClose, showCancel ) {

        var buttons = showCancel ? Dialog.buttons.standardSet() : [ Dialog.buttons.ok() ];
        if ( onClose )
            buttons[0].handler = function() { this.cancel(); onClose.call( this ) };
        var dlg = Dialog.open( title, message, buttons, null, {close: false} );
        Y.util.Dom.addClass( dlg.body, "alertDlg" ); // tweak to top margin
        return dlg;
    },
    
    
    buttons: {
        
        standardSet: function( okHandler, okText, cancelHandler, cancelText ) {
            return [
                Dialog.buttons.ok( okHandler, okText ),
                Dialog.buttons.cancel( cancelHandler, cancelText )
            ];
        },

        // a provided handler should not dismiss the dialog
        //         
        ok: function( okHandler, okText ) {

            okHandlerWrapper = function() {
                this.cancel();
                if ( okHandler ) okHandler();
            };
            
            return {
                text: ( okText || "OK" ), //UISTRING
                isDefault: true,
                handler: okHandlerWrapper
            };
        },
        
        // a provided handler should not dismiss the dialog
        //         
        cancel: function( cancelHandler, cancelText ) {

            cancelHandlerWrapper = function() {
                this.cancel();
                if ( cancelHandler ) cancelHandler();
            };

            return {
                text: ( cancelText || "Cancel" ), //UISTRING
                handler: cancelHandlerWrapper
            };
        }        
    },
    
    keyListeners: {
        
        standardSet: function( dlg ) {
            return [ Dialog.keyListeners.escape( dlg ) ];
        },
        
        escape: function( dlg ) {
            return new Y.util.KeyListener(
                document,
                { keys: Y.util.KeyListener.KEY.ESCAPE },
                { fn: function( type, args ) {
                        // if a SELECT in the dialog is focussed and open on FF3-Mac,
                        // we badly snarl the browser if we cancel right away.  See IRC 2009.06.09.
                        // Is there anything setTimeout cannot do?
                        // I love you, setTimeout.
                        setTimeout( function() { dlg.cancel(); }, 1 );
                      },
                  scope: dlg, correctScope: true }
            ); 
        }
    },
    
    enstacken: function( dlg ) {
        Dialog.instances.push( dlg );
    },
    
    destacken: function( dlg ) {
        var index = Iter.index( Dialog.instances, dlg );
        if ( index >= 0 )
            Dialog.instances.splice( index, 1 );  
    }
};

// Invent an "autofocus" config property for YUI dialogs. Set this to false to suppress the default
// behavior of focusing the first element/button when the dialog is shown.
if ( Y && Y.widget && Y.widget.Dialog ) {
    Y.widget.Dialog.prototype._focusOnShow = function() {
        if ( this.cfg.getProperty("autofocus") !== false )
            Y.widget.Panel.prototype._focusOnShow.apply( this, arguments );
    };
}

var Time = {
    
    // Formats a Date object as a full, UI-ready date-time string.
    // NOTE: duplicates functionality in Time.to_ui (TimeHacks.rb).
    toUi: function( date, fourDigitYear, asUTC, as24 ) {
        if ( Y.lang.isString( date ) )
            date = new Date( date );
        //sdg TODO: uncertain what do do with timezones here
        // UISTRING
        var hour = date[ asUTC ? "getUTCHours" : "getHours" ]();
        var min = date[ asUTC ? "getUTCMinutes" : "getMinutes" ]();
        min = min < 10 ? "0" + min : min;
		if (as24) {
			hour = hour < 10 ? "0" + hour : hour;
			var ampm = '';
		} else {
	        var hour12 = hour > 12 ? hour - 12 : hour;
	        if (hour12 == 0)
	            hour12 = 12;  // midnight
	        var ampm = hour >= 12 ? "pm" : "am";
			hour = hour12;
		}
        return Time.toUiDate( date, fourDigitYear, asUTC ) + " " + hour + ":" + min + ampm;
    },
    
    // Formats a Date object as a full, UI-ready date-only string.
    // NOTE: duplicates functionality in Time.to_ui_date (Time.rb).
    toUiDate: function( date, fourDigitYear, asUTC ) {
        if ( Y.lang.isString( date ) )
            date = new Date( date );        
        //sdg TODO: uncertain what to do with timezones here
        var year = date[ asUTC ? "getUTCFullYear" : "getFullYear" ]().toString();
        if ( !fourDigitYear )
            year = year.substr( 2 );
        // UISTRING
        return ( date[ asUTC ? "getUTCMonth" : "getMonth" ]() + 1 ) + "/" + 
                 date[ asUTC ? "getUTCDate" : "getDate" ]() + "/" + 
                 year; 
    },
    
    relative_day: function(date, format) {
        if ( Y.lang.isString( date ) )
            date = new Date( date );

        var days_ago = Math.floor((new Date() - date) / (60*60*24*1000));
        var day;
        switch (days_ago) {
            case 0: day = "today"; break;
            case 1: day = "yesterday"; break;
            default: 
                if (format)
                    day = Time.strftime(date, '' + format);
                else
                    day = "" + days_ago + " days ago";
        }
        return day;
    },

    relative_time: function(date, format) {
        var relativeDay = this.relative_day(date, format);

        if ( relativeDay !== 'today' ) {
            return relativeDay;
        }

        if ( Y.lang.isString(date) ) {
            date = new Date(date);
        }

        // If it is today, try and figure out with better resolution how long
        // ago it was.
        var secondsAgo = (new Date() - date) / 1000;
        var minutesAgo = secondsAgo / 60;
        var hoursAgo = minutesAgo / 60;

        secondsAgo = Math.floor(secondsAgo);
        minutesAgo = Math.floor(minutesAgo);
        hoursAgo = Math.floor(hoursAgo);

        if (hoursAgo > 4) {
            return 'today';
        } else if (hoursAgo > 0) {
            return hoursAgo + ' hour'+(hoursAgo > 1 ? 's' : '')+' ago';
        }

        if (minutesAgo > 0) {
            return minutesAgo + ' minute'+(minutesAgo > 1 ? 's' : '')+' ago';
        }

        if (secondsAgo > 15) {
            return secondsAgo + ' seconds ago';
        }
        return 'just now';
    },

    // Formats a Date for near term (no year), returned as string, as in "Nov 15"
    toUpcomingDate: function( date, asUTC ) {
        if ( Y.lang.isString( date ) )
            date = new Date( date );  
        // UISTRING
        /* return ( date[ asUTC ? "getUTCMonth" : "getMonth" ]() + 1 ) + "/" + 
                 date[ asUTC ? "getUTCDate" : "getDate" ]() ;  */     
        // UISTRING
        return ( 
                Time.getMonthName( date[ asUTC ? "getUTCMonth" : "getMonth" ]()  ) + " " +  date[ asUTC ? "getUTCDate" : "getDate" ]()  ); 
    },    
    
    getMonthName : function(i) {
        // UISTRING
        var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul',
        'Aug','Sep','Oct','Nov','Dec'];
        
        return m[i];
    },
    
    strToDate: function( str ) {
        if ( !str ) return null; // short-circuit empty strings

        // JS (at least in FF) doesn't support the mm-dd-yy format, so convert
        // to slashes.
        str = str.replace( /-/g, "/" );

        // Serialized dates from the server contain the timezone (UTC), so they get parsed correctly
        // as UTC.  User-entered dates won't specify timezone, and in any case we always want our dates
        // represented as UTC time, so we'll slap on a "UTC" to the end of the string to make the Date
        // constructor parse it as a UTC time.
        if (!~str.indexOf('UTC') && !~str.indexOf('GMT')) {
            str += ' UTC';
        }
        
        var d = new Date(str);
        
        // When confronted with a datestring missing a year, like 
        //    new Date("3/7")
        // most browsers will return NaN. Some however (notably Chrome 9) will return 
        // a valid Date anyway, with a year picked seemingly randomly (in my tests
        // it was 2001). For Chrome, then, we can't use NaN as a test to fall into
        // our nice year-picking logic, below. So for those browsers we just fall into
        // that logic anyway, every time. Crazy!  - sdg 2011.03.07
        var missingYearResultsInNaN = isNaN( new Date( "3/7" ) );
        var tryAddingYear = isNaN(d) || !missingYearResultsInNaN;

        // if it is not already a valid date, and
        // if adding a year would make it a valid date,
        // figure out if this year, last year or next year
        // makes the most sense (which date is nearest to now)
        if ( tryAddingYear )
        {
            var recentMonths = 3;
            var mindate = new Date();
            mindate.setMonth(mindate.getMonth() - recentMonths);
            var year = new Date().getFullYear() - 1;

            // try dates from last year, this year
            // and next year, and take the first one
            // which is greater than 'recentMonths' months ago.
            //
            // This means if you enter a date with
            // no year, we will use the closest matching
            // in the recent past or near future
            for(var y = year; y < year + 3; y++)
            {
                var candiDate = new Date(str + " " + y);
                if(candiDate > mindate)
                {
                    d = candiDate;
                    break;
                }
            }
            
            if(isNaN(d))
            {
                return null;
            }            
        }
        else {
            // JS interprets all two-digit years as 19xx. We instead want to
            // allow two-digit years in the 21st Century, up to a certain point.
            var fullYear = d.getFullYear();
            if ( fullYear < 2000 && str.indexOf( fullYear ) == -1 ) {
                var twoDigitYearStr = fullYear.toString().substr( 2, 2 );
                var twoDigitYear = parseInt( twoDigitYearStr );
                // Our moving range will extend 25 years into the future. This
                // logic should be good until 2075, at which point this should
                // all done via wirelessly-enabled cerebral cortex nanobots anyway.
                var offset = 25; 
                var twoDigitCutoff = parseInt( ( new Date().getFullYear() + 25 ).toString().substr( 2, 2 ) ); 
                if ( twoDigitYear <= twoDigitCutoff )
                    d.setFullYear( fullYear + 100 );
            }
        }

        return d;
    },

    tables: {
    	a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    	A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    	b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    	B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    	p: ['AM', 'PM'],
    	P: ['A', 'P']
    },

    // See Ruby's Time.strftime for documentation of formats.
    formats: {
    	'a': function(d) { return Time.tables.a[d.getUTCDay()] },
    	'A': function(d) { return Time.tables.A[d.getUTCDay()] },
    	'b': function(d) { return Time.tables.b[d.getUTCMonth()] },
    	'B': function(d) { return Time.tables.B[d.getUTCMonth()] },
    	'd': function(d) { return TextFormat.pad(d.getUTCDate(), '0', 10) },
    	'e': function(d) { return TextFormat.pad(d.getUTCDate(), ' ', 10) },
    	'H': function(d) { return TextFormat.pad(d.getUTCHours(), '0', 10) },
    	'I': function(d) {
    	        var I = d.getUTCHours() % 12;
    	        return TextFormat.pad(I === 0 ? 12 : I, '0', 10);
    	    },
    	'l': function(d) {
    	        var I = d.getUTCHours() % 12;
    	        return I === 0 ? 12 : I;
				//return TextFormat.pad(I === 0 ? 12 : I, '0', 10);
    	    },
    	'j': function(d) {
    			var ms = d - new Date(d.getUTCFullYear() + '/1/1 GMT');
                // ms += d.getTimezoneOffset()*60000;  assume UTC
    			var doy = parseInt(ms/60000/60/24, 10)+1;
    			return TextFormat.pad(doy, '0', 100);
    		},
    	'm': function(d) { return TextFormat.pad(d.getUTCMonth()+1, '0', 10) },
    	'M': function(d) { return TextFormat.pad(d.getUTCMinutes(), '0', 10) },
    	'p': function(d) { return Time.tables.p[d.getUTCHours() >= 12 ? 1 : 0 ] },
    	'P': function(d) { return Time.tables.P[d.getUTCHours() >= 12 ? 1 : 0 ] },
    	's': function(d) { return parseInt(d.getTime() / 1000) },
    	'S': function(d) { return TextFormat.pad(d.getUTCSeconds(), '0', 10) },
        'u': function(d) {
                var dow = d.getUTCDay();
                return dow === 0 ? 7 : dow;
            },
    	'U': function(d) {
    			var doy = parseInt(Time.formats.j(d), 10);
    			var rdow = 6-d.getUTCDay();
    			var woy = parseInt((doy+rdow)/7, 10);
    			return TextFormat.pad(woy, '0', 10);
    		},
    	'w': function(d) { return d.getUTCDay().toString() },
    	'W': function(d) {
    			var doy = parseInt(Time.formats.j(d), 10);
    			var rdow = 7-Time.formats.u(d);
    			var woy = parseInt((doy+rdow)/7, 10);
    			return TextFormat.pad(woy, '0', 10);
    		},
    	'y': function(d) { return TextFormat.pad(d.getUTCFullYear() % 100, '0', 10) },
    	'Y': function(d) { return d.getUTCFullYear().toString() },
    	'Z': function(d) { return "UTC" },  // assume UTC; use Ruby's abbrev.
    	'%': function(d) { return '%'; }
    },

    aggregates: {
    	'c': '%a %b %e %X %Y',
    	'x': '%m/%d/%y',
    	'X': '%H:%M:%S'
    },

    strftime: function( date, fmt ) {
    	// first replace aggregates
    	while (fmt.match(/%[cDhnrRtTxX]/)) {
    		fmt = fmt.replace(/%([cDhnrRtTxX])/g, function(m0, m1) { return Time.aggregates[m1] });
    	}
        // then replace formats
    	return fmt.replace(/%([aAbBCdegGHIjlmMpPsSuUVwWyYzZ%])/g, function(m0, m1) { return Time.formats[m1](date) });
    }
};

var TextFormat = {

    // this is set up to default to "US$####.##" if only num is given - old behavior
    //       
    // Note: this returns HTML, not plain text, for some currencies -- the currency symbol can be an HTML entity 
    currency : function( num, currencyInfo, numericOnly, informal, terse ) {

        var fmt = currencyInfo || { prefix: "$", symbol: "USD", places: 2 }; // UISTRING

        var places = ( num >= 1 || num == 0 ) ? fmt.places : 2;
            // to handle (rare) oddball cases like small fractional yen

        // "informal" means format without decimals if the number is round, e.g -- "$6"
        if ( informal && num >= 1 && ( Math.round( num ) == num )) 
            places = 0;

        var base = num.toFixed( places );

        if ( numericOnly ) return base;
            // for error messages, we want the option to only show the number (no symbols)
            
        base = TextFormat.commafyNumber(base);

        if ( fmt.symbol && !terse )
            base += " " + fmt.symbol;

        return fmt.prefix + base;
    },
    
    toMb: function( num ) {
        var d = 1;
        var n = 1024;
        var m = Iter.find( [" bytes", "K", "MB", "GB", "TB", "PB"], function() {
            if ( num < n )
                return true;
            else {
                d = n;
                n *= 1024;
                return false;
            }
        } );
        if ( !m )
            return num.toString();

        var a = Math.round( (num/d)*10 );
        if ( a % 10 == 0 )
            return (a/10) + m;
        else
            return (a/10).toFixed(1) + m;
    },

    // prefix x with str chars until x is the same width as r
    // eg, pad(5, ' ', 100)  ->  '  5'
    // eg, pad(5, '0', 10)   ->  '05'
    pad: function(x, str, r) {
        x = x.toString();
    	for ( ; parseInt(x, 10) < r && r > 1; r /= 10)
    		x = str + x;
    	return x;
    },

    _determine_locale_separators : function() {
        var test = 1.2.toFixed(1);
        if(test.indexOf('.') >= 0) {
            TextFormat._separators = {
                decimal : '.',
                thousands : ','
            }
        } else {
            TextFormat._separators = {
                decimal : ',',
                thousands : '.'
            }
        }
    },

    // take a formatted number string and add thousands separators
    commafyNumber : function(str) {
        if(!TextFormat._separators) {
            TextFormat._determine_locale_separators();
        }

        var parts = str.split(TextFormat._separators.decimal);
        var out = "";
        var intpart = parts[0];
        var decimalpart = parts[1] ? (TextFormat._separators.decimal + parts[1]) : "";
        var length = intpart.length;
        var i = 0;

        while((length - i) % 3 > 0) {
            out += intpart.substr(i,1);
            i++;
        }

        if(out.length > 0 && (length - i) > 0) {
            out += TextFormat._separators.thousands;
        }

        while((length - i) > 3) {
            out += intpart.substr(i,3) + TextFormat._separators.thousands;
            i+=3;
        }

        if((length - i) > 0) {
            out += intpart.substr(i);
        }

        return out + decimalpart;
    },

    // Replaces the space between the last two words of a string with a non-breaking space.
    noOrphan: function(str) {
        return str.replace(/([^ ]+) +([^ ]+)$/, "$1\u00A0$2");
    }

};
/*
var HiddenParams = {};
function HiddenParamsInit(){
    var COOKIE_NAME = "hiddenParams";
    var cookie = Cookie.get(COOKIE_NAME);
    if (cookie)
    {
        Cookie.clear(COOKIE_NAME);
        var query = Url.parseQuery(cookie);
        if (query)
        {
            HiddenParams = query;
        }
    }
}
HiddenParamsInit();
*/

function addExpandEventListeners( field ) {
    $(field).off(".bcExpand").on("paste.bcExpand keyup.bcExpand focus.bcExpand", updateFieldHeight);
}

function updateFieldHeight( event ) {
	var field = event.target;
	var maxHeight = 250;
	
	var clientHeight = parseInt( field.clientHeight );
	var scrollHeight = parseInt( field.scrollHeight );
	
	if ( scrollHeight > clientHeight ) {

		if ( scrollHeight > maxHeight )
			scrollHeight = maxHeight;

		field.style.height = scrollHeight + "px";
	}
}

function addShrinkEventListeners( field, maxInactiveHeight ) {
    $(field).blur(function(event) {
        shrinkFieldHeight(event, maxInactiveHeight);
        }
    );
}

function shrinkFieldHeight( event, maxInactiveHeight ) {
    var field = event.target;
    var contentHeight = parseInt( field.scrollHeight );
    
    if ( contentHeight > maxInactiveHeight ) {
        field.style.height = maxInactiveHeight + "px";
    }
}

function addCharacterCountdownEventListeners( field, counterDiv, max, truncate ) {

    var counter = Y.util.Dom.getElementsByClassName("counter", "span", counterDiv)[0];
    
    // We'll suspend truncation after a too-long paste until the user has manually shortened it to below the max length.
    var truncationSuspended = false;
    
    function update(doTruncate) {
        var remaining = max - field.value.length;
        if (remaining <= 0) {
            Y.util.Dom.addClass(counterDiv, "notable");
        }
        else {
            Y.util.Dom.removeClass(counterDiv, "notable");
        }
        if (remaining < 0) {
            if (doTruncate && !truncationSuspended) {
                field.value = field.value.substr(0, max);
                remaining = 0;
            }
            else {
                truncationSuspended = true;
            }
        }
        else {
            truncationSuspended = false;
        }
        counter.innerHTML = remaining.toString();
        return true;
    }
    
    // paste catches ctrl-v or doing paste with the mouse, but only on some browsers (http://www.quirksmode.org/dom/events/cutcopypaste.html)
    Y.util.Event.addListener( field, "paste", function () {
        // We have to delay the update call because the textarea value won't reflect the new value yet.
        setTimeout(update, 0, truncate);
    });
    
    Y.util.Event.addListener( field, "cut", function () {
        setTimeout(update, 0, false);
    });
    
    // keyup catches normal typing and ctrl-v for browsers without onpaste,
    // but we'll end up always doing truncation and we'll still miss mouse-triggered pastes.
    // Not ideal but it's a decently graceful degradation for older non-IE browsers without onpaste.
    Y.util.Event.addListener( field, "keyup", function () {
        update(true);
    });
    
    update();
}

// Easily interrupt a pending setTimeout with another.
function InterruptibleTimer() {
    this._timer = null;
}
InterruptibleTimer.prototype = {
    
    start: function( code, delay ) {
        this.stop();
        this._timer = setTimeout( code, delay );
    },
    
    stop: function() {
        clearTimeout( this._timer );
    }
};

// call FarbLoader.whenready( callback )
// in order to have callback called after
// the Farbtastic css and scripts have been
// loaded.  Can be used by multiple callers
// without worrying about multiple loadings

var FarbLoader = {
    _ready : false,

    whenready: function( callback ) {
        if(FarbLoader._ready) {
            callback();
            return;
        }

        var cssLoaded = false;
        var scriptLoaded = false;
        
        var checkinit = function() {
            if(cssLoaded && scriptLoaded)
            {
                FarbLoader._ready = true;
                callback();
            }
        }

        var cssSuccessFn = function() { Log.debug("farb css loaded"); cssLoaded = true; checkinit(); };
        var scriptSuccessFn = function() { Log.debug("farb script loaded"); scriptLoaded = true; checkinit(); };

        YAHOO.util.Get.css( FarbtasticUrls.css, { onSuccess: cssSuccessFn } );
        YAHOO.util.Get.script( FarbtasticUrls.js, { onSuccess: scriptSuccessFn });
    }
};

var PopupPicker = {
    pick : function(x, y, startcolor, onchange) {
        // generate an event at x,y to pass as a positioning param
        var event = $.Event("click", { pageX: x, pageY: y });

        if(!startcolor) startcolor = "#FF0000";

        var dialog = $('<div>').dialog({
                dialogClass: 'popuppicker',
                width: "225",
                modal: true,
                position: { my: "center", at: "center", of: event }
            });
        dialog.html("<div id='popup_picker'><div id='picker_container'></div><div class='swatches'><span id='picker_oldcolor' class='swatch'></span><span id='picker_newcolor' class='swatch'></span></div></div>");

        var oldswatch = $("#picker_oldcolor");
        var newswatch = $("#picker_newcolor");
        var currentcolor = startcolor;

        dialog.on( "dialogbeforeclose", function() {
                onchange(currentcolor, true);
            });

        var colorpicked = function(color) {
            newswatch.css("background", color);
            currentcolor = color;
            onchange(currentcolor, false);
        };

        FarbLoader.whenready( function() {
                var farb = $.farbtastic("#picker_container", colorpicked);
                farb.setColor(startcolor);
                $("#picker_oldcolor,#picker_newcolor").css("background", farb.color);
                oldswatch.click(function() {
                        currentcolor = startcolor;
                        farb.setColor(currentcolor);
                    });
            });

        return dialog;
    },
    destroy : function(picker) {
        picker.remove();
    }
};


// --------------------------------------------------

// Add input-watching to any object using Y.lang.augmentObject( OtherClassOrObject, WatchInput )
// Supply a method inputChanged( newAmt, eltId ).  newAmt will be undefined if unparseable. 
// type defaults to "float", can be "integer" or any other string for just raw string value
// 
var WatchInput = { 
    
    watchInput: function ( eltID, defaultValue, valueType ) {
        $assert( typeof eltID == "string" ) // dont hold a reference

        if ( this.__watching == null )
            this.__watching = { }; // we're applied to various classes, don't create until invoked

        var stuff = this.__watching[ eltID ] = {};

        stuff.__watchInput_elt = eltID;
        stuff.__watchInput_default = defaultValue;
        stuff.__watchInput_type = valueType || "float";

        var Self = this;
        setTimeout( function () { Self.__watchInput( eltID ) }, 500 );
    },

    __watchInput: function ( whichID ) {
        var stuff = this.__watching[ whichID ];
        if ( !stuff ) return;

        var e, el = elt( stuff.__watchInput_elt );
        if ( !el ) {
            this.__watching[ whichID ] = null;
            return; // self-terminating once the watched element goes away
        }

        var val = ( el.value == undefined ) ? el.innerHTML : el.value 
        switch ( stuff.__watchInput_type ) {
        case "float":
            var amt = parseFloat( val );
            if ( isNaN( amt ))
                amt = stuff.__watchInput_default;
            break;
        case "integer":
            var amt = parseInt( val );
            if ( isNaN( amt ))
                amt = stuff.__watchInput_default;
            break;
        default:
            var amt = val;
            break;
        }

        if ( amt != stuff.__watchInput_Last && this.inputChanged ) {
            try {
                this.inputChanged( amt, stuff.__watchInput_elt );
            } catch (e) {   
                Log.error(e);
            }
        }

        stuff.__watchInput_Last = amt;

        var Self = this;
        setTimeout( function () { Self.__watchInput( whichID ) }, 500 );
    }
    
}
    

// --------------------------------------------------

// Implementation of Expression.rb -- number 6!

var Expression = {

    eval: function(expr, eval_lambda, handle_constants) {
        var p = this.init(expr, eval_lambda, handle_constants);

        var value = this.parse_top(p);
        if (this.next_token(p).kind != 'end')
            throw "Expression error: '" + p.expr + "' -- end expected";
        return value;
    },

    dump: function(expr, eval_lambda, handle_constants) {
        var p = this.init(expr, eval_lambda, handle_constants);
        
        while (true) {
            var t = this.next_token(p);
            console.log(t.kind + " " + t.value);
            if (t.kind == 'end')
                break;
        }
    },

    init: function(expr, eval_lambda, handle_constants) {
        var p = {};

        p.expr = expr;
        p.handle_constants = handle_constants;
        p.eval_lambda = eval_lambda;

        p.return_prev_token = false;
        p.short_circuit = false;
        return p;
    },

    OPERATORS: ['||', '&&', '<=', '==', '!=', '>=', '<', '>', '+', '-', '*', '/', '%', '!', '(', ')'],

    next_token: function(p) {
        if (p.return_prev_token) {
            p.return_prev_token = false;
            return p.previous_token;
        }

        var token = {};
        
        p.expr = p.expr.replace(/^\s+/, "");
        if (p.expr == "")
            token.kind = 'end';
        else {
            for (var i = 0; i < this.OPERATORS.length; ++i) {
                var op = this.OPERATORS[i];
                if (p.expr.substr(0, op.length) == op) {
                    token.kind = op;
                    p.expr = p.expr.slice(op.length);
                    break;
                }
            }
            
            if (!token.kind) {
                var m;
                m = p.expr.match(/^(\'[^\']*\')/) || p.expr.match(/^(\"[^\"]*\")/) || p.expr.match(/([^\s\+\-\*\/\%\(\)\<\=\>\!\&\|\'\"]+)/);
                if (m) {
                    token.value = m[1];
                    token.kind = 'term';
                    p.expr = p.expr.slice(token.value.length);
                }
            }
        }

        p.previous_token = token;
        return token;
    },

    backup: function(p) {
        p.return_prev_token = true;
    },

    // PARSE

    is_true: function(val) {
        return val !== false && val != null; // 0 and "" are true
    },

    parse_top: function(p) {
        return this.parse_boolean_op(p);
    },

    parse_boolean_op: function(p) {
        var value = this.parse_comparison_op(p);
        while (true) {
            switch (this.next_token(p).kind) {
            case '||':
                if (this.is_true(value)) {
                    var s = p.short_circuit;
                    p.short_circuit = true;
                    this.parse_boolean_op(p);  // short circuit (not interested in result)
                    p.short_circuit = s;
                } else
                    value = this.parse_comparison_op(p);
                break;
            case '&&':
                if (!this.is_true(value)) {
                    var s = p.short_circuit;
                    p.short_circuit = true;
                    this.parse_boolean_op(p);  // short circuit (not interested in result)
                    p.short_circuit = s;
                } else
                    value = this.parse_comparison_op(p);
                break;
            default:
                this.backup(p);
                return value;
            }
        }
    },

    parse_comparison_op: function(p) {
        var value = this.parse_additive_op(p);
        while (true) {
            switch (this.next_token(p).kind) {
            case '<':
                value = (value <  this.parse_additive_op(p));
                break;
            case '<=':
                value = (value <= this.parse_additive_op(p));
                break;
            case '==':
                value = (value == this.parse_additive_op(p));
                break;
            case '!=':
                value = (value != this.parse_additive_op(p));
                break;
            case '>=':
                value = (value >= this.parse_additive_op(p));
                break;
            case '>':
                value = (value >  this.parse_additive_op(p));
                break;
            default:
                this.backup(p);
                return value;
            }
        }
    },

    parse_additive_op: function(p) {
        var value = this.parse_multiplicative_op(p);
        while (true) {
            switch (this.next_token(p).kind) {
            case '+':
                value += this.parse_multiplicative_op(p);
                break;
            case '-':
                value -= this.parse_multiplicative_op(p);
                break;
            default:
                this.backup(p);
                return value;
            }
        }
    },

    parse_multiplicative_op: function(p) {
        var value = this.parse_term(p);
        while (true) {
            switch (this.next_token(p).kind) {
            case '*':
                value *= this.parse_term(p);
                break;
            case '/':
                value /= this.parse_term(p);
                break;
            case '%':
                value %= this.parse_term(p);
                break;
            default:
                this.backup(p);
                return value;
            }
        }
    },

    parse_term: function(p) {
        var token = this.next_token(p);
        var value;
        switch (token.kind) {
        case '(':
            value = this.parse_top(p);
            if (this.next_token(p).kind != ')')
                throw "Expression error: '" + p.expr + "' -- unbalanced parentheses";
            break;
        case '+':
            value = this.parse_term(p);
            break;
        case '-':
            value = -this.parse_term(p);
            break;
        case '!':
            value = !this.is_true(this.parse_term(p));
            break;
        case 'term':
            if (!p.short_circuit) {
                var con = p.handle_constants;
                if (con) {
                    con = this.constant(token.value);
                    if (con)
                        value = con.v;
                }
                if (!con) {
                    if (p.eval_lambda)
                        value = p.eval_lambda(token.value);
                    else
                        throw "Expression error: '" + p.expr + "' -- not a term";
                }
            }
        }
        return p.short_circuit ? 1 : value;  // 1 is a benign value
    },

    constant: function(x) {
        var m;
        if (x.match(/^\d/)) {
            if (x.match(/e|E|\./))
                return {'v': parseFloat(x)};
            else
                return {'v': parseInt(x)};
        } else if (m = (x.match(/^\'(.*)\'$/) || x.match(/^\"(.*)\"$/)))
            return {'v': m[1]};
        else if (x == 'true')
            return {'v': true};
        else if (x == 'false')
            return {'v': false};
        else if (x == 'nil')
            return {'v': null};
        else
            return null;
    }
}

//----------------------------------------------------------------------

// Status message
// (all method arguments are optional)
// 
// show:
//      -> show speed:      'fast', 'slow' or millisec
//      -> show spinner:    boolean
//      -> message:         string
//      -> timeout:         millisec    (will hide after timeout)
//          -> showing message with spinner:
//              StatusSpinny.show( 'fast', true, 'Saving...', 5000);
//          -> showing spinner with no message:
//              StatusSpinny.show( 'fast', true, '');
//          -> showing message with no spinner:
//              StatusSpinny.show( 'fast', false, 'Saving...');
// 
// show after delay:
//      -> show delay:      millisec
//      -> return:  cancelID    (used to cancel before status is shown);
//      StatusSpinny.wouldShowAfter( 1500, 'fast', true, 'Saving...');
// 
// hide:
//      -> hide speed:      'fast', 'slow' or millisec
//      -> cancelID:        return value of .wouldShowAfter(), could be used to cancel status before it is shown
//      -> animCB:          post hide animation callback
//      StatusSpinny.hide('fast');
// 
var StatusSpinny = {
    
    spinnyID: 'status-spinny',
    spinningClass: 'spinning',
    timeouts: [],
    showQueue: [],
    showingQueue: false,
    isShown: false,
    
    spinny: function(spins) {
        var spinnyEl = $('#'+StatusSpinny.spinnyID);
        if (spinnyEl.length === 0)
            spinnyEl = $('<div id="'+StatusSpinny.spinnyID+'"></div>').appendTo(document.body);
        
        if (typeof spins == 'boolean') spinnyEl[spins?'addClass':'removeClass'](StatusSpinny.spinningClass);
        
        return spinnyEl;
    },
    
    show: function( speed, spins, message, duration ) {
        if (message === undefined || message == null) message = '';
        StatusSpinny.resetTimeouts();
        
        var showFn = function() {
            StatusSpinny.isShown = true;
            StatusSpinny.spinny(spins).html(message).fadeIn(speed);

            if (typeof duration == 'number') StatusSpinny.timeout(duration);
        };
        if (StatusSpinny.isShown) StatusSpinny.scheduleShow(message,showFn);
        else showFn();
    },
    
    scheduleShow: function(message,showFn) {
        StatusSpinny.showQueue.push({ message: message, fn: showFn });
        
        if (!StatusSpinny.showingQueue) {
            StatusSpinny.showingQueue = true;
            var runShowScheduler = function() {
                StatusSpinny.hide(100, null, function() {
                    if (StatusSpinny.showQueue.length > 2) {
                        var queuedShow = StatusSpinny.showQueue.shift();
                        while (StatusSpinny.showQueue.length > 1 && queuedShow.message == StatusSpinny.showQueue[1].message) {
                            StatusSpinny.showQueue = StatusSpinny.showQueue.slice(2);
                        }
                        queuedShow.fn();
                        
                    } else if (StatusSpinny.showQueue.length > 0) {
                        StatusSpinny.showQueue.shift().fn();
                        
                    } else {
                        StatusSpinny.showingQueue = false;
                        return null;
                    }
                    
                    window.setTimeout(runShowScheduler,1500);
                });
            }
            runShowScheduler();
        }
    },
    
    wouldShowAfter: function( afterTime, speed, spins, message, duration ) {
        var uniqueTimeoutID = StatusSpinny.timeoutId(),
            spinny = StatusSpinny.spinny();
        
        spinny.on(uniqueTimeoutID, function(){ StatusSpinny.show( speed, spins, message, duration ); });
        window.setTimeout(function(){ spinny.trigger( uniqueTimeoutID ); }, afterTime);
        
        return uniqueTimeoutID;
    },
    
    hide: function( speed, cancelID, animCB) {
        if (cancelID !== undefined && typeof cancelID == 'string') StatusSpinny.spinny().off( cancelID );
        
        if (speed === undefined) speed = 'fast';
        StatusSpinny.spinny().fadeOut(speed,animCB);
        StatusSpinny.isShown = false;
    },
    
    timeout: function(duration) {
        var uniqueTimeoutID = StatusSpinny.timeoutId(),
            spinny = StatusSpinny.spinny();
        
        spinny.on( uniqueTimeoutID, StatusSpinny.hide );
        StatusSpinny.timeouts.push( uniqueTimeoutID );
        
        window.setTimeout(function(){ spinny.trigger( uniqueTimeoutID ); }, duration);
    },
    
    resetTimeouts: function() {
        while (StatusSpinny.timeouts.length > 0) { StatusSpinny.spinny().off( StatusSpinny.timeouts.shift() ); };
    },
    
    timeoutId: function() {
        return (new Date()).getTime() + '' + Math.random();
    },
    
    zzz: null
};

$.extend( Url, {
    // Given a URL pointing to a YouTube or Vimeo video, returns an object with 'id' and 'type' properties.
    parseVideoURL: function(url) {
        var parts       = Url.toHash(url),
            params      = Url.parseQuery(parts.search),
            path        = parts.pathname.replace(/^\/*(.*?)\/*$/, "$1"),
            youtubeIDRe = /^[\w,\-]+$/, // could be tightened up
            vimeoIDRe   = /^\d+$/,
            id          = null,
            type        = null;
        if (parts.protocol) {
            // http://www.youtube.com/watch?v=nR6CY3pFjYM
            // https://www.youtube.com/watch?v=-MdTldrkJqE
            if ( /(^|\.)youtube\.com$/.test(parts.host) ) {
                if ( /^\/watch\/?$/.test(parts.pathname) && youtubeIDRe.test(params["v"]) ) {
                    id = params["v"];
                    type = "y";
                }
            }
            // http://youtu.be/nR6CY3pFjYM
            else if ( /(^|\.)youtu\.be$/.test(parts.host) ) {
                if ( youtubeIDRe.test(path) ) {
                    id = path;
                    type = "y";
                }
            }
            // http://vimeo.com/16981453
            else if ( /(^|\.)vimeo\.com$/.test(parts.host) ) {
                if ( vimeoIDRe.test(path) ) {
                    id = path;
                    type = "v";
                }
            }
        }
        return { id: id, type: type };
    },

    makeVideoUrl: function(videoID, videoType) {
        if (videoID) {
            switch (videoType) {
            case "y":
                return "http://www.youtube.com/watch?v=" + encodeURIComponent(videoID);
            case "v":
                return "http://vimeo.com/" + encodeURIComponent(videoID);
            }
        }
        return null;
    }
});
;
/* ------------- BEGIN templ.js --------------- */;
// Library for rendering Liquid templates via JavaScript. 
//
// General usage:
//     Templ.render( "template_name", { key1: value1, key2, value2, ... } )
//
// This assumes that the template "template_name" has already been registered
// using Templ.register, either in the initial page html, a script include, or
// via an xhr request.
var Templ = {
        
    // Hash of template names to values. Each value is an array of token
    // strings and objects (a translation of Liquid's parse tree to JS).
    templates: {},
    globals: null,  // don't access directly; use getGlobals()
    
    // Add one or more templates to the local store.
    register: function( hashOfTemplates ) {
        $.extend( Templ.templates, hashOfTemplates ); 
    },

    // for debugging: refresh a set of templates from the server
    refresh: function( set ) {
        $assert( set );
        var url = '/js_templates?x=' + Math.random() + '&set=' + set;
        var head = document.getElementsByTagName("head")[0];
        var newscript = document.createElement("script");
        newscript.type = "text/javascript";
        newscript.src = url;
        head.appendChild(newscript);
    },

    getGlobals: function() {
        if (!Templ.globals) {
            var pageData = $("#pagedata").data("blob"),
                newGlobals = pageData && pageData.templglobals,
                // TODO: this global variable should migrate to the pagedata scheme
                oldGlobals = (typeof(TemplGlobals) != "undefined") ? TemplGlobals : null;
            Templ.globals = $.extend({}, oldGlobals, newGlobals);
        }
        return Templ.globals;
    },
       
    // Render the named template to a string, applying the variables in hash.
    // Equivalent to Liquid's Template.render.

    // Render speeds, 2011-04-22:
    // Rendering download_panel with expression eval for variables: 78-80ms; with context.resolve for variables: 78ms.
    
    RENDER_SPEED_TEST: false,

    render: function( templName, hash ) {

        var myhash = $.extend( {}, Templ.getGlobals(), hash ); // later objects take precedence over earlier ones
        var context = new Templ.Context( myhash );

        if (this.RENDER_SPEED_TEST) {

            Log.debug(">>> start rendering " + templName);
            var start_date = new Date();
            for (var i = 0; i < 100; ++i) {
                var out = [];
                Templ.renderInternal( templName, context, out );
            }
            var end_date = new Date();        
            Log.debug(">>> end rendering " + templName + " - " + ((end_date - start_date) / 100.0) + "ms");

        } else {

            // Make context available to filters
            Templ.current_context = context;
            var out = [];
            Templ.renderInternal( templName, context, out );
            Templ.current_context = null;
        }

        return out.join("");        
    },

    // Convenience function which removes all event handlers from the given
    // element's descendents, then replaces the element content with the
    // rendered template.
    renderElem: function( el, templName, hash ) {
        
        el = elt( el );
        Y.util.Dom.batch( Y.util.Dom.getChildren( el ), function( thisEl ) {
            Y.util.Event.purgeElement( thisEl, true );            
        });
        el.innerHTML = Templ.render( templName, hash );
    },

    renderTableRow: function( el, templName, hash ) {

        el = elt( el );
        Y.util.Dom.batch( Y.util.Dom.getChildren( el ), function( thisEl ) {
            Y.util.Event.purgeElement( thisEl, true );            
        });

        var parent = document.createElement("DIV");
        parent.innerHTML = "<table><tbody><tr>" + Templ.render( templName, hash ) + "</tr></tbody></table>";

        var newrow = parent.firstChild.firstChild.firstChild;

        while(el.firstChild != null)
        {
            el.removeChild(el.firstChild);
        }

        while(newrow.firstChild != null)
        {
            el.appendChild(newrow.removeChild(newrow.firstChild));
        }
    },
    
    renderInternal: function( templName, context, out ) {
        
        // Log.debug("rendering template: " + templName);

        var tokens = Templ.templates[ templName ];
        if ( !tokens ) {
            var msg = "[template not found: " + templName + "]";
            out.push( msg );
            Log.error( msg );
        }
        else
            Templ.renderTokens( tokens, context, out );
    },
    
    renderTokens: function( tokens, context, out ) {
        
        if ( tokens ) {
            for ( var i=0; i < tokens.length; i++ ) {
                var token = tokens[i];
                if ( typeof token === "string" ) {
                    out.push( token );
                }
                else {
                    try {
                        Templ.renderOneToken( token, context, out );
                    }
                    catch (e) {
                        Log.error('Error rendering token', token, 'context', context);
                        throw e;
                    }
                }
            }
        }
    },
    
    // Evaulates a given token. In the Liquid code, this is done in render
    // methods in each token class (Variable, Assign, If, etc.). For now, it
    // seemed unnecessary to create separate token classes on the client; instead, 
    // all that logic is here in a switch statement.
    renderOneToken: function( token, context, out ) {
                
        switch ( token.type ) {
        
        case "variable":
            if ( !token.name ) // not sure why, but Liquid does this check
                return;
            var value = Expression.eval(token.name, function(term) {return context.resolve(term)});  // context.resolve( token.name );
            var filters = Templ.filters;
            Iter.each( token.filters, function( filterToken ) {
                
                // resolve filter arguments
                var args = Iter.collect( filterToken[1], function( thisArg ) { 
                    return context.resolve( thisArg );
                } );
                var filterFn = filterToken[0] ? filters[ filterToken[0] ] : null;
                if ( !filterFn ) {
                    value = "[template error: filter not found: " + filterToken[0] + "]";
                    Log.error(value);
                }
                else {
                    // apply filter
                    args.unshift( value );
                    value = filterFn.apply( null, args );
                }
            } );

            if ( value != null ) {
                if ( $.isArray( value ) )
                    value = value.join(""); // matches Liquid's behavior
                out.push( value );
            }
            break;

        case "assign":
            //sdg TODO: handle nested scopes
            context.hash[ token.to ] = context.resolve( token.from );
            break;

        case "case":
        case "if":
            var blocks = token.blocks;
            for ( var i=0; i < blocks.length; i++ ) {
                var block = blocks[i];
                if ( Templ.evalCondition( block, context ) ) {
                    Templ.renderTokens( block.attachment, context, out );
                    break;
                }
            }
            break;

        case "for":
            var collection = context.resolve(token.collection_name);
            if (collection instanceof Templ.Range)
                collection = collection.expand();
            var nodelist = token.nodelist;
            var offset = token.attribs.offset != null ? context.resolve(token.attribs.offset) : 0;
            var limit = Math.max( collection.length - offset, 0 );
            if ( token.attribs.limit != null )
                limit = Math.min( limit, context.resolve(token.attribs.limit) );
            var collectionSlice = collection.slice( offset, offset + limit );
            if ( token.reversed )
                collectionSlice.reverse();
            context.stashLoopvars();
            for(var i=0; i<limit; i++)
            {
                context.hash[token.variable_name] = collectionSlice[i];
                context.hash.forloop = {
                    'length':  limit,
                    'index':   i+1,
                    'index0':  i,
                    'rindex':  limit - i,
                    'rindex0': limit - i - 1,
                    'first':   (i== 0),
                    'last':    (i == limit - 1)
                };
                Templ.renderTokens(nodelist, context, out);
            }
            context.restoreLoopvars();
            break;
        case "include":
            subtemplateName = context.resolve( token.template_name );
            Templ.renderInternal( subtemplateName, context, out );
            break;
        case "capture":
            var capture_out = []
            Templ.renderTokens(token.nodelist, context, capture_out);
            strval = "";
            for(var i=0; i<capture_out.length; i++)
                strval += capture_out[i];

             context.hash[ token.to ] = strval;

            break;

        case "ef":
            var blocks = token.blocks;
            for ( var i=0; i < blocks.length; i++ ) {
                var block = blocks[i];
                if ( Templ.evalNCondition( block, context ) ) {
                    Templ.renderTokens( block.attachment, context, out );
                    break;
                }
            }
            break;

        case "let":
            context.hash[ token.variable ] = Expression.eval(token.expression, function(term) {return context.resolve(term)});
            break;
            
        case "writejs":
            // for now, this tag does nothing on the client except write out its contents
            Templ.renderTokens(token.nodelist, context, out);
            break;
        }
    },

    evalNCondition: function( block, context ) {
        if ( block.type == "else_ncondition" )
            return true;
        return Templ.isTrue(Expression.eval(block.expression, function(term) {return context.resolve(term)}));
    },

    evalCondition: function( block, context ) {
        
        if ( block.type == "else_condition" )
            return true;
        
        var result;
        var left = context.resolve( block.left );
        var operator = block.operator;
        if ( !operator ) 
            result = Templ.isTrue( left ); // single variable
        else {
            var operatorFn = Templ.operators[ operator ];
            if ( !operatorFn ) {
                Log.error( "template: unrecognized operator: " + operator );
                return false;
            }
            var right = context.resolve( block.right );
            var result = operatorFn( left, right );
        }
        
        if ( block.child_relation == 'or' )
            result = Templ.isTrue( result ) || Templ.isTrue( Templ.evalCondition( block.child_condition, context ) );
        else if ( block.child_relation == 'and' )
            result = Templ.isTrue( result ) && Templ.isTrue( Templ.evalCondition( block.child_condition, context ) );
        return result;
    },
    
    // matches the liquid (and ruby) definition of truth
    isTrue: function( val ) {
        return val !== false && val != null; // 0 and "" are true
    },

    EMPTY: {
        equals : function(other) {
            if(other == this) return true;

            return(!other || other.toString() == "");
        }
    },

    // an integral range; end is inclusive
    Range: function( start, end ) {
        //sdg TODO: error checking
        this.start = start;
        this.end = end;

        this.expand = function() {
            var out = [];
            for (var i = this.start; i <= this.end; i++)
                out.push(i);
            return out;
        };
    },
    
    // see Liquid's condition.rb
    operators: {
        _equals : function( l,r ) {
            if(l == Templ.EMPTY) return l.equals(r);
            else if(r == Templ.EMPTY) return r.equals(l);
            else return l == r;
        },
        '==': function( l, r ) { return Templ.operators._equals(l,r); },
        '!=': function( l, r ) { return !Templ.operators._equals(l,r); },
        '<>': function( l, r ) { return !Templ.operators._equals(l,r); },
        '<' : function( l, r ) { return l < r; },
        '>' : function( l, r ) { return l > r; },
        '<=': function( l, r ) { return l <= r; },
        '>=': function( l, r ) { return l >= r; },
        'contains': function( l, r ) {
            if ( typeof l === "string" )
                return l.indexOf(r) >= 0;
            if ( $.isArray( l ) ) {
                for ( var i=0; i < l.length; i++ ) {
                    if ( l[i] == r ) 
                        return true;
                }
                return false;
            }
            if ( l instanceof Templ.Range )
                return r >= l.start && r <= l.end;
            return false; //sdg TODO: log possible error here
        }
    },

    // see standardfilters.rb and LiquidFilters.rb
    filters: {
        
        // Return the size of an array or of an string
        size: function( input ) {
            return input ? input.length : 0;
        },
        
        // Convert to lowercase
        downcase: function( input ) {
            return input != null ? input.toString().toLowerCase() : "";
        },
        
        // Convert to uppercase
        upcase: function( input ) {
            return input != null ? input.toString().toUpperCase() : "";
        },
        
        // HTML escape
        escape: function( input ) {
            return input != null ? Text.escapeHtml( input.toString() ) : ""; 
        },
        
        escape_html_attr: function( input ) {
            return Templ.filters.escape( input );
        },

        noblanks: function( input, aggressive ) {
            var s;
            if (aggressive) {
                s = input.replace(/(\n *)+/g, "").replace(/\n--/g, "\n");
            }
            else {
                s = input.replace(/(\n *)+/g, "\n").replace(/\n--/g, "\n")
            }
            return s;
        },
        
        // HTML remove
        strip_html: function( input ) {
            return input != null ? input.toString().replace( /<.*?>/g, '' ) : "";
        },
        
        strip_newlines: function( input ) {
            return input != null ? input.toString().replace( /\n/g, '' ) : "";
        },
        
        newline_to_br: function( input ) {
            return input != null ? input.toString().replace( /\n/g, "<br />\n" ) : "";
        },
        
        // creates a half-height line gap for double-newlines:
        newline_to_gap: function( input ) {
            return input != null ? input.toString().replace( /\n[\r\t ]*\n/g, '<br /><span class="lightweightBreak" /></span><br />' ).replace( /\n/g, "<br />\n" ) : "";
        },
        
        replace: function( input, str, repl ) {
            return Templ.filters.replace_regex( input, Text.regexpEscape( str ), repl );
        },

        replace_regex: function( input, str, repl ) {
            if ( input == null )
                return '';
            if ( repl == null )
                repl = '';            
            input = input.toString();
            var result = input.replace( new RegExp( str, "gm" ), repl );
            return result;
        },
        
        replace_first: function( input, str, repl ) {
            if ( repl == null )
                repl = '';
            return input != null ? input.toString().replace( str, repl ) : "";
        },
        
        remove: function( input, str ) {
            return Templ.filters.replace( input, str );
        }, 
        
        remove_first: function( input, str ) {
            return Templ.filters.replace_first( input, str );
        },        
        
        // URI encode
        encode_uri_c: function( input ) {
            // NOTE: for some reason this doesn't escape single quotes, while
            // the server-side version does
            return input != null ? encodeURIComponent( input ).replace( /'/g, "%27" ) : "";
        },
        
        // Join elements of the array with a delimiter
        join: function( input, glue ) {
            if ( glue == null )
                glue = " ";
            return $.isArray( input ) ? input.join( glue ) : input;
        },

        // Sort elements of the array 
        sort: function( input ) {
            function comparator( a, b ) {
                if ( a > b ) return 1;
                if ( a < b ) return -1;
                return 0;
            }
            return $.isArray( input ) ? input.slice(0).sort( comparator ) : input;
        },
        
        // Returns the first element of the array
        first: function( input ) {
            return $.isArray( input ) ? input[0] : null;
        },
        
        // Returns the last element of the array
        last: function( input ) {
            return $.isArray( input ) && input.length ? input[input.length - 1] : null;
        },

        edit_if_empty : function(input, club_id, fieldname, linktext) {
            if(input && input.length > 0)
            {
                return input;
            }

            return Templ.filters.edit_field(linktext, club_id, fieldname);
        },

        edit_field : function(linktext, club_id, fieldname) {
            return '<a href="/edit?id=' + club_id + '&focus=' + fieldname + '">' + linktext + '</a>';
        },

        date: function(date, format) {
            if (typeof date == "string")
                date = new Date(Date.parse(date));
            return Time.strftime(date, format);
        },

        // formats a date as a datetime
        ui_datetime: function( input ) {
            return input ? Time.toUi( input, false, true ) : ''; // use UTC to match server behavior
        },
        
        // formats a date as a date only
        ui_date: function( input, fourDigitYear ) {
            return input ? Time.toUiDate( input, fourDigitYear, true ) : ''; // use UTC to match server behavior
        },
        
        to_date: function( input ) {
            return new Date(input * 1000);
        },

        relative_day: function( input, format ) {
            return input ? Time.relative_day(input, format) : '';
        },

        relative_time: function( input, format ) {
            return input ? Time.relative_time(input, format) : '';
        },

        json: function( input ) {
            return Y.lang.JSON.stringify( input );
        },

        plural: function(input, si, pl) {
            if (pl == null)
                pl = si + "s";
            return input == "1" ? si : pl;
        },

        currency: function(input, currency, numeric, informal, terse) {
            // gracelessly defaults to US if the CurrencyData global is missing...
            if ( input == null ) return "";
            return TextFormat.currency ( input, window.CurrencyData ? CurrencyData.info[ currency || 'USD' ] : null, numeric, informal, terse );
        },
        
        truncate: function( input, len, ellipsis ) {
            ellipsis = ellipsis || "...";
            return Text.truncate( input, len, ellipsis );
        },
        
        add_query_parm: function(input, query_parm) {
            if (!input) {
                return "";
            }
            if (query_parm === null || query_parm.length == 0) return input;
            return input + (input.indexOf('?') > -1 ? '&' : '?') + query_parm;
        },
        
        mb: TextFormat.toMb,
        
        url: function(input, isHttps, prefix) {
            var key = !isHttps ? "url" : "https_url";
            if ( prefix ) {
                prefix = prefix + "";
                if ( prefix.charAt(prefix.length - 1) != "_" ) 
                    prefix = prefix + "_";
                key = prefix + key;
            }
            return input[key];
        },
        
        commafy: function(input) { return TextFormat.commafyNumber(''+input); },
        
        fan_link: function(input, style) {
            return "<a href='" + input.trackpipe_url + "' style='" + style + "'>" + input.name + "</a>";
        },
        
        html_autolink: function(input, link_attribs) {
            if (link_attribs == null || typeof link_attribs == "undefined") {
                link_attribs = ""
            }

            // escape any markup inside the input before performing linkification
            input = Text.escapeHtml(input);
            
            // this implementation was borrowed/tweaked from a jquery plugin (http://code.google.com/p/jquery-linkifier/source/browse/jquery.gn.linkifier.js).
            // that plugin expects to be operating on already formed DOM elements, but our client-side rendering is a bit different than that, and
            // we'd like to be able to do things like chain different filters together.  so, imitation and flattery and all, thanks jquery linkifier.
            // BS: one difference between this and the server-side equivalent is that this one doesn't auto-strip the protocol from the displayed text.
            
            //URLs starting with http:// or https://
            var replacePattern1 = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            var replacedText = input.replace(replacePattern1, '<a href="$1" ' + link_attribs + '>$1</a>');

            //URLs starting with www. (without // before it, or it'd re-link the ones done above)
            var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" ' + link_attribs + '>$2</a>');

            //Change email addresses to mailto:: links
            var replacePattern3 = /(\w+@[A-Z0-9_]+?\.[a-zA-Z]{2,6})/gim;
            replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
            
            return replacedText;
        },

        // aritmetic operations
        plus: function(a, b) {
            return(a + b);
        },
        minus: function(a, b) {
            return(a - b);
        },
        times: function(a, b) {
            return(a * b);
        },
        divided_by: function(a, b) {
            if(a == Math.floor(a) && b == Math.floor(b)) {
                return(Math.floor(a / b));
            } else {
                return(a / b);
            }
        },

        image: function(info, format) {
            var id_only = (typeof(info) == "number") || !info;
            var image_id = id_only ? info : info.image_id;

            var url = Templ.filters.image_url(image_id, format);

            if (id_only)
                return 'src="' + url + '"';
            else {
                var dims = ImageUtils.imageDimensions(info.width, info.height, format);
                return 'src="' + url + '" width="' + dims.width + '" height="' + dims.height + '"';
            }
        },
        image_url: function(image_id, format) {
            return ImageUtils.imageURL(image_id, format, Templ.current_context.resolve("is_https"));
        },

        art: function(art_id, format) {
            var url = Templ.filters.art_url(art_id, format)
            return 'src="' + url + '"';
        },
        art_url: function(art_id, format) {
            return ImageUtils.artURL(art_id, format, Templ.current_context.resolve("is_https"));
        },
        
        popup_image: function(info, format) {
            /* like image above, but for use in an <a> tag for popup images */
            var id_only = (typeof(info) == "number");
            var image_id = id_only ? info : info.image_id;

            var url = Templ.filters.image_url(image_id, format);

            if (id_only)
                return 'href="' + url + '"';
            else {
                var dims = ImageUtils.imageDimensions(info.width, info.height, format);
                return 'href="' + url + '" data-image-size="' + dims.width + ',' + dims.height + '"';
            }
        },
        
        image_width: function(info, format) {
            var dims = ImageUtils.imageDimensions(info.width, info.height, format);
            return dims.width;
        },
        
        image_height: function(info, format) {
            var dims = ImageUtils.imageDimensions(info.width, info.height, format);
            return dims.height;
        },

        possessify: function(name) {
            if (name === null || typeof name !== 'string'){
                return name;
            }
            return /s$/.test(name) ? (name + "'") : (name + "'s");
        },
        
        fan_page_url: function(username) {
            return Templ.current_context.resolve("siteroot_current") + "/" + username;
        },

        band_url: function (url_hints) {
            if (!url_hints) {
                return '';
            }
            // duplication of Domains.site_url_from_hash(url_hints, true, true, is_https)
            var customDomain = url_hints.custom_domain;
            var customDomainVerified = url_hints.custom_domain_verified;
            var subdomain = url_hints.subdomain;
            var customDomainsActive = Templ.current_context.resolve("custom_domains_active");
            var basePortStr = Templ.current_context.resolve("base_port_str") || '';
            var baseDomainWithPort = Templ.current_context.resolve("sitedomain");

            if (customDomainsActive && customDomain && customDomainVerified) {
                return 'http://' + customDomain + basePortStr;
            } else if (subdomain) {
                return location.protocol + '//' + subdomain + '.' + baseDomainWithPort;
            }
            return '';
        },

        tralbum_url: function (url_hints) {
            if (!url_hints) {
                return '';
            }
            // Duplication of Slug.page_url_from_slug(url_hints['item_type'], url_hints['slug'])
            var pagebase = "";
            if(url_hints.item_type === 'a') {
                pagebase = "/album/";
            } else if(url_hints.item_type === 't') {
                pagebase = "/track/";
            } else if(url_hints.item_type === 'p') {
                pagebase = "/merch/";
            }

            return Templ.filters.band_url(url_hints) + pagebase + url_hints.slug;
        },

        subscribe_url: function (url_hints) {
            if (!url_hints) {
                return '';
            }

            return Templ.filters.band_url(url_hints) + "/subscribe";
        },

        featured_track_url: function (url_hints, featured_track_number) {
            if (!url_hints) {
                return '';
            }

            return Templ.filters.tralbum_url(url_hints) + '?t=' + featured_track_number;
        }
    }
};

// aliases
Templ.filters.h = Templ.filters.escape; 
Templ.filters.a = Templ.filters.attr = Templ.filters.escape_html_attr;
Templ.filters.u = Templ.filters.encode_uri_c; 

// The template execution context; holds variable values.
// Equivalent to Liquid's Context.
Templ.Context = function( hash ) {
    this.hash = hash || {};
    this.loopvars = null;
};
    
Templ.Context.prototype = {
        
    // Resolves a literal value, or a variable reference, into a JS value.
    resolve: function( name ) {
        
        switch ( name ) {
        case null:
        case 'nil':
        case 'null':
        case '':
            return null;
        case 'true':
            return true;
        case 'false':
            return false;
        case 'empty':
            return Templ.EMPTY;
        }
        
        var match;
        // Single quoted strings
        if ( match = /^'(.*)'$/.exec(name) )
            return match[1];
        // Double quoted strings
        if ( match = /^"(.*)"$/.exec(name) )
            return match[1];
        // Integers
        if ( /^\d+$/.test(name) ) 
            return parseInt(name);
        // Ranges
        if ( match = /^\((\S+)\.\.(\S+)\)$/.exec(name) )
            return new Templ.Range( this.resolve(match[1]), this.resolve(match[2]) );
        // Floats (must follow Ranges, as its pattern also matches those)
        if ( /^(\d[\d\.]+)$/.test(name) ) 
            return parseFloat(name);
        
        return this.variable( name );
    },
    
    variable: function( nameExpr ) {
        
        // Our implementation here differs wildly from liquid's. It should
        // handle at least the common cases, however.
        
        // Look for the special .size, .first, or .last "methods".
        // Make an exception for the loop construct's forloop.first and forloop.last.
        var method;
        if ( !nameExpr.match( /^forloop[\[\.](first|last)$/ ) ) {
            var match = nameExpr.match( /\.(size|first|last)$/ );
            if ( match ) {
                method = match[1];
                nameExpr = nameExpr.substr( 0, match.index );
            }
        }
        
        //sdg TODO: these forms:
        //  foo.blah.fa (hash lookup)
        //  foo[blah][fa] (hash lookup)
        // TODO: this implements the above TODO, but is it safe?
        var val = null;
        try {
            val = eval("this.hash." + nameExpr);
        }
        catch (e) {
            try {
                //look for forms [xyz] and [abc.xyz] and add the context;
                //doesn't handle [abc[xyz]]
                val = eval("this.hash." + nameExpr.replace( /\[([\w.]+)\]/, "[this.hash.$1]" ));
            }
            catch (e) {
                // Presumably we're trying to look up a nonexistent intermediate object.
                // Liquid's behavior in this case is to output nothing, so we'll 
                // do the same. 
                Log.debug( "Failed template hash lookup: [" + nameExpr + "]; message: " + e.message );
            }
        }
        
        if ( method )
            val = Templ.filters[ method ]( val );
        
        return val;
    },

    stashLoopvars: function() {
        var vars = this.hash.forloop;
        if (vars) {
            this.loopvars = this.loopvars || [];
            this.loopvars.push(vars);
        }
    },

    restoreLoopvars: function() {
        if (this.loopvars)
            this.hash.forloop = this.loopvars.pop();
    }
};
;
/* ------------- BEGIN htmlembeddedplayer.js --------------- */;
var HTMLEmbeddedPlayer3 = function() {
    function HEP(playlist, params, playerdata) {
        var self = this;
        this._playlist = playlist;
        this._params = params;
        this._playerdata = playerdata;
        this._tracklistelems = []
        this._artist = playerdata.artist;

        this._elems = { }  // all elements we may be interested in
        this._root_elem = document.getElementById("player");

        // find all the elements we might need to refer to later
        for(var x in ALL_ELEMS) {
            var name = ALL_ELEMS[x];
            this._elems[name] = document.getElementById(name);
        }
    
        this._albumtitle = playerdata.album_title;

        this._hookup_ui();

        if(params.bgcol) {
            if(!params.transparent) {
                this._elems.player.style.background = "#"+params.bgcol;
            }

            if(Color.isDark(params.bgcol)) {
                addClass(document.body, "invertIconography");
                addClass(this._root_elem, "theme-dark");
            }
        }

        var is_twittercard = params.twittercard && params.twittercard == "true"

        var linkurl = playerdata.linkback + "?from=" + (is_twittercard ? "twittercard" : "embed");
        this._elems.maintextlink.href = linkurl;
        this._elems.subtextlink.href = linkurl;
        this._elems.tracknamelink.href = linkurl;
        this._elems.artlink.href = linkurl;
        $(this._root_elem).find(".artlink").attr("href", linkurl);
        this._elems.infolink.href = linkurl;
        $(this._root_elem).find(".logo").attr("href", linkurl);
        this._elems.logoalt.href = linkurl;
        this._elems.logoalt2.href = linkurl;
        this._elems.buyordownloadlink.href = playerdata.linkback + "?action=" + (playerdata.linkback_action ? playerdata.linkback_action : "download") + "&from=" + (is_twittercard ? "twittercard" : "embed");
        this._elems.buyordownloadlinkalt.href = this._elems.buyordownloadlink.href;
        this._elems.sharelink.href = playerdata.linkback + "?action=share" + "&from=" + (is_twittercard ? "twittercard" : "embed");
        this._elems.sharelinkalt.href = this._elems.sharelink.href;
        $(this._elems.sharelink).click(this._makehandler("_handle_share_click"));
        $(this._elems.sharelinkalt).click(this._makehandler("_handle_share_click"));

        if(playerdata.linkback_action) {
            var linkclass = playerdata.linkback_action == "buy" ? "buy" : "download";

//            $(this._elems.buyordownload).addClass(linkclass);
            $(this._root_elem).addClass(linkclass);
        
            this._elems.buyordownloadlink.innerHTML = ( playerdata.linkback_action == "buy" ? "buy" : "download" ); //UISTRING
            this._elems.buyordownloadlinkalt.innerHTML = ( playerdata.linkback_action == "buy" ? "buy" : "download" ); //UISTRING
        }
        else{
            this._elems.buyordownload.style.display = "none";
            this._elems.buyordownloadalt.style.display = "none";
        }

        var track_index = null;

        // support track=<trackid> param in album players for queueing
        // up a specific track.  Preferred to t=<index>
        if(params.album && params.track) {
            var target_id = Number(params.track);
            for(var i=0; i<playlist.length(); i++) {
                var info = playlist.get_track_info(i);
                if(info.id == target_id) {
                    params.t = i+1;
                    break;
                }
            }
        }

        if(params.t) {
            var t = Number(params.t) - 1;
            if(t >= 0 && t < playlist.length()) {
                track_index = t;
                playlist.set_initial_track(track_index);
            }
        }

        if(track_index != null && params.size == "small" && params.album) {
            // special case for small album player with the "t=" param: only play that one
            // track, plus change the tracknamelink to go to the track page instead of tralbum
            var info = playlist.get_track_info(track_index);
            this._elems.tracknamelink.href = info.title_link;

            // load the playlist as a single track
            playlist.load([info]);
        } else {

            // add list items
            for(var i=0; i<playlist.length(); i++) {
                var info = playlist.get_track_info(i);
                var item = this._create_playlist_item(info);
                var that = this;
                if(info.file) {
                    $(item).click( function (n) {
                        return function() { that._playlist.play_track(n); }
                    }(i));
                } else {
                    $(item).addClass("nostream");
                }
                $(this._elems.tracklist_ul).append(item);
                this._tracklistelems[info.tracknum + 1] = item;
            }
        }

        var wparam = params['width']
        if(wparam && wparam.match(/^[0-9]+$/)) {
            $(this._root_elem).css("width", wparam + "px");
        }

        var size = params['size'];
        var artparam = params['artwork'];
        var hastracklist = size == 'large' && (params['notracklist'] != 'true' && params['tracklist'] != 'false');
        var noartwork = (size == 'large' || size == 'medium') && (artparam == 'none' || artparam == 'false');
        var smallartwork = (size == 'medium' && artparam != 'none' && artparam != 'false');

        if (hastracklist) $(this._root_elem).addClass("hastracklist");
        if (noartwork) $(this._root_elem).addClass("noartwork");
        if (smallartwork) $(this._root_elem).addClass("smallartwork");

        if(params['package'] && playerdata.packages) {
            addClass(this._root_elem, "hasmerch");
            var pkgid = Number(params['package']);
            for(var i=0; i<playerdata.packages.length; i++) {
                var pkg = playerdata.packages[i];
                if(pkg.id != pkgid) continue;

                this._package = pkg;

                if(pkg.arts) {
                    for(var artidx = 0; artidx < pkg.arts.length; artidx++) {
                        var art = pkg.arts[artidx];
                        if(!art) continue;

                        var thumb = document.createElement("div");
                        var thumburl = ImageUtils.imageURL(art.image_id, 'art_thumbthumb');
                        addClass(thumb, "merchthumb");
                        thumb.style.backgroundImage = 'url(' + thumburl + ')';
                        var handler = function(ui,artidx,thumb) {
                                var th = thumb;
                                return function(e) {
                                    $(".merchthumb").removeClass("selected");
                                    // not clicking on same one that was already selected means select another
                                    if(ui._showing_package_image != artidx) {
                                        $(th).addClass("selected");
                                    }
                                    U.stopEvent(e);
                                    ui.toggle_package_image(artidx);
                                }
                            }(this,artidx,thumb);
                        $(thumb).click(handler);
                        this._elems.merch.appendChild(thumb);
                    }
                }

                break;
            }
        }


        if(this.isAlbum()) {
            addClass(this._root_elem, "albumplayer");
        } else {
            if($(this._root_elem).is(".classic")) {
                // classic track players use the same basic layout
                // whether they're part of an album or not
                addClass(this._root_elem, "trackplayer");
            } else if (this._albumtitle && this._albumtitle != "") {
                addClass(this._root_elem, "albumtrackplayer");
            } else {
                addClass(this._root_elem, "standalonetrackplayer");
            }
        }

        this._choose_size_classes();
        this._root_elem.style.display = "block";

        this._switch_track_artwork(track_index);

        this._setup_infolayer();
        this._adjust_tracklist();

        // some of this stuff needs to be reinitialized if the window resizes
        $(window).resize(function() {
                self._choose_size_classes();
                self._setup_infolayer();
                self._adjust_tracklist();
            });

        try {
            window.parent.postMessage("playerinited", "*");
        } catch (e) {
            Log.warn("failed to postMessage: " + e);
        }
    }
    
    HEP.prototype = {
        _switch_track_artwork : function(track_index) {
            /*
                switch the current track art to the one indicated by track_index.  Note
                that this does not necessarily involve a visible change -- if we are
                in a big player and showing a merch image, we just switch what artwork
                is currently active 
            */
            var self = this;
            $(this._root_elem).find(".art, #art").each(function(index,elem) {
                    elem = $(elem);

                    if(!elem.is(":visible")) {
                        return;
                    }

                    var artWidth = elem.width();
                    var elemId = elem.attr('id');

                    var arturl = self._track_art_url(track_index, artWidth);

                    if(elemId == "art") {
                        // special handling for id="art" because it
                        artWidth = $(self._elems.art).width();
                        Log.debug("art width = " + artWidth + " for elem", elem);
                        arturl = self._track_art_url(track_index, artWidth);

                        // stash the "active" (but not necessarily visible) url
                        // so that if we toggle package images off we can display it
                        self._original_art = arturl;

                        if(self._showing_package_image) {
                            // skip the change if we're showing a package image
                            return;
                        }
                    }

                    elem.css("backgroundImage", "url(" + arturl + ")");
                });
        },
        toggle_package_image : function(i) {
            if(this._showing_package_image == i) {
                this._elems.art.style.backgroundImage = 'url(' + this._original_art + ')';
                this._showing_package_image = null;
            } else {
                var pkg = this._package;
                this._elems.art.style.backgroundImage = 'url(' + ImageUtils.imageURL(pkg.arts[i].image_id, 'screen') + ')';
                this._showing_package_image = i;
            }
        },
        _hookup_ui : function() {
            $( this._elems.play).click(this._makehandler("_handle_play_click") );
            $( this._elems.tinyplayer).click(this._makehandler("_handle_tiny_click"));
            $( this._elems.next).click(this._makehandler("_handle_next_click"));
            $( this._elems.prev).click(this._makehandler("_handle_prev_click"));
            $("#artlink").click(this._makehandler("_handle_art_click"));
            $(".artlink").click(this._makehandler("_handle_art_click"));
            $("#artarea").click(this._makehandler("_handle_art_click"));
            $(".art").click(this._makehandler("_handle_art_click"));
            this._playlist.onstatechanged(this._handle_playlist_statechanged, this);
            this._playlist.ontime(this._handle_playlist_time, this);
            this._playlist.onloaded(this._handle_playlist_loaded, this);
            this._playlist.ontrackchanged(this._handle_playlist_trackchanged, this);
            this._playlist.onplaylistchanged(this._handle_playlist_playlistchanged, this);

            var track = this._playlist.get_track();
            this._handle_playlist_trackchanged(this._playerdata.tracks[track]);
            this._handle_playlist_time({ position: 0});

            // select all on focusing #shareurl
            $('#shareurl').focus(function () {
                $(this).select().one('mouseup', function (e) {
                    $(this).unbind('keyup');
                    e.preventDefault();
                }).one('keyup', function () {
                    $(this).select().unbind('mouseup');
                });
            });


            if(this._is_iphone()) {
                $(this._elems.timeline).on("touchstart", this._makehandler("_handle_seek_touchstart"));
            } else {
                $(this._elems.progbar_thumb).draggable({
                    start: this._makehandler("_handle_thumb_startdrag"),
                    drag: this._makehandler("_handle_thumb_drag"),
                    stop: this._makehandler("_handle_thumb_enddrag"),
                    containment: "parent",
                    axis: "x"
                });
            }
        },
        _adjust_tracklist : function() {
            if($(this._root_elem).hasClass("has_info_slider")) {
                // if we are showing the info slider, make sure we do
                // not show the tracklist regardless of what the params indicate
                $(this._root_elem).removeClass("hastracklist");
                return;
            }

            var viewheight = $(this._root_elem).height();
            var tl = $(this._elems.tracklist);
            var il = $(this._elems.infolayer);
            var ilbottom = il.position().top + il.outerHeight();
            var tltop = tl.position().top;
            var tlbottom = tl.outerHeight() + tltop;
            var bottom_pad = ($("#nonartarea").outerHeight() - $("#nonartarea").height());
            // ^^^ hack alert: need to compensate for the fact that #nonartarea
            // has bottom padding that tracklist is not bound by.  shorten the
            // height of tracklist by #nonartarea's inner/outer height diff.
            // Note that this breaks if #nonartarea ever gets top padding, but
            // we have not yet figured out a good way to do this in #tracklist css
            tl.css("height" , (viewheight - ilbottom - bottom_pad) + "px");
/*
             console.log("root element: ", this._root_elem);
             console.log("viewheight: ", viewheight);
             console.log("tltop: ", tltop);
             console.log("tlbottom: ", tlbottom);
             console.log("calc height: ", (viewheight - tltop));
*/             
        },
        _scroll_tracklist : function(tracknum) {
            var list = $("#tracklist");
            var li = $("#tracklist li")[tracknum-1];
            if(!li) return;

            var li_top = $(li).position().top - $("#tracklist").position().top;
            var li_bot = li_top + $(li).outerHeight();
            var listpos = list.scrollTop();
            var listheight = list.outerHeight();

            //console.log("scroll_tracklist: ", { li: li, index: tracknum, li_top: li_top, li_bot: li_bot, listpos: listpos, listheight: listheight});

            if(li_top < 0) {
                list.scrollTop(listpos + li_top);
            } else if(li_bot > listheight) {
                list.scrollTop(listpos + li_bot - listheight);
            }
        },
        _setup_infolayer : function() {
            removeClass(this._root_elem, "has_info_slider");
            removeClass(this._elems.infolayer, "fixed");

            var infolayer = $(this._elems.infolayer);
            var artwidth = $("#artarea").width();
            var artheight = $("#artarea").height();
            var playerwidth = $(this._root_elem).width();
            var playerheight = $(this._root_elem).height();

            // slider behavior is controlled by whether or not the art
            // takes up the entire player.  if it does, we allow the
            // slider setup to occur, otherwise, we stick the "fixed"
            // style on the infolayer and bail

            if(playerheight > artheight || playerwidth > artwidth) {
                addClass(this._elems.infolayer, "fixed");
                return;
            }

            var infopos = infolayer.position();

            var ix = infopos.left;
            var iy = infopos.top;
            var iw = infolayer.outerWidth();
            var ih = infolayer.outerHeight();

            this._infolayer_show_x = null;
            this._infolayer_show_y = null;

            if(ix < 0) {
                this._infolayer_show_x = 0;
            } else if(ix >= playerwidth) {
                //caluclate where to move layer to in x 
                this._infolayer_show_x = playerwidth - iw;
            }

            if(iy < 0) {
                this._infolayer_show_y = 0;
            } else if(iy >= playerheight) {
                //calculate where to move layer to in y
                this._infolayer_show_y = playerheight - ih;
            }            

            if(this._infolayer_show_x != null || this._infolayer_show_y != null) {
                addClass(this._root_elem, "has_info_slider");
                this._infolayer_hide_x = ix;
                this._infolayer_hide_y = iy;
                if(this._infolayer_show_x === null) this._infolayer_show_x = ix;
                if(this._infolayer_show_y === null) this._infolayer_show_y = iy;
                                                
                infolayer.css( { left : ix + "px", top : iy + "px", bottom: "auto"});
                
                $(this._root_elem).hover(this._makehandler("_handle_hover"), this._makehandler("_handle_unhover"));
                $(window).resize(this._makehandler("_handle_doc_resize"));
            }
        },
        _choose_size_classes : function() {
            // clear all classes this fn might set
            removeClass(this._elems.play, "big");

            if($(this._elems.play).width() > 35) {
                addClass(this._elems.play, "big");
            }
        },
        _handle_doc_resize : function() {
            if(this._infolayer_hide_x > 0) {
                var xoff = $(this._root_elem).width() - this._infolayer_hide_x;
                this._infolayer_hide_x += xoff;
                this._infolayer_show_x += xoff;
            }
            if(this._infolayer_hide_y > 0) {
                var yoff = $(this._root_elem).height() - this._infolayer_hide_y;
                this._infolayer_hide_y += yoff;
                this._infolayer_show_y += yoff;
            }
            if(this._infolayer_hide_x > 0 || this._infolayer_hide_y > 0) {
                this._handle_unhover();
            }
        },
        _makehandler : function(name) {
            var that = this;
            return function(event) {
                that[name].apply(that, [event]);
            };
        },
        _handle_hover : function() {
            if($(this._root_elem).hasClass("has_info_slider")) {
                var infolayer = $(this._elems.infolayer);
                infolayer.stop(true, false).delay(400).animate( {
                        left: this._infolayer_show_x + 'px',
                        top: this._infolayer_show_y + 'px',
                        opacity: '1'
                    }, 'fast', 'linear');
            }
        },
        _handle_unhover : function() {
            if($(this._root_elem).hasClass("has_info_slider")) {
                var infolayer = $(this._elems.infolayer);
                infolayer.stop(true, false).delay(1000).animate( {
                        left: this._infolayer_hide_x,
                        top: this._infolayer_hide_y,
                        opacity: '0'
                    });
            }
        },
        _handle_play_click : function(event) {
            U.stopEvent(event);
            this._playlist.playpause();
            this._hasplayed();
        },
        _handle_tiny_click : function(event) {
            if(event.target.id == "tinyplayer") {
                this._handle_play_click(event);
            }
        },
        _handle_next_click : function(event) {
            U.stopEvent(event);
            this._playlist.next_track();
            this._playlist.play();
            this._hasplayed();
        },
        _handle_prev_click : function(event) {
            U.stopEvent(event);
            this._playlist.prev_track();
            this._playlist.play();
            this._hasplayed();
        },
        _handle_art_click : function(event) {
            U.stopEvent(event);
            if( !this._classic ) {
                event.preventDefault();
                this._playlist.playpause();
                this._hasplayed();
            }
        },
        _handle_share_click : function(event) {
             var vw = $(this._root_elem).width();
             var vh = $(this._root_elem).height();
             if(!($(playerui._root_elem).is(".classic")) && vw >= 300 && vh >= 300) {
                 U.stopEvent(event);
                 $("#sharedialog").dialog({
                        width: "280px",
                        height: 210,
                        modal: true,
                        position:{at:"center", of: "#artarea"},
                        open: function(event, ui) {
                            $('.ui-widget-overlay').bind('click', function(){ $("#sharedialog").dialog('close'); });
                            if(!this._social_controls_inited) {
                                SocialControls.initFromDOM($("#sharedialog"));
                                $(".share-embed-container").show();
                                this._social_controls_inited = true;
                            }
                        }
                    });
            }
        },
        _handle_playlist_statechanged : function(arg) {
            switch(arg.newstate)
            {
                case "PLAYING":
                    addClass(this._root_elem, "playing");

                    removeClass(this._elems.play, "busy");
                    addClass(this._elems.play, "playing");
                    addClass(this._elems.tinyplayer, "playing");
                    break;
                case "BUFFERING":
                case "BUSY":
                    addClass(this._root_elem, "playing");

                    removeClass(this._elems.play, "playing");
                    addClass(this._elems.play, "busy");
                    addClass(this._elems.tinyplayer, "playing");
                    break;
                default:
                    removeClass(this._root_elem, "playing");

                    removeClass(this._elems.tinyplayer, "playing");
                    removeClass(this._elems.play, "busy");
                    removeClass(this._elems.play, "playing");
                    break;
            }

        },

        _handle_playlist_time : function(arg) {
            if(!this._dragging)
                this._trackpos = arg.position;
            if(arg.duration)
                this._tracklength = arg.duration;

            this._updateprog();
        },
        _handle_playlist_loaded : function(arg) {
            this._loadpercent = arg;
            this._updateprog();
        },
        _handle_playlist_trackchanged : function(trackinfo) {
            this._trackinfo = trackinfo;
            this._tracklength = trackinfo.duration;
            this._songtitle = trackinfo.title || "";
            var listelem = this._tracklistelems[this._currentTrack];
            if(listelem) {
                removeClass(listelem, "currenttrack");
            }
            this._currentTrack = trackinfo.tracknum + 1;
            this._scroll_tracklist(this._currentTrack);
            listelem = this._tracklistelems[this._currentTrack];
            if(listelem) {
                addClass(listelem, "currenttrack");
            }
            $('#tracklist .currenttrack .currenttime').html(this._timestr(0));
            this._numTracks = this._playlist.length;
            this._update_text();
            this._showhide_nextprev();

            this._switch_track_artwork(this._currentTrack - 1);
        },
        _handle_playlist_playlistchanged : function(arg) {
            // if the playlist changes, do the same as if the current track had changed.
            var ti = this._playlist.get_track_info();
            if(ti) {
                this._handle_playlist_trackchanged(ti);
            }
        },
        _handle_thumb_startdrag : function(event) {
            this._dragging = true;
            this._playlist.seeking = true;
            this._dragoffset = event.pageX - $(event.target).offset().left;
        },
        _handle_thumb_drag : function(event) {
            var progLeft = $(this._elems.timeline).offset().left;
            var progRange = $(this._elems.timeline).width() - $(this._elems.progbar_thumb).width();
            var pos = event.pageX - progLeft - this._dragoffset;
            if(pos < 0) pos = 0;
            else if (pos > progRange) pos = progRange;
            pos *= (this._tracklength / progRange);
            this._trackpos = pos;
            this._updateprog();
        },
        _handle_thumb_enddrag : function(event) {
            this._playlist.seek(this._trackpos);
            this._dragging = false;
            this._playlist.seeking = false;
            this._hasplayed();
        },
        _create_playlist_item : function(trackinfo) {
            var item = $('<li>');
            var title = Text.escapeHtml(trackinfo.title);
            if(trackinfo.artist && trackinfo.artist != "" && trackinfo.artist != this._artist) {
                title = Text.escapeHtml(trackinfo.artist) + " &mdash; " + title;
            }
            item.append($('<span>', { "class": "tracknum", text: (trackinfo.tracknum + 1 + '.') }));
            item.append($('<a>', {"href": "#"})
                .append($('<span>', {"class": "tracktitle", html: title}))
                .append($('<span>', {"class": "currenttime"}))
                .append($('<span>', {"class": "tracktime", text: this._timestr(trackinfo.duration)})));

            return item;
        },
        _handle_seek_touchstart : function(event) {
            event.preventDefault();
            var timeline = $(this._elems.timeline);
            this._seek_move_handler = this._makehandler("_handle_seek_touchmove");
            this._seek_end_handler = this._makehandler("_handle_seek_touchend");
            this._seek_cancel_handler = this._makehandler("_handle_seek_touchcancel");
            timeline.on("touchmove", this._seek_move_handler);
            timeline.on("touchend", this._seek_end_handler);
            timeline.on("touchcancel", this._seek_cancel_handler);

            this._playlist.seeking = true;
            this._dragging = true;

            this._dragtimerhandler = this._makehandler("_handle_drag_timeout");
            this._dragtimer = setTimeout(this._dragtimerhandler, 1000);
        },
        _handle_seek_touchmove : function(e) {
            var event = e.originalEvent;
            var thisX = event.changedTouches[0].pageX;
            var obj = this._elems.timeline;
            var thumbWidth = this._elems.progbar_thumb.clientWidth;
            var scrollMin = thumbWidth / 2;
            do { scrollMin += obj.offsetLeft; } while(obj = obj.offsetParent);
            var scrollMax = scrollMin + this._elems.timeline.clientWidth - thumbWidth;


            var frac = (thisX - scrollMin) / (scrollMax - scrollMin);
            if(frac > 1) frac = 1;
            else if (frac < 0) frac = 0;
            
            this._trackpos = this._tracklength * frac;
            this._updateprog();

            clearTimeout(this._dragtimer);
            this._dragtimer = setTimeout(this._dragtimerhandler, 1000);
        },
        _handle_seek_touchend : function(event) {
            clearTimeout(this._dragtimer);
            this._finishdrag(true);
        },
        _handle_seek_touchcancel : function(event) {
            this._finishdrag(false);
        },
        _handle_drag_timeout : function(event) {
            this._finishdrag(true);
        },
        _finishdrag : function(doseek) {
            var timeline = this._elems.timeline;
            timeline.off("touchmove", this._seek_move_handler);
            timeline.off("touchend", this._seek_end_handler);
            timeline.off("touchcancel", this._seek_cancel_handler);

            this._playlist.seeking = false;
            this._dragging = false;
            if(doseek) {
                if(this._trackpos == this._tracklength) {
                    this._playlist.next_track();
                } else if (this._trackpos == 0 && this._seekorigpos < 3) {
                    this._playlist.prev_track();
                } else {
                    this._playlist.seek(this._trackpos);
                }
                this._hasplayed();
            }
        },
        isAlbum : function() {
            return !!(this._params.album);
        },
        _update_text : function() {
            var title = Text.escapeHtml(this._songtitle || "");
            if(this._trackinfo.artist && this._trackinfo.artist != "" && this._trackinfo.artist != this._artist) {
                title = Text.escapeHtml(this._trackinfo.artist) + " &mdash; " + title;
            }
            if(this.isAlbum()) {
                this._elems.maintextlink.innerHTML = Text.escapeHtml(this._albumtitle || "");

                this._elems.tracknamelink.innerHTML = Text.escapeHtml(this._songtitle || "");
                this._elems.currenttitle_title.innerHTML = title;
                this._elems.currenttitle_tracknum.innerHTML = Text.escapeHtml(this._currentTrack.toString() || "") + ".";
            } else {
                this._elems.maintextlink.innerHTML = Text.escapeHtml(this._songtitle || "");

                this._elems.currenttitle_title.innerHTML = title;
                this._elems.currenttitle_tracknum.innerHTML = Text.escapeHtml(this._currentTrack.toString() || "") + ".";
            }
            this._elems.subtextlink.innerHTML = Text.escapeHtml(this._trackinfo.artist || "");
            this._elems.artist.innerHTML = Text.escapeHtml(this._artist || "");
            this._elems.album.innerHTML = Text.escapeHtml(this._albumtitle || "");
        },
        _updateprog : function() {
            var fillwidth = $("#timeline .progbar_empty").width(); //this._elems.timeline.offsetWidth;
            var thumbrange = fillwidth - this._elems.progbar_thumb.offsetWidth;
            var thumbpos = this._tracklength ? ((this._trackpos / this._tracklength) * thumbrange) : 0;
            this._elems.progbar_thumb.style.left = Math.round(thumbpos) + "px";
            this._elems.progbar_fill.style.width = (this._loadpercent || 0) + "%";
            this._elems.currenttime.innerHTML = this._timestr(this._trackpos);
            this._elems.totaltime.innerHTML = this._timestr(this._tracklength);

            if(!this._playlist.seeking) {
                var loadedlength = (this._loadpercent / 100) * this._tracklength;
                // playedpct is calculated as a percent of loaded audio
                var playedpct = loadedlength > 0 ? (100 * (this._trackpos / loadedlength)) : 0;
                this._elems.progbar_fill_played.style.width = playedpct + "%";
            }
            $('#tracklist .currenttrack .currenttime').html(this._timestr(this._trackpos));
        },
        _showhide_nextprev : function() {
            var cur = this._playlist.get_track();
            var first = this._playlist.first_playable_track;
            var last = this._playlist.last_playable_track;

            if(this._elems.prev)
                this.showhide_elem(this._elems.prev, first >= 0 && cur > first);
            if(this._elems.next)
                this.showhide_elem(this._elems.next, last >= 0 && cur < last);
        },
        showhide_elem : function(elem, bShow) {
            if(bShow) {
                removeClass(elem, "hiddenelem");
            } else {
                addClass(elem, "hiddenelem");
            }
        },
        _timestr : function(sec) {
            var str = "";

            //match the behavior of the server: truncate fractions away.
            sec = Math.floor(sec);
            while(sec > 0)
            {
                var part = (sec % 60)
                var partstr = part.toString();
                if(partstr.length < 2) partstr = "0" + partstr;
                if(str.length > 0)
                {
                    str = partstr + ":" + str;
                }
                else
                {
                    str = partstr;
                }

                sec -= part;
                sec /= 60;
            }
            if(str.length == 0)
                str = "00:00";
            else if(str.length < 3)
                str = "00:" + str;

            return str;
        },
        _is_iphone : function() {
            return Browser.platform == "iphone";
        },
        _hasplayed : function() {
            removeClass(this._root_elem, "initialstate");
        },
        _track_art_url : function(track_index, width) {
            var artid = null;
            if(track_index != null) {
                var track = this._playerdata.tracks[track_index];
                artid = track && track.art_id;
            }

            if(!artid) {
                var track = this._playlist.get_track();
                artid = this._playerdata.album_art_id || this._playerdata.tracks[track].art_id;
            }

            var artformat = find_art_format(width);
            return ImageUtils.artURL(artid, artformat);
        }
    };

    function find_art_format(width) {
        var found = null;
        var squarethumbs = [];

        // collect a list of the share thumb formats
        for(var i=0; i<TemplGlobals.image_formats.length; i++) {
            var fmt = TemplGlobals.image_formats[i];
            if(fmt.resize_algo == "thumb" && fmt.height == fmt.width) {
                squarethumbs.push(fmt);
            }
        }
        // sort by size
        squarethumbs.sort(function(a,b) { return a.width - b.width; });

        // find the smallest one that is larger than our target
        for(var i=0; i<squarethumbs.length; i++) {
            if(squarethumbs[i].width >= width) {
                return squarethumbs[i].name;
            }
        }

        // none big enough found; return largest
        return squarethumbs[squarethumbs.length-1].name;
    }

    var addClass = function(elem, toadd) {
        $(elem).addClass( toadd );
    };
    var removeClass = function(elem, toremove) {
        $(elem).removeClass( toremove );
    };
    var ALL_ELEMS = [
            "prev",
            "next",
            "play",
            "art",
            "artarea",
            "artlink",
            "artist",
            "trackname",
            "tracknamelink",
            "album",
            "maintext",
            "maintextlink",
            "subtext",
            "subtextlink",
            "logoalt",
            "logoalt2",
            "currenttitle",
            "currenttime",
            "totaltime",
            "timeline",
            "linkarea",
            "linkareaalt",
            "tracklist",
            "tinyplayer",
            
            "progbar_thumb",
            "progbar_fill",
            "progbar_fill_played",
            "currenttitle_tracknum",
            "currenttitle_title",
            "buyordownload",
            "buyordownloadalt",
            "buyordownloadlink",
            "buyordownloadlinkalt",
            "share",
            "sharealt",
            "sharelink",
            "sharelinkalt",
            "infolink",
            "player",
            "tracklist_ul",
            "merch",
            "infolayer"
        ];

    HEP.init = function(playerdata, parentpage, params) {
            Sound.whenloaded( function(status) {
                if(playerdata && status.success) {
                    var soundplayer = new Sound.SoundPlayer();
                    var isalbum = !!(params.album);
                    var statsource = isalbum ? "embedded album player" : "embedded track player";
                    var playlist = new Player.Playlist(soundplayer, statsource, parentpage);
                    playlist._trackstate = false;

                    for(var i=0; i<playerdata.tracks.length; i++) {
                        var index = playlist.add_track(playerdata.tracks[i]);
                        if (!params.t && playerdata.tracks[i].id === playerdata.featured_track_id) {
                            playlist.set_initial_track(index);
                        }
                    }
                    if(params['extratracks']) {
                        for(var i=playerdata.tracks.length; i < 20; i++) {
                            playlist.add_track(playerdata.tracks[i % playerdata.tracks.length]);
                        }
                    }

                    var playerui = new HTMLEmbeddedPlayer3(playlist, params, playerdata);
                    playlist.init_complete();

                    if(params.twittercard) {
                        //small hack.  we know twittercard means 'standard', so let's
                        //set the viewport meta tag to the right aspect ratio
                        var h = $("#player").width() * 470 / 350;
                        var meta = "width=device-width,height=" + h;
                        $("#viewportmeta").attr('content', meta);
                    }
                } else if(!playerdata) {
                    document.getElementById("badtralbumerror").style.visibility = "visible";
                } else {
                    document.getElementById("badbrowsererror").style.visibility = "visible";
                }
            });
    }

    return HEP;
}();
;
/* ------------- BEGIN share_external.js --------------- */;

var FacebookUtils = {
    _sdkLoadPromise: null,
    resizeTimer: null,

    // Loads the FB JavaScript API, returning a jquery Promise object which callers can subscribe to.
    // Can be called safely multiple times.
    initSDK: function() {
        if (FacebookUtils._sdkLoadPromise)
            return FacebookUtils._sdkLoadPromise;

        var dfd = new $.Deferred();
        window.fbAsyncInit = function() {
            // Facebook's JS calls this method automatically when their API is ready
            Log.debug("Facebook SDK loaded");
            FB.init({appId: "165661066782720", status: true, cookie: true, xfbml: false});
            dfd.resolve();
        };
        $(document.body).prepend('<div id="fb-root"></div>'); // required by the API

        // NOTE: we are not using the #xfbml=1 hash on the URL. I *think* this means that the FB JS won't automatically
        // search the DOM for social plugins and such. Call FB.XFBML.parse after the API loads to do this manually.
        // - sdg 2012.10.25

        $.cachedScript("//connect.facebook.net/en_US/all.js");
        return FacebookUtils._sdkLoadPromise = dfd.promise();
    },

    initFbApp: function() {

        FacebookUtils.initSDK().done( function() {
                FacebookUtils.reportResize();
        });
    },
    
    onGeneric: function( response ) {
        Log.note("some sort of event");
    },

    reportResize: function() {

        if( FacebookUtils.resizeTimer ) {
            clearTimeout(FacebookUtils.resizeTimer);
        }

        FacebookUtils.resizeTimer = setTimeout( function() {

                if ( $("body.fb").height() ){
                    var dims = { height: $("body.fb").height() + 40, width: $("body.fb").width() } ;

                    Log.note( "reportResize cb: resize timer: " + FacebookUtils.resizeTimer + " setting height FB canvas tab to: " + dims.height + "," + dims.width );
                    FB.Canvas.setSize( dims );
                }

                clearTimeout( FacebookUtils.resizeTimer );
                FacebookUtils.resizeTimer = null;

            }, 50);
    },
    
    inAppNav: function(pageType, paths, params){
        // pageType : "album", "track", "merch"
        // paths: slugtext 
        // params: bid = < band_id > 
        
        var path = pageType;
        
        if ( paths && paths.length > 0 )
            path += ( "/" + paths.join("/") );
        
        if ( FacebookData && FacebookData.referer )
            params["ref"] = FacebookData.referer;

        SimpleForm.submit("/fb_tab/" + path, params, "GET");

        // avoid a jerky landing, or in an unexpected place
        if( FacebookData ) {
            $("body").hide();
            FB.Canvas.scrollTo(0,0);
        } 
    },
    
    correctSrollThen: function(patchYui, _this, interceptedFn /*, list all your functions arguments here: arg1, arg2, arg3, ...  */) {

        var args = Array.prototype.slice.call(arguments); 
        args.shift(), args.shift(), args.shift();
        
        FacebookData.positionInfo = null;

        FB.Canvas.getPageInfo( 
            function( info ) {
                
                FacebookData.positionInfo = info;
                
                if ( patchYui ) {
                    _getDocumentScrollTop = Y.util.Dom.getDocumentScrollTop;
                    _getViewportHeight = Y.util.Dom.getViewportHeight;
                    _getDocumentHeight = Y.util.Dom.getDocumentHeight;
                    
                    var iScrollTop = parseInt(info.scrollTop);
                    Y.util.Dom.getDocumentScrollTop = function(){ return iScrollTop; };
                    
                    var iClientHeight = parseInt(info.clientHeight);
                    Y.util.Dom.getViewportHeight = function(){ return iClientHeight; };
                    
                    //todo: bs: etc: get some metric on visible height. this number seems to be
                    //               artificially large for facebook pages. I'm faking it here.
                    Y.util.Dom.getDocumentHeight = function(){ return iClientHeight*3; };
                }
                
                if (interceptedFn) {
                    
                    el = interceptedFn.apply(_this, args );
                    if( el )
                        FacebookUtils.fixCentering( el ); /* sometimes required (ie, YUI Dialogs) */
                    
                    if ( patchYui ) {
                        Y.util.Dom.getDocumentScrollTop = _getDocumentScrollTop ;
                        Y.util.Dom.getViewportHeight = _getViewportHeight ;
                        Y.util.Dom.getDocumentHeight = _getDocumentHeight                        
                    }
                    return el;
                }
                    
            });
    }, 

    fixCentering: function( el ) { 

        if ( el.element )
            el = el.element;
            
        if ( window.FacebookData.positionInfo ) {
            var scrollTop = parseInt(FacebookData.positionInfo.scrollTop);
            $("#"+el.id).css( {top: scrollTop} ); 

            // hack: the yui seems to alter the page geometry (not always, but when scroll amount is relatively small)
            FB.Canvas.scrollTo( 0, scrollTop ); 
            
        }
             
    }, 
    
    xxx: null
};

var GPlusUtils = {
    _sdkLoadPromise: null,

    // Loads the Google Plus JavaScript API, returning a jquery Promise object which callers can subscribe to. 
    // Can be called safely multiple times.
    initSDK: function(fn) {
        if (GPlusUtils._sdkLoadPromise)
            return GPlusUtils._sdkLoadPromise;
        window.___gcfg = { parsetags: 'explicit' };
        var promise = $.cachedScript("https://apis.google.com/js/plusone.js").promise().done( function() {
            Log.debug("Google Plus SDK loaded");
        });
        return GPlusUtils._sdkLoadPromise = promise;
    },

    xxx: null
};

var EmailIMUtils = {
    
    alreadyStattedFromFocus : false,
    
    onFocus: function() {
        if (!self.alreadyStattedFromFocus) {
            Stats.record({kind:"click", click: "email_tralbum"});
            self.alreadyStattedFromFocus = true;
        }
        return false;
    },
    
    xxx: null
};



;
/* ------------- BEGIN social_controls.js --------------- */;
/*

SocialControls -- a module for easily generating social widgets: Facebook Like and Share buttons, Tweet buttons, Tumblr
and Google Plus buttons. There are two ways to use this module:

-- OPTION 1: Call methods directly

The static render* methods, below, can be called directly to render individual controls. See each method for 
supported options.

-- OPTION 2: DOM configuration

This module expects a specific HTML DOM structure and class names. When that DOM subtree is passed into
the initFromDOM() method, we generate the social controls. All options for the various controls are passed in 
either via data-* attributes or class names.

Here's the minimal HTML required to display all our supported controls. Note that the HTML does not need to be a list,
but it often makes sense to use one. Also notice that the HTML is basically empty -- since some of the controls are 
rendered client-side only (FB Like, GPlus), it made sense to handle all rendering in JS.

<ul class="social-controls">
    <li class="facebook-like-ctrl"></li>
    <li class="facebook-share-ctrl"></li>
    <li class="twitter-ctrl"></li>
    <li class="tumblr-ctrl"></li>
    <li class="gplus-plusone-ctrl"></li>
    <li class="gplus-share-ctrl"></li>
</ul>

The FB Like and GPlus buttons are rendered by the those services, subject to their supported options, so we have limited
control over how they appear. The other buttons are rendered as <a> tags, and can be styled however you like. For
twitter and tumblr, add a "btn" class to the *-ctrl element to pick up our standard CSS for that button.

Here's an example decorated with various options. Note that the data attributes can go at either level. At the top
level they're shared between all controls, and can be overridden at the lower level.

<ul class="social-controls" data-url="http://some.url.to.share" data-text="Check out this crazy thing!">
    <li class="facebook-like-ctrl" data-layout="standard" data-colorscheme="dark"></li>
    <li class="facebook-share-ctrl btn"></li>
    <li class="twitter-ctrl btn"></li>
    <li class="tumblr-ctrl btn" data-url="http://some.other.url.just.for.tumblr" data-title="My Cool Page"></li>
    <li class="gplus-plusone-ctrl" data-size="tall"></li>
</ul>

For a list of supported data attributes, see the comments above each of the render methods, below.

Prerequisites: share_external.js, share_controls.css (for .btn styles)

*/

var SocialControls = {

    initFromDOM: function(root) {
        var self = this,
            $root = $(root),
            $containers = $root.add(".social-controls", $root).filter(".social-controls");

        $containers.each( function() {
            var $cont = $(this);
            self._initControlsOfType($cont.find(".facebook-like-ctrl"), "renderFacebookLike");
            self._initControlsOfType($cont.find(".facebook-share-ctrl"), "renderFacebookShare");
            self._initControlsOfType($cont.find(".twitter-ctrl"), "renderTwitterShare");
            self._initControlsOfType($cont.find(".tumblr-ctrl"), "renderTumblrShare");
            self._initControlsOfType($cont.find(".gplus-ctrl, .gplus-plusone-ctrl"), "renderGPlusPlusOne");
            self._initControlsOfType($cont.find(".gplus-share-ctrl"), "renderGPlusShare");
            self._initControlsOfType($cont.find(".email-ctrl"), "renderEmailShare");
        });
    },

    //
    //// "static" render methods which can be called directly, if desired
    //

    // Renders a FB Like button.
    // data.url - optional, the URL to Like (defaults to current page)
    // data.stat - optional, the StatClick name to stat when the user Likes something
    // data.statOff - optional, the StatClick name to stat when the user unLikes something
    // Other, optional data properties match FB's documentation
    //    see: https://developers.facebook.com/docs/reference/plugins/like/
    renderFacebookLike: function(elem, data) {
        var self = this,
            $elem = $(elem),
            // The min width for the FB Like button is supposedly 90px, but it appears they do try to collapse 
            // it narrower when appropriate
            dataDefaults = { url: location.href, send: "false", layout: "button_count", width: "90", "show-faces": "false" },
            data = $.extend(dataDefaults, data),
            // create the Like button placeholder element
            $like = $('<div class="fb-like"></div>').appendTo($elem);

        // set up the Like button's HTML5 data attributes
        $.each(data, function(key, val) { 
            if (key == "url")
                key = "href";
            $like.attr("data-" + key, val);
        });

        FacebookUtils.initSDK().done( function() {
            FB.XFBML.parse( $elem[0] );
            self._registerFBEventHandlers(elem, data);
            $elem.data("scResolvedData", data);  // stash data for later use by FB event handlers
            Log.debug("SocialControls: rendered Facebook Like button");
        });
    },

    // Renders a Facebook "share" button or link (different from the Like button, above).
    // data.url - optional, the URL to share (defaults to current page)
    // data.stat - optional, the StatClick name to stat when the user clicks the button (data.statOff is not supported)
    renderFacebookShare: function(elem, data) {
        // TODO: we should probably use the newish "Feed Dialog" here instead: 
        // https://developers.facebook.com/docs/reference/dialogs/feed/
        var self = this,
            $elem = $(elem),
            dataDefaults = { url: location.href },
            data = $.extend(dataDefaults, data),
            params = { u: data.url },
            isDesktop = (!window.MediaView || MediaView.mode == "desktop"),
            fbUrl = Url.addQueryParams(isDesktop ? "http://www.facebook.com/sharer.php" : "http://m.facebook.com/sharer.php", params);

        // use the existing link element if it exists, otherwise add it
        var $fbLink = $elem.find(".facebook-link").first();
        if (!$fbLink.length)
            $fbLink = $('<a class="facebook-link" title="Share on Facebook">Share</a>').appendTo($elem);

        $fbLink.attr({"href": fbUrl, "target": "_blank"}).click( function(ev) {
            self._statClick(data, "on");
            if (isDesktop) {
                window.open(fbUrl, "share_fb", "toolbar=0,status=0,width=626,height=436");
                ev.preventDefault();
            }
            // else, for phones, fall back to the default link behavior
        });
        Log.debug("SocialControls: rendered Twitter share button");
    },

    // Renders a tweet button or link.
    // data.url - optional, the URL to share (defaults to current page)
    // data.text - optional, additional tweet text (subject to Twitter's length limit)
    // data.stat - optional, the StatClick name to stat when the user clicks the button (data.statOff is not supported)
    renderTwitterShare: function(elem, data) {
        var self = this,
            $elem = $(elem),
            dataDefaults = { url: location.href },
            data = $.extend(dataDefaults, data),
            params = { url: data.url },
            isDesktop = (!window.MediaView || MediaView.mode == "desktop");
        if (data.text)
            params.text = data.text;
        var twUrl = Url.addQueryParams("https://twitter.com/intent/tweet", params);

        // use the existing link element if it exists, otherwise add it
        var $twLink = $elem.find(".twitter-link").first();
        if (!$twLink.length)
            $twLink = $('<a class="twitter-link" title="Share on Twitter">Tweet</a>').appendTo($elem);

        $twLink.attr({"href": twUrl, "target": "_blank"}).click( function(ev) {
            self._statClick(data, "on");
            if (isDesktop) {
                window.open(twUrl, "share_tw", "toolbar=0,status=0,width=550,height=450");
                ev.preventDefault();
            }
            // else, for phones, fall back to the default link behavior
        });
        Log.debug("SocialControls: rendered Twitter share button");
    },

    // Renders a Tumblr share button or link.
    // data.type - optional, "link" or "audio" (shares an audio player); defaults to "link"
    // data.url - optional, the URL to share (defaults to current page)
    // data.text - optional, caption/description text
    // data.title - optional, the title of the page you're sharing (type == "link" only)
    // data.stat - optional, the StatClick name to stat when the user clicks the button (data.statOff is not supported)
    renderTumblrShare: function(elem, data) {
        var self = this,
            $elem = $(elem),
            dataDefaults = { url: location.href, type: "link" },
            data = $.extend(dataDefaults, data),
            params = {};

        if (data.type == "audio") {
            // I'm not sure why these param names differ from those used for link shares, below. I'm copying what
            // we currently use.  - sdg 2013.05.01
            params.external_url = data.url;
            if (data.text)
                params.caption = data.text;
        }
        else {
            params.url = data.url;
            if (data.title)
                params.name = data.title;
            if (data.text)
                params.description = data.text;
        }
        var tmUrl = Url.addQueryParams("http://www.tumblr.com/share/" + data.type, params);

        // use the existing link element if it exists, otherwise add it
        var $tmLink = $elem.find(".tumblr-link").first();
        if (!$tmLink.length)
            $tmLink = $('<a class="tumblr-link" title="Share on Tumblr">Share on Tumblr</a>').appendTo($elem);

        $tmLink.attr({"href": tmUrl, "target": "_blank"}).click( function(ev) {
            self._statClick(data, "on");
        });
        Log.debug("SocialControls: rendered Tumblr share button");
     },

    // Renders a Google Plus "+1" button
    // data.url - optional, the URL to Like (defaults to current page)
    // data.stat - optional, the StatClick name to stat when the user +1's something
    // data.statOff - optional, the StatClick name to stat when the user clears the +1
    // Other, optional data properties match Google's documentation
    //    see: https://developers.google.com/+/web/+1button/#plusonetag-parameters
    renderGPlusPlusOne: function(elem, data) {
        var self = this,
            $elem = $(elem),
            dataDefaults = { url: location.href, size: "medium", annotation: "none" },
            data = $.extend(dataDefaults, data),
            params = {};

        $.each(data, function(key, val) { 
            if (key == "url")
                key = "href";
            params[key] = val;
        });

        params.callback = function(info) {
            // data.state is "on" (+1) or "off" (removal of +1)
            self._statClick(data, info.state);
        };

        GPlusUtils.initSDK().done( function() {
            gapi.plusone.render($elem[0], params);
            Log.debug("SocialControls: rendered Google Plus +1 button");
        });
    },

    // Renders a G+ share button or link.
    // data.url - optional, the URL to share (defaults to current page)
    // data.stat - optional, the StatClick name to stat when the user clicks the button (data.statOff is not supported)
    renderGPlusShare: function(elem, data) {
        var self = this,
            $elem = $(elem),
            dataDefaults = { url: location.href },
            data = $.extend(dataDefaults, data),
            params = { url: data.url },
            isDesktop = (!window.MediaView || MediaView.mode == "desktop");
        var gpUrl = Url.addQueryParams("https://plus.google.com/share", params);

        // use the existing link element if it exists, otherwise add it
        var $gpLink = $elem.find(".gplus-link").first();
        if (!$gpLink.length)
            $gpLink = $('<a class="gplus-link" title="Share on Google+">Google+</a>').appendTo($elem);

        $gpLink.attr({"href": gpUrl, "target": "_blank"}).click( function(ev) {
            self._statClick(data, "on");
            if (isDesktop) {
                window.open(gpUrl, "share_gp", "menubar=0,toolbar=0,resizable=1,scrollbars=1,height=460,width=600");
                ev.preventDefault();
            }
            // else, for phones, fall back to the default link behavior
        });
        Log.debug("SocialControls: rendered G+ share button");
    },

    // Renders an Email button or link (primarily intended for use on phones).
    // data.url - optional, the URL to share (defaults to current page)
    // data.text - optional, additional email body text to come before the URL in the email body
    // data.subject - optional, the email subject text
    // data.stat - optional, the StatClick name to stat when the user clicks the button
    renderEmailShare: function(elem, data) {
        var self = this,
            $elem = $(elem),
            dataDefaults = { url: location.href },
            data = $.extend(dataDefaults, data),
            params = {"body": data.url};

        if (data.text)
            params.body = data.text + "\n\n" + params.body;
        if (data.subject)
            params.subject = data.subject;
        var emailUrl = "mailto:?" + Url.joinQuery(params);

        // use the existing link element if it exists, otherwise add it
        var $emailLink = $elem.find(".email-link").first();
        if (!$emailLink.length)
            $emailLink = $('<a class="email-link" title="Share via email">Email</a>').appendTo($elem);

        $emailLink.attr({"href": emailUrl}).click( function(ev) {
            // The stat call might not always work, because of the race condition with the page navigation.
            // To try to increase its chances, delay the page navigation for an instant.
            self._statClick(data, "on");
            setTimeout( function() { location.href = emailUrl; }, 100 );
            return false;
        });
        Log.debug("SocialControls: rendered Email share button");
    },

    //// end static utilities

    _initControlsOfType: function(elems, renderMethodName) {
        var self = this;
        $(elems).each( function() {
            self[renderMethodName](this, self._getData(this));
        });
    },

    _getData: function(elem, defaults) {
        var $elem = $(elem),
            elemData = $elem.data(),
            shareData = $elem.closest(".social-controls").data();
        return $.extend( (defaults || {}), shareData, elemData );
    },

    _statClick: function(data, eventType) {
        var clickName = null;
        if (eventType == "on")
            clickName = data.stat || data.statOn;
        else if (eventType == "off")
            clickName = data.statOff;

        if (clickName)
            Stats.record({kind:"click", click: clickName});
    },

    _initedFBEvents: false,

    _registerFBEventHandlers: function() {
        // FB's edge events are global (not specific to an individual Like button), so we register event handlers once
        // for the entire page. Previously we added new event handlers for each Like button we rendered, but there
        // was no easy way to unsubscribe from the FB events when we destroyed/detached those controls.
        var self = this;
        if (!this._initedFBEvents) {
            FacebookUtils.initSDK().done( function() {
                FB.Event.subscribe('edge.create', $.proxy(self, "_handleFBEvent", "on"));
                FB.Event.subscribe('edge.remove', $.proxy(self, "_handleFBEvent", "off"));
            });
            this._initedFBEvents = true;
        }
    },

    // eventType: "on" or "off" (for Like or Unlike) -- supplied by us in $.proxy in _registerFBEventHandlers
    // href, widget: supplied by the FB edge event
    _handleFBEvent: function(eventType, href, widget) {
        var self = this;
        Log.debug("SocialControls: got Facebook event; eventType: " + eventType + "; href: " + href + "; widget: ", widget);

        if (!widget || !widget.dom || !widget.dom.tagName) {
            // The widget param is undocumented; I found it here: 
            // http://stackoverflow.com/questions/9083719/how-to-track-which-like-button-widget-triggered-event-subscribe-edge-create-call
            // It's the only means I could find to distinguish between two Like buttons with the same href.
            // If FB has changed/removed the widget param, better to do nothing than to stat incorrectly:
            Log.error("SocialControls: can't stat FB Like/Unlike because event parameter 'widget' is missing or has changed");
            return;  
        }

        var data = $(widget.dom).closest(".facebook-like-ctrl").data("scResolvedData");
        if (!data || (href != data.url))
            return;
        self._statClick(data, eventType);
    },

    xxx: null
};;
/* ------------- BEGIN jquery.ui.draggable.min.js --------------- */;
/*! jQuery UI - v1.9.2 - 2012-11-23
* http://jqueryui.com
* Includes: jquery.ui.draggable.js
* Copyright 2012 jQuery Foundation and other contributors; Licensed MIT */
(function(e,t){e.widget("ui.draggable",e.ui.mouse,{version:"1.9.2",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))&&(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(t){var n=this.options;return this.helper||n.disabled||e(t.target).is(".ui-resizable-handle")?!1:(this.handle=this._getHandle(t),this.handle?(e(n.iframeFix===!0?"iframe":n.iframeFix).each(function(){e('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(e(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(t){var n=this.options;return this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),e.ui.ddmanager&&(e.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,n.cursorAt&&this._adjustOffsetFromHelper(n.cursorAt),n.containment&&this._setContainment(),this._trigger("start",t)===!1?(this._clear(),!1):(this._cacheHelperProportions(),e.ui.ddmanager&&!n.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this._mouseDrag(t,!0),e.ui.ddmanager&&e.ui.ddmanager.dragStart(this,t),!0)},_mouseDrag:function(t,n){this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute");if(!n){var r=this._uiHash();if(this._trigger("drag",t,r)===!1)return this._mouseUp({}),!1;this.position=r.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";return e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),!1},_mouseStop:function(t){var n=!1;e.ui.ddmanager&&!this.options.dropBehaviour&&(n=e.ui.ddmanager.drop(this,t)),this.dropped&&(n=this.dropped,this.dropped=!1);var r=this.element[0],i=!1;while(r&&(r=r.parentNode))r==document&&(i=!0);if(!i&&this.options.helper==="original")return!1;if(this.options.revert=="invalid"&&!n||this.options.revert=="valid"&&n||this.options.revert===!0||e.isFunction(this.options.revert)&&this.options.revert.call(this.element,n)){var s=this;e(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){s._trigger("stop",t)!==!1&&s._clear()})}else this._trigger("stop",t)!==!1&&this._clear();return!1},_mouseUp:function(t){return e("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),e.ui.ddmanager&&e.ui.ddmanager.dragStop(this,t),e.ui.mouse.prototype._mouseUp.call(this,t)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(t){var n=!this.options.handle||!e(this.options.handle,this.element).length?!0:!1;return e(this.options.handle,this.element).find("*").andSelf().each(function(){this==t.target&&(n=!0)}),n},_createHelper:function(t){var n=this.options,r=e.isFunction(n.helper)?e(n.helper.apply(this.element[0],[t])):n.helper=="clone"?this.element.clone().removeAttr("id"):this.element;return r.parents("body").length||r.appendTo(n.appendTo=="parent"?this.element[0].parentNode:n.appendTo),r[0]!=this.element[0]&&!/(fixed|absolute)/.test(r.css("position"))&&r.css("position","absolute"),r},_adjustOffsetFromHelper:function(t){typeof t=="string"&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&e.ui.ie)t={top:0,left:0};return{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var e=this.element.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t=this.options;t.containment=="parent"&&(t.containment=this.helper[0].parentNode);if(t.containment=="document"||t.containment=="window")this.containment=[t.containment=="document"?0:e(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t.containment=="document"?0:e(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(t.containment=="document"?0:e(window).scrollLeft())+e(t.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(t.containment=="document"?0:e(window).scrollTop())+(e(t.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(t.containment)&&t.containment.constructor!=Array){var n=e(t.containment),r=n[0];if(!r)return;var i=n.offset(),s=e(r).css("overflow")!="hidden";this.containment=[(parseInt(e(r).css("borderLeftWidth"),10)||0)+(parseInt(e(r).css("paddingLeft"),10)||0),(parseInt(e(r).css("borderTopWidth"),10)||0)+(parseInt(e(r).css("paddingTop"),10)||0),(s?Math.max(r.scrollWidth,r.offsetWidth):r.offsetWidth)-(parseInt(e(r).css("borderLeftWidth"),10)||0)-(parseInt(e(r).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(s?Math.max(r.scrollHeight,r.offsetHeight):r.offsetHeight)-(parseInt(e(r).css("borderTopWidth"),10)||0)-(parseInt(e(r).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=n}else t.containment.constructor==Array&&(this.containment=t.containment)},_convertPositionTo:function(t,n){n||(n=this.position);var r=t=="absolute"?1:-1,i=this.options,s=this.cssPosition!="absolute"||this.scrollParent[0]!=document&&!!e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(s[0].tagName);return{top:n.top+this.offset.relative.top*r+this.offset.parent.top*r-(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():o?0:s.scrollTop())*r,left:n.left+this.offset.relative.left*r+this.offset.parent.left*r-(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():o?0:s.scrollLeft())*r}},_generatePosition:function(t){var n=this.options,r=this.cssPosition!="absolute"||this.scrollParent[0]!=document&&!!e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,i=/(html|body)/i.test(r[0].tagName),s=t.pageX,o=t.pageY;if(this.originalPosition){var u;if(this.containment){if(this.relative_container){var a=this.relative_container.offset();u=[this.containment[0]+a.left,this.containment[1]+a.top,this.containment[2]+a.left,this.containment[3]+a.top]}else u=this.containment;t.pageX-this.offset.click.left<u[0]&&(s=u[0]+this.offset.click.left),t.pageY-this.offset.click.top<u[1]&&(o=u[1]+this.offset.click.top),t.pageX-this.offset.click.left>u[2]&&(s=u[2]+this.offset.click.left),t.pageY-this.offset.click.top>u[3]&&(o=u[3]+this.offset.click.top)}if(n.grid){var f=n.grid[1]?this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1]:this.originalPageY;o=u?f-this.offset.click.top<u[1]||f-this.offset.click.top>u[3]?f-this.offset.click.top<u[1]?f+n.grid[1]:f-n.grid[1]:f:f;var l=n.grid[0]?this.originalPageX+Math.round((s-this.originalPageX)/n.grid[0])*n.grid[0]:this.originalPageX;s=u?l-this.offset.click.left<u[0]||l-this.offset.click.left>u[2]?l-this.offset.click.left<u[0]?l+n.grid[0]:l-n.grid[0]:l:l}}return{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():i?0:r.scrollTop()),left:s-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():i?0:r.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(t,n,r){return r=r||this._uiHash(),e.ui.plugin.call(this,t,[n,r]),t=="drag"&&(this.positionAbs=this._convertPositionTo("absolute")),e.Widget.prototype._trigger.call(this,t,n,r)},plugins:{},_uiHash:function(e){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),e.ui.plugin.add("draggable","connectToSortable",{start:function(t,n){var r=e(this).data("draggable"),i=r.options,s=e.extend({},n,{item:r.element});r.sortables=[],e(i.connectToSortable).each(function(){var n=e.data(this,"sortable");n&&!n.options.disabled&&(r.sortables.push({instance:n,shouldRevert:n.options.revert}),n.refreshPositions(),n._trigger("activate",t,s))})},stop:function(t,n){var r=e(this).data("draggable"),i=e.extend({},n,{item:r.element});e.each(r.sortables,function(){this.instance.isOver?(this.instance.isOver=0,r.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=!0),this.instance._mouseStop(t),this.instance.options.helper=this.instance.options._helper,r.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",t,i))})},drag:function(t,n){var r=e(this).data("draggable"),i=this,s=function(t){var n=this.offset.click.top,r=this.offset.click.left,i=this.positionAbs.top,s=this.positionAbs.left,o=t.height,u=t.width,a=t.top,f=t.left;return e.ui.isOver(i+n,s+r,a,f,o,u)};e.each(r.sortables,function(s){var o=!1,u=this;this.instance.positionAbs=r.positionAbs,this.instance.helperProportions=r.helperProportions,this.instance.offset.click=r.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(o=!0,e.each(r.sortables,function(){return this.instance.positionAbs=r.positionAbs,this.instance.helperProportions=r.helperProportions,this.instance.offset.click=r.offset.click,this!=u&&this.instance._intersectsWith(this.instance.containerCache)&&e.ui.contains(u.instance.element[0],this.instance.element[0])&&(o=!1),o})),o?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=e(i).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return n.helper[0]},t.target=this.instance.currentItem[0],this.instance._mouseCapture(t,!0),this.instance._mouseStart(t,!0,!0),this.instance.offset.click.top=r.offset.click.top,this.instance.offset.click.left=r.offset.click.left,this.instance.offset.parent.left-=r.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=r.offset.parent.top-this.instance.offset.parent.top,r._trigger("toSortable",t),r.dropped=this.instance.element,r.currentItem=r.element,this.instance.fromOutside=r),this.instance.currentItem&&this.instance._mouseDrag(t)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",t,this.instance._uiHash(this.instance)),this.instance._mouseStop(t,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),r._trigger("fromSortable",t),r.dropped=!1)})}}),e.ui.plugin.add("draggable","cursor",{start:function(t,n){var r=e("body"),i=e(this).data("draggable").options;r.css("cursor")&&(i._cursor=r.css("cursor")),r.css("cursor",i.cursor)},stop:function(t,n){var r=e(this).data("draggable").options;r._cursor&&e("body").css("cursor",r._cursor)}}),e.ui.plugin.add("draggable","opacity",{start:function(t,n){var r=e(n.helper),i=e(this).data("draggable").options;r.css("opacity")&&(i._opacity=r.css("opacity")),r.css("opacity",i.opacity)},stop:function(t,n){var r=e(this).data("draggable").options;r._opacity&&e(n.helper).css("opacity",r._opacity)}}),e.ui.plugin.add("draggable","scroll",{start:function(t,n){var r=e(this).data("draggable");r.scrollParent[0]!=document&&r.scrollParent[0].tagName!="HTML"&&(r.overflowOffset=r.scrollParent.offset())},drag:function(t,n){var r=e(this).data("draggable"),i=r.options,s=!1;if(r.scrollParent[0]!=document&&r.scrollParent[0].tagName!="HTML"){if(!i.axis||i.axis!="x")r.overflowOffset.top+r.scrollParent[0].offsetHeight-t.pageY<i.scrollSensitivity?r.scrollParent[0].scrollTop=s=r.scrollParent[0].scrollTop+i.scrollSpeed:t.pageY-r.overflowOffset.top<i.scrollSensitivity&&(r.scrollParent[0].scrollTop=s=r.scrollParent[0].scrollTop-i.scrollSpeed);if(!i.axis||i.axis!="y")r.overflowOffset.left+r.scrollParent[0].offsetWidth-t.pageX<i.scrollSensitivity?r.scrollParent[0].scrollLeft=s=r.scrollParent[0].scrollLeft+i.scrollSpeed:t.pageX-r.overflowOffset.left<i.scrollSensitivity&&(r.scrollParent[0].scrollLeft=s=r.scrollParent[0].scrollLeft-i.scrollSpeed)}else{if(!i.axis||i.axis!="x")t.pageY-e(document).scrollTop()<i.scrollSensitivity?s=e(document).scrollTop(e(document).scrollTop()-i.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<i.scrollSensitivity&&(s=e(document).scrollTop(e(document).scrollTop()+i.scrollSpeed));if(!i.axis||i.axis!="y")t.pageX-e(document).scrollLeft()<i.scrollSensitivity?s=e(document).scrollLeft(e(document).scrollLeft()-i.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<i.scrollSensitivity&&(s=e(document).scrollLeft(e(document).scrollLeft()+i.scrollSpeed))}s!==!1&&e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(r,t)}}),e.ui.plugin.add("draggable","snap",{start:function(t,n){var r=e(this).data("draggable"),i=r.options;r.snapElements=[],e(i.snap.constructor!=String?i.snap.items||":data(draggable)":i.snap).each(function(){var t=e(this),n=t.offset();this!=r.element[0]&&r.snapElements.push({item:this,width:t.outerWidth(),height:t.outerHeight(),top:n.top,left:n.left})})},drag:function(t,n){var r=e(this).data("draggable"),i=r.options,s=i.snapTolerance,o=n.offset.left,u=o+r.helperProportions.width,a=n.offset.top,f=a+r.helperProportions.height;for(var l=r.snapElements.length-1;l>=0;l--){var c=r.snapElements[l].left,h=c+r.snapElements[l].width,p=r.snapElements[l].top,d=p+r.snapElements[l].height;if(!(c-s<o&&o<h+s&&p-s<a&&a<d+s||c-s<o&&o<h+s&&p-s<f&&f<d+s||c-s<u&&u<h+s&&p-s<a&&a<d+s||c-s<u&&u<h+s&&p-s<f&&f<d+s)){r.snapElements[l].snapping&&r.options.snap.release&&r.options.snap.release.call(r.element,t,e.extend(r._uiHash(),{snapItem:r.snapElements[l].item})),r.snapElements[l].snapping=!1;continue}if(i.snapMode!="inner"){var v=Math.abs(p-f)<=s,m=Math.abs(d-a)<=s,g=Math.abs(c-u)<=s,y=Math.abs(h-o)<=s;v&&(n.position.top=r._convertPositionTo("relative",{top:p-r.helperProportions.height,left:0}).top-r.margins.top),m&&(n.position.top=r._convertPositionTo("relative",{top:d,left:0}).top-r.margins.top),g&&(n.position.left=r._convertPositionTo("relative",{top:0,left:c-r.helperProportions.width}).left-r.margins.left),y&&(n.position.left=r._convertPositionTo("relative",{top:0,left:h}).left-r.margins.left)}var b=v||m||g||y;if(i.snapMode!="outer"){var v=Math.abs(p-a)<=s,m=Math.abs(d-f)<=s,g=Math.abs(c-o)<=s,y=Math.abs(h-u)<=s;v&&(n.position.top=r._convertPositionTo("relative",{top:p,left:0}).top-r.margins.top),m&&(n.position.top=r._convertPositionTo("relative",{top:d-r.helperProportions.height,left:0}).top-r.margins.top),g&&(n.position.left=r._convertPositionTo("relative",{top:0,left:c}).left-r.margins.left),y&&(n.position.left=r._convertPositionTo("relative",{top:0,left:h-r.helperProportions.width}).left-r.margins.left)}!r.snapElements[l].snapping&&(v||m||g||y||b)&&r.options.snap.snap&&r.options.snap.snap.call(r.element,t,e.extend(r._uiHash(),{snapItem:r.snapElements[l].item})),r.snapElements[l].snapping=v||m||g||y||b}}}),e.ui.plugin.add("draggable","stack",{start:function(t,n){var r=e(this).data("draggable").options,i=e.makeArray(e(r.stack)).sort(function(t,n){return(parseInt(e(t).css("zIndex"),10)||0)-(parseInt(e(n).css("zIndex"),10)||0)});if(!i.length)return;var s=parseInt(i[0].style.zIndex)||0;e(i).each(function(e){this.style.zIndex=s+e}),this[0].style.zIndex=s+i.length}}),e.ui.plugin.add("draggable","zIndex",{start:function(t,n){var r=e(n.helper),i=e(this).data("draggable").options;r.css("zIndex")&&(i._zIndex=r.css("zIndex")),r.css("zIndex",i.zIndex)},stop:function(t,n){var r=e(this).data("draggable").options;r._zIndex&&e(n.helper).css("zIndex",r._zIndex)}})})(jQuery);;
/* ------------- BEGIN jquery.ui.dialog.min.js --------------- */;
/*! jQuery UI - v1.9.2 - 2012-11-23
* http://jqueryui.com
* Includes: jquery.ui.dialog.js
* Copyright 2012 jQuery Foundation and other contributors; Licensed MIT */
(function(e,t){var n="ui-dialog ui-widget ui-widget-content ui-corner-all ",r={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};e.widget("ui.dialog",{version:"1.9.2",options:{autoOpen:!0,buttons:{},closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:!1,maxWidth:!1,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(t){var n=e(this).css(t).offset().top;n<0&&e(this).css("top",t.top-n)}},resizable:!0,show:null,stack:!0,title:"",width:300,zIndex:1e3},_create:function(){this.originalTitle=this.element.attr("title"),typeof this.originalTitle!="string"&&(this.originalTitle=""),this.oldPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.options.title=this.options.title||this.originalTitle;var t=this,r=this.options,i=r.title||"&#160;",s,o,u,a,f;s=(this.uiDialog=e("<div>")).addClass(n+r.dialogClass).css({display:"none",outline:0,zIndex:r.zIndex}).attr("tabIndex",-1).keydown(function(n){r.closeOnEscape&&!n.isDefaultPrevented()&&n.keyCode&&n.keyCode===e.ui.keyCode.ESCAPE&&(t.close(n),n.preventDefault())}).mousedown(function(e){t.moveToTop(!1,e)}).appendTo("body"),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(s),o=(this.uiDialogTitlebar=e("<div>")).addClass("ui-dialog-titlebar  ui-widget-header  ui-corner-all  ui-helper-clearfix").bind("mousedown",function(){s.focus()}).prependTo(s),u=e("<a href='#'></a>").addClass("ui-dialog-titlebar-close  ui-corner-all").attr("role","button").click(function(e){e.preventDefault(),t.close(e)}).appendTo(o),(this.uiDialogTitlebarCloseText=e("<span>")).addClass("ui-icon ui-icon-closethick").text(r.closeText).appendTo(u),a=e("<span>").uniqueId().addClass("ui-dialog-title").html(i).prependTo(o),f=(this.uiDialogButtonPane=e("<div>")).addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),(this.uiButtonSet=e("<div>")).addClass("ui-dialog-buttonset").appendTo(f),s.attr({role:"dialog","aria-labelledby":a.attr("id")}),o.find("*").add(o).disableSelection(),this._hoverable(u),this._focusable(u),r.draggable&&e.fn.draggable&&this._makeDraggable(),r.resizable&&e.fn.resizable&&this._makeResizable(),this._createButtons(r.buttons),this._isOpen=!1,e.fn.bgiframe&&s.bgiframe(),this._on(s,{keydown:function(t){if(!r.modal||t.keyCode!==e.ui.keyCode.TAB)return;var n=e(":tabbable",s),i=n.filter(":first"),o=n.filter(":last");if(t.target===o[0]&&!t.shiftKey)return i.focus(1),!1;if(t.target===i[0]&&t.shiftKey)return o.focus(1),!1}})},_init:function(){this.options.autoOpen&&this.open()},_destroy:function(){var e,t=this.oldPosition;this.overlay&&this.overlay.destroy(),this.uiDialog.hide(),this.element.removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"),this.uiDialog.remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),e=t.parent.children().eq(t.index),e.length&&e[0]!==this.element[0]?e.before(this.element):t.parent.append(this.element)},widget:function(){return this.uiDialog},close:function(t){var n=this,r,i;if(!this._isOpen)return;if(!1===this._trigger("beforeClose",t))return;return this._isOpen=!1,this.overlay&&this.overlay.destroy(),this.options.hide?this._hide(this.uiDialog,this.options.hide,function(){n._trigger("close",t)}):(this.uiDialog.hide(),this._trigger("close",t)),e.ui.dialog.overlay.resize(),this.options.modal&&(r=0,e(".ui-dialog").each(function(){this!==n.uiDialog[0]&&(i=e(this).css("z-index"),isNaN(i)||(r=Math.max(r,i)))}),e.ui.dialog.maxZ=r),this},isOpen:function(){return this._isOpen},moveToTop:function(t,n){var r=this.options,i;return r.modal&&!t||!r.stack&&!r.modal?this._trigger("focus",n):(r.zIndex>e.ui.dialog.maxZ&&(e.ui.dialog.maxZ=r.zIndex),this.overlay&&(e.ui.dialog.maxZ+=1,e.ui.dialog.overlay.maxZ=e.ui.dialog.maxZ,this.overlay.$el.css("z-index",e.ui.dialog.overlay.maxZ)),i={scrollTop:this.element.scrollTop(),scrollLeft:this.element.scrollLeft()},e.ui.dialog.maxZ+=1,this.uiDialog.css("z-index",e.ui.dialog.maxZ),this.element.attr(i),this._trigger("focus",n),this)},open:function(){if(this._isOpen)return;var t,n=this.options,r=this.uiDialog;return this._size(),this._position(n.position),r.show(n.show),this.overlay=n.modal?new e.ui.dialog.overlay(this):null,this.moveToTop(!0),t=this.element.find(":tabbable"),t.length||(t=this.uiDialogButtonPane.find(":tabbable"),t.length||(t=r)),t.eq(0).focus(),this._isOpen=!0,this._trigger("open"),this},_createButtons:function(t){var n=this,r=!1;this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),typeof t=="object"&&t!==null&&e.each(t,function(){return!(r=!0)}),r?(e.each(t,function(t,r){var i,s;r=e.isFunction(r)?{click:r,text:t}:r,r=e.extend({type:"button"},r),s=r.click,r.click=function(){s.apply(n.element[0],arguments)},i=e("<button></button>",r).appendTo(n.uiButtonSet),e.fn.button&&i.button()}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog)):this.uiDialog.removeClass("ui-dialog-buttons")},_makeDraggable:function(){function r(e){return{position:e.position,offset:e.offset}}var t=this,n=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(n,i){e(this).addClass("ui-dialog-dragging"),t._trigger("dragStart",n,r(i))},drag:function(e,n){t._trigger("drag",e,r(n))},stop:function(i,s){n.position=[s.position.left-t.document.scrollLeft(),s.position.top-t.document.scrollTop()],e(this).removeClass("ui-dialog-dragging"),t._trigger("dragStop",i,r(s)),e.ui.dialog.overlay.resize()}})},_makeResizable:function(n){function u(e){return{originalPosition:e.originalPosition,originalSize:e.originalSize,position:e.position,size:e.size}}n=n===t?this.options.resizable:n;var r=this,i=this.options,s=this.uiDialog.css("position"),o=typeof n=="string"?n:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:i.maxWidth,maxHeight:i.maxHeight,minWidth:i.minWidth,minHeight:this._minHeight(),handles:o,start:function(t,n){e(this).addClass("ui-dialog-resizing"),r._trigger("resizeStart",t,u(n))},resize:function(e,t){r._trigger("resize",e,u(t))},stop:function(t,n){e(this).removeClass("ui-dialog-resizing"),i.height=e(this).height(),i.width=e(this).width(),r._trigger("resizeStop",t,u(n)),e.ui.dialog.overlay.resize()}}).css("position",s).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var e=this.options;return e.height==="auto"?e.minHeight:Math.min(e.minHeight,e.height)},_position:function(t){var n=[],r=[0,0],i;if(t){if(typeof t=="string"||typeof t=="object"&&"0"in t)n=t.split?t.split(" "):[t[0],t[1]],n.length===1&&(n[1]=n[0]),e.each(["left","top"],function(e,t){+n[e]===n[e]&&(r[e]=n[e],n[e]=t)}),t={my:n[0]+(r[0]<0?r[0]:"+"+r[0])+" "+n[1]+(r[1]<0?r[1]:"+"+r[1]),at:n.join(" ")};t=e.extend({},e.ui.dialog.prototype.options.position,t)}else t=e.ui.dialog.prototype.options.position;i=this.uiDialog.is(":visible"),i||this.uiDialog.show(),this.uiDialog.position(t),i||this.uiDialog.hide()},_setOptions:function(t){var n=this,s={},o=!1;e.each(t,function(e,t){n._setOption(e,t),e in r&&(o=!0),e in i&&(s[e]=t)}),o&&this._size(),this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",s)},_setOption:function(t,r){var i,s,o=this.uiDialog;switch(t){case"buttons":this._createButtons(r);break;case"closeText":this.uiDialogTitlebarCloseText.text(""+r);break;case"dialogClass":o.removeClass(this.options.dialogClass).addClass(n+r);break;case"disabled":r?o.addClass("ui-dialog-disabled"):o.removeClass("ui-dialog-disabled");break;case"draggable":i=o.is(":data(draggable)"),i&&!r&&o.draggable("destroy"),!i&&r&&this._makeDraggable();break;case"position":this._position(r);break;case"resizable":s=o.is(":data(resizable)"),s&&!r&&o.resizable("destroy"),s&&typeof r=="string"&&o.resizable("option","handles",r),!s&&r!==!1&&this._makeResizable(r);break;case"title":e(".ui-dialog-title",this.uiDialogTitlebar).html(""+(r||"&#160;"))}this._super(t,r)},_size:function(){var t,n,r,i=this.options,s=this.uiDialog.is(":visible");this.element.show().css({width:"auto",minHeight:0,height:0}),i.minWidth>i.width&&(i.width=i.minWidth),t=this.uiDialog.css({height:"auto",width:i.width}).outerHeight(),n=Math.max(0,i.minHeight-t),i.height==="auto"?e.support.minHeight?this.element.css({minHeight:n,height:"auto"}):(this.uiDialog.show(),r=this.element.css("height","auto").height(),s||this.uiDialog.hide(),this.element.height(Math.max(r,n))):this.element.height(Math.max(i.height-t,0)),this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())}}),e.extend(e.ui.dialog,{uuid:0,maxZ:0,getTitleId:function(e){var t=e.attr("id");return t||(this.uuid+=1,t=this.uuid),"ui-dialog-title-"+t},overlay:function(t){this.$el=e.ui.dialog.overlay.create(t)}}),e.extend(e.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:e.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(e){return e+".dialog-overlay"}).join(" "),create:function(t){this.instances.length===0&&(setTimeout(function(){e.ui.dialog.overlay.instances.length&&e(document).bind(e.ui.dialog.overlay.events,function(t){if(e(t.target).zIndex()<e.ui.dialog.overlay.maxZ)return!1})},1),e(window).bind("resize.dialog-overlay",e.ui.dialog.overlay.resize));var n=this.oldInstances.pop()||e("<div>").addClass("ui-widget-overlay");return e(document).bind("keydown.dialog-overlay",function(r){var i=e.ui.dialog.overlay.instances;i.length!==0&&i[i.length-1]===n&&t.options.closeOnEscape&&!r.isDefaultPrevented()&&r.keyCode&&r.keyCode===e.ui.keyCode.ESCAPE&&(t.close(r),r.preventDefault())}),n.appendTo(document.body).css({width:this.width(),height:this.height()}),e.fn.bgiframe&&n.bgiframe(),this.instances.push(n),n},destroy:function(t){var n=e.inArray(t,this.instances),r=0;n!==-1&&this.oldInstances.push(this.instances.splice(n,1)[0]),this.instances.length===0&&e([document,window]).unbind(".dialog-overlay"),t.height(0).width(0).remove(),e.each(this.instances,function(){r=Math.max(r,this.css("z-index"))}),this.maxZ=r},height:function(){var t,n;return e.ui.ie?(t=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight),n=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight),t<n?e(window).height()+"px":t+"px"):e(document).height()+"px"},width:function(){var t,n;return e.ui.ie?(t=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),n=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth),t<n?e(window).width()+"px":t+"px"):e(document).width()+"px"},resize:function(){var t=e([]);e.each(e.ui.dialog.overlay.instances,function(){t=t.add(this)}),t.css({width:0,height:0}).css({width:e.ui.dialog.overlay.width(),height:e.ui.dialog.overlay.height()})}}),e.extend(e.ui.dialog.overlay.prototype,{destroy:function(){e.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);;
/* ------------- BEGIN iscroll-min.js --------------- */;
(function(){function j(n,l){var o=this,m;o.element=typeof n=="object"?n:document.getElementById(n);o.wrapper=o.element.parentNode;o.element.style.webkitTransitionProperty="-webkit-transform";o.element.style.webkitTransitionTimingFunction="cubic-bezier(0,0,0.25,1)";o.element.style.webkitTransitionDuration="0";o.element.style.webkitTransform=h+"0,0"+b;o.options={bounce:d,momentum:d,checkDOMChanges:true,topOnDOMChanges:false,hScrollbar:d,vScrollbar:d,fadeScrollbar:g||!a,shrinkScrollbar:g||!a,desktopCompatibility:false,overflow:"auto",snap:false,bounceLock:false,scrollbarColor:"rgba(0,0,0,0.5)",onScrollEnd:function(){}};if(typeof l=="object"){for(m in l){o.options[m]=l[m]}}if(o.options.desktopCompatibility){o.options.overflow="hidden"}o.onScrollEnd=o.options.onScrollEnd;delete o.options.onScrollEnd;o.wrapper.style.overflow=o.options.overflow;o.refresh();window.addEventListener("onorientationchange" in window?"orientationchange":"resize",o,false);if(a||o.options.desktopCompatibility){o.element.addEventListener(f,o,false);o.element.addEventListener(i,o,false);o.element.addEventListener(e,o,false)}if(o.options.checkDOMChanges){o.element.addEventListener("DOMSubtreeModified",o,false)}}j.prototype={x:0,y:0,enabled:true,handleEvent:function(m){var l=this;switch(m.type){case f:l.touchStart(m);break;case i:l.touchMove(m);break;case e:l.touchEnd(m);break;case"webkitTransitionEnd":l.transitionEnd();break;case"orientationchange":case"resize":l.refresh();break;case"DOMSubtreeModified":l.onDOMModified(m);break}},onDOMModified:function(m){var l=this;if(m.target.parentNode!=l.element){return}setTimeout(function(){l.refresh()},0);if(l.options.topOnDOMChanges&&(l.x!=0||l.y!=0)){l.scrollTo(0,0,"0")}},refresh:function(){var m=this,o=m.x,n=m.y,l;m.scrollWidth=m.wrapper.clientWidth;m.scrollHeight=m.wrapper.clientHeight;m.scrollerWidth=m.element.offsetWidth;m.scrollerHeight=m.element.offsetHeight;m.maxScrollX=m.scrollWidth-m.scrollerWidth;m.maxScrollY=m.scrollHeight-m.scrollerHeight;m.directionX=0;m.directionY=0;if(m.scrollX){if(m.maxScrollX>=0){o=0}else{if(m.x<m.maxScrollX){o=m.maxScrollX}}}if(m.scrollY){if(m.maxScrollY>=0){n=0}else{if(m.y<m.maxScrollY){n=m.maxScrollY}}}if(m.options.snap){m.maxPageX=-Math.floor(m.maxScrollX/m.scrollWidth);m.maxPageY=-Math.floor(m.maxScrollY/m.scrollHeight);l=m.snap(o,n);o=l.x;n=l.y}if(o!=m.x||n!=m.y){m.setTransitionTime("0");m.setPosition(o,n,true)}m.scrollX=m.scrollerWidth>m.scrollWidth;m.scrollY=!m.options.bounceLock&&!m.scrollX||m.scrollerHeight>m.scrollHeight;if(m.options.hScrollbar&&m.scrollX){m.scrollBarX=m.scrollBarX||new k("horizontal",m.wrapper,m.options.fadeScrollbar,m.options.shrinkScrollbar,m.options.scrollbarColor);m.scrollBarX.init(m.scrollWidth,m.scrollerWidth)}else{if(m.scrollBarX){m.scrollBarX=m.scrollBarX.remove()}}if(m.options.vScrollbar&&m.scrollY&&m.scrollerHeight>m.scrollHeight){m.scrollBarY=m.scrollBarY||new k("vertical",m.wrapper,m.options.fadeScrollbar,m.options.shrinkScrollbar,m.options.scrollbarColor);m.scrollBarY.init(m.scrollHeight,m.scrollerHeight)}else{if(m.scrollBarY){m.scrollBarY=m.scrollBarY.remove()}}},setPosition:function(l,o,n){var m=this;m.x=l;m.y=o;m.element.style.webkitTransform=h+m.x+"px,"+m.y+"px"+b;if(!n){if(m.scrollBarX){m.scrollBarX.setPosition(m.x)}if(m.scrollBarY){m.scrollBarY.setPosition(m.y)}}},setTransitionTime:function(m){var l=this;m=m||"0";l.element.style.webkitTransitionDuration=m;if(l.scrollBarX){l.scrollBarX.bar.style.webkitTransitionDuration=m;l.scrollBarX.wrapper.style.webkitTransitionDuration=d&&l.options.fadeScrollbar?"300ms":"0"}if(l.scrollBarY){l.scrollBarY.bar.style.webkitTransitionDuration=m;l.scrollBarY.wrapper.style.webkitTransitionDuration=d&&l.options.fadeScrollbar?"300ms":"0"}},touchStart:function(n){var m=this,l;if(!m.enabled){return}n.preventDefault();n.stopPropagation();m.scrolling=true;m.moved=false;m.distX=0;m.distY=0;m.setTransitionTime("0");if(m.options.momentum||m.options.snap){l=new WebKitCSSMatrix(window.getComputedStyle(m.element).webkitTransform);if(l.e!=m.x||l.f!=m.y){document.removeEventListener("webkitTransitionEnd",m,false);m.setPosition(l.e,l.f);m.moved=true}}m.touchStartX=a?n.changedTouches[0].pageX:n.pageX;m.scrollStartX=m.x;m.touchStartY=a?n.changedTouches[0].pageY:n.pageY;m.scrollStartY=m.y;m.scrollStartTime=n.timeStamp;m.directionX=0;m.directionY=0},touchMove:function(r){if(!this.scrolling){return}var p=this,o=a?r.changedTouches[0].pageX:r.pageX,n=a?r.changedTouches[0].pageY:r.pageY,m=p.scrollX?o-p.touchStartX:0,l=p.scrollY?n-p.touchStartY:0,s=p.x+m,q=p.y+l;r.stopPropagation();p.touchStartX=o;p.touchStartY=n;if(s>=0||s<p.maxScrollX){s=p.options.bounce?Math.round(p.x+m/3):(s>=0||p.maxScrollX>=0)?0:p.maxScrollX}if(q>=0||q<p.maxScrollY){q=p.options.bounce?Math.round(p.y+l/3):(q>=0||p.maxScrollY>=0)?0:p.maxScrollY}if(p.distX+p.distY>5){if(p.distX-3>p.distY){q=p.y;l=0}else{if(p.distY-3>p.distX){s=p.x;m=0}}p.setPosition(s,q);p.moved=true;p.directionX=m>0?-1:1;p.directionY=l>0?-1:1}else{p.distX+=Math.abs(m);p.distY+=Math.abs(l)}},touchEnd:function(t){if(!this.scrolling){return}var s=this,o=t.timeStamp-s.scrollStartTime,w=a?t.changedTouches[0]:t,u,v,n,l,m=0,r=s.x,q=s.y,p;s.scrolling=false;if(!s.moved){s.resetPosition();if(a){u=w.target;while(u.nodeType!=1){u=u.parentNode}v=document.createEvent("MouseEvents");v.initMouseEvent("click",true,true,t.view,1,w.screenX,w.screenY,w.clientX,w.clientY,t.ctrlKey,t.altKey,t.shiftKey,t.metaKey,0,null);v._fake=true;u.dispatchEvent(v)}return}if(!s.options.snap&&o>250){s.resetPosition();return}if(s.options.momentum){n=s.scrollX===true?s.momentum(s.x-s.scrollStartX,o,s.options.bounce?-s.x+s.scrollWidth/5:-s.x,s.options.bounce?s.x+s.scrollerWidth-s.scrollWidth+s.scrollWidth/5:s.x+s.scrollerWidth-s.scrollWidth):{dist:0,time:0};l=s.scrollY===true?s.momentum(s.y-s.scrollStartY,o,s.options.bounce?-s.y+s.scrollHeight/5:-s.y,s.options.bounce?(s.maxScrollY<0?s.y+s.scrollerHeight-s.scrollHeight:0)+s.scrollHeight/5:s.y+s.scrollerHeight-s.scrollHeight):{dist:0,time:0};m=Math.max(Math.max(n.time,l.time),1);r=s.x+n.dist;q=s.y+l.dist}if(s.options.snap){p=s.snap(r,q);r=p.x;q=p.y;m=Math.max(p.time,m)}s.scrollTo(r,q,m+"ms")},transitionEnd:function(){var l=this;document.removeEventListener("webkitTransitionEnd",l,false);l.resetPosition()},resetPosition:function(){var l=this,n=l.x,m=l.y;if(l.x>=0){n=0}else{if(l.x<l.maxScrollX){n=l.maxScrollX}}if(l.y>=0||l.maxScrollY>0){m=0}else{if(l.y<l.maxScrollY){m=l.maxScrollY}}if(n!=l.x||m!=l.y){l.scrollTo(n,m)}else{if(l.moved){l.onScrollEnd();l.moved=false}if(l.scrollBarX){l.scrollBarX.hide()}if(l.scrollBarY){l.scrollBarY.hide()}}},snap:function(l,o){var m=this,n;if(m.directionX>0){l=Math.floor(l/m.scrollWidth)}else{if(m.directionX<0){l=Math.ceil(l/m.scrollWidth)}else{l=Math.round(l/m.scrollWidth)}}m.pageX=-l;l=l*m.scrollWidth;if(l>0){l=m.pageX=0}else{if(l<m.maxScrollX){m.pageX=m.maxPageX;l=m.maxScrollX}}if(m.directionY>0){o=Math.floor(o/m.scrollHeight)}else{if(m.directionY<0){o=Math.ceil(o/m.scrollHeight)}else{o=Math.round(o/m.scrollHeight)}}m.pageY=-o;o=o*m.scrollHeight;if(o>0){o=m.pageY=0}else{if(o<m.maxScrollY){m.pageY=m.maxPageY;o=m.maxScrollY}}n=Math.round(Math.max(Math.abs(m.x-l)/m.scrollWidth*500,Math.abs(m.y-o)/m.scrollHeight*500));return{x:l,y:o,time:n}},scrollTo:function(m,l,o){var n=this;if(n.x==m&&n.y==l){n.resetPosition();return}n.moved=true;n.setTransitionTime(o||"350ms");n.setPosition(m,l);if(o==="0"||o=="0s"||o=="0ms"){n.resetPosition()}else{document.addEventListener("webkitTransitionEnd",n,false)}},scrollToPage:function(n,m,p){var o=this,l;if(!o.options.snap){o.pageX=-Math.round(o.x/o.scrollWidth);o.pageY=-Math.round(o.y/o.scrollHeight)}if(n=="next"){n=++o.pageX}else{if(n=="prev"){n=--o.pageX}}if(m=="next"){m=++o.pageY}else{if(m=="prev"){m=--o.pageY}}n=-n*o.scrollWidth;m=-m*o.scrollHeight;l=o.snap(n,m);n=l.x;m=l.y;o.scrollTo(n,m,p||"500ms")},scrollToElement:function(m,o){m=typeof m=="object"?m:this.element.querySelector(m);if(!m){return}var n=this,l=n.scrollX?-m.offsetLeft:0,p=n.scrollY?-m.offsetTop:0;if(l>=0){l=0}else{if(l<n.maxScrollX){l=n.maxScrollX}}if(p>=0){p=0}else{if(p<n.maxScrollY){p=n.maxScrollY}}n.scrollTo(l,p,o)},momentum:function(s,m,q,l){var p=2.5,r=1.2,n=Math.abs(s)/m*1000,o=n*n/p/1000,t=0;if(s>0&&o>q){n=n*q/o/p;o=q}else{if(s<0&&o>l){n=n*l/o/p;o=l}}o=o*(s<0?-1:1);t=n/r;return{dist:Math.round(o),time:Math.round(t)}},destroy:function(l){var m=this;window.removeEventListener("onorientationchange" in window?"orientationchange":"resize",m,false);m.element.removeEventListener(f,m,false);m.element.removeEventListener(i,m,false);m.element.removeEventListener(e,m,false);document.removeEventListener("webkitTransitionEnd",m,false);if(m.options.checkDOMChanges){m.element.removeEventListener("DOMSubtreeModified",m,false)}if(m.scrollBarX){m.scrollBarX=m.scrollBarX.remove()}if(m.scrollBarY){m.scrollBarY=m.scrollBarY.remove()}if(l){m.wrapper.parentNode.removeChild(m.wrapper)}return null}};function k(m,r,q,n,l){var o=this,p=document;o.dir=m;o.fade=q;o.shrink=n;o.uid=++c;o.bar=p.createElement("div");o.bar.style.cssText="position:absolute;top:0;left:0;-webkit-transition-timing-function:cubic-bezier(0,0,0.25,1);pointer-events:none;-webkit-transition-duration:0;-webkit-transition-delay:0;-webkit-transition-property:-webkit-transform;z-index:10;background:"+l+";-webkit-transform:"+h+"0,0"+b+";"+(m=="horizontal"?"-webkit-border-radius:3px 2px;min-width:6px;min-height:5px":"-webkit-border-radius:2px 3px;min-width:5px;min-height:6px");o.wrapper=p.createElement("div");o.wrapper.style.cssText="-webkit-mask:-webkit-canvas(scrollbar"+o.uid+o.dir+");position:absolute;z-index:10;pointer-events:none;overflow:hidden;opacity:0;-webkit-transition-duration:"+(q?"300ms":"0")+";-webkit-transition-delay:0;-webkit-transition-property:opacity;"+(o.dir=="horizontal"?"bottom:2px;left:2px;right:7px;height:5px":"top:2px;right:2px;bottom:7px;width:5px;");o.wrapper.appendChild(o.bar);r.appendChild(o.wrapper)}k.prototype={init:function(l,n){var o=this,q=document,p=Math.PI,m;if(o.dir=="horizontal"){if(o.maxSize!=o.wrapper.offsetWidth){o.maxSize=o.wrapper.offsetWidth;m=q.getCSSCanvasContext("2d","scrollbar"+o.uid+o.dir,o.maxSize,5);m.fillStyle="rgb(0,0,0)";m.beginPath();m.arc(2.5,2.5,2.5,p/2,-p/2,false);m.lineTo(o.maxSize-2.5,0);m.arc(o.maxSize-2.5,2.5,2.5,-p/2,p/2,false);m.closePath();m.fill()}}else{if(o.maxSize!=o.wrapper.offsetHeight){o.maxSize=o.wrapper.offsetHeight;m=q.getCSSCanvasContext("2d","scrollbar"+o.uid+o.dir,5,o.maxSize);m.fillStyle="rgb(0,0,0)";m.beginPath();m.arc(2.5,2.5,2.5,p,0,false);m.lineTo(5,o.maxSize-2.5);m.arc(2.5,o.maxSize-2.5,2.5,0,p,false);m.closePath();m.fill()}}o.size=Math.max(Math.round(o.maxSize*o.maxSize/n),6);o.maxScroll=o.maxSize-o.size;o.toWrapperProp=o.maxScroll/(l-n);o.bar.style[o.dir=="horizontal"?"width":"height"]=o.size+"px"},setPosition:function(m){var l=this;if(l.wrapper.style.opacity!="1"){l.show()}m=Math.round(l.toWrapperProp*m);if(m<0){m=l.shrink?m+m*3:0;if(l.size+m<7){m=-l.size+6}}else{if(m>l.maxScroll){m=l.shrink?m+(m-l.maxScroll)*3:l.maxScroll;if(l.size+l.maxScroll-m<7){m=l.size+l.maxScroll-6}}}m=l.dir=="horizontal"?h+m+"px,0"+b:h+"0,"+m+"px"+b;l.bar.style.webkitTransform=m},show:function(){if(d){this.wrapper.style.webkitTransitionDelay="0"}this.wrapper.style.opacity="1"},hide:function(){if(d){this.wrapper.style.webkitTransitionDelay="350ms"}this.wrapper.style.opacity="0"},remove:function(){this.wrapper.parentNode.removeChild(this.wrapper);return null}};var d=("WebKitCSSMatrix" in window&&"m11" in new WebKitCSSMatrix()),g=(/iphone|ipad/gi).test(navigator.appVersion),a=("ontouchstart" in window),f=a?"touchstart":"mousedown",i=a?"touchmove":"mousemove",e=a?"touchend":"mouseup",h="translate"+(d?"3d(":"("),b=d?",0)":")",c=0;window.iScroll=j})();;
_jsb[_jsb.length-1].c=1;