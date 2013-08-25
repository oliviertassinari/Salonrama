var JSON = {

UNICODE_EXCEPTIONS: /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, //Replace certain Unicode characters that JavaScript may handle incorrectly
ESCAPES: /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, //First step in the validation.  Regex used to replace all escape
VALUES: /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, //Second step in the validation.  Regex used to replace all simple  values with ']' characters.
BRACKETS: /(?:^|:|,)(?:\s*\[)+/g, //Third step in the validation.  Regex used to remove all open square brackets following a colon, comma, or at the beginning of the string.
INVALID: /^[\],:{}\s]*$/,
escapable: /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
SpeChar: {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

toUnicode: function(c)
{
	return '\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
},

encode: function(o)
{
    function quote(string)
	{
        JSON.escapable.lastIndex = 0;

		var R = JSON.escapable.test(string) ? '"'+string.replace(JSON.escapable, function (a)
		{
			var c = JSON.SpeChar[a];
			return typeof c === 'string' ? c : JSON.toUnicode(a);
		})+'"' : '"'+string+'"';

		return R;
    }

	switch (typeof o)
	{
		case 'number':
			return o;
		case 'boolean':
		case 'null':
			return o.valueOf();
		case 'string':
			return quote(o);
		case 'object':
			if(o.length)
			{
				var R = [];
				for(var i in o)
				{
					R.push(JSON.encode(o[i]));
				}
				return '['+R+']';
			}
			else
			{
				var R = [];
				for(var i in o)
				{
					var json = JSON.encode(o[i]);
					if(json){ R.push(JSON.encode(i) + ':' + json); }
				}
				return '{'+R+'}';
			}
	}
	return null;
},

decode: function(string)
{
	if(typeof string === 'string')
	{
		// Replace certain Unicode characters that are otherwise handled incorrectly by some browser implementations.
		string = string.replace(JSON.UNICODE_EXCEPTIONS, function(c)
		{
			return JSON.toUnicode(c);
		});

		if(JSON.INVALID.test(string.replace(JSON.ESCAPES,'@').replace(JSON.VALUES,']').replace(JSON.BRACKETS,'')))
		{
			return eval('(' + string + ')');
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
}

};