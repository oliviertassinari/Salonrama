var Flash = {

Version: function(arrVersion)
{
	this.major = arrVersion[0] !== null ? parseInt(arrVersion[0], 10) : 0;
	this.minor = arrVersion[1] !== null ? parseInt(arrVersion[1], 10) : 0;
	this.rev = arrVersion[2] !== null ? parseInt(arrVersion[2], 10) : 0;
},

Obj: function(swf, id, w, h, ver, c, quality)
{
	this.params = {};
	this.variables = {};
	this.attributes = [];

	this.setAttribute('id', id);
	if(swf){ this.setAttribute('swf', swf); }
	if(w){ this.setAttribute('width', w); }
	if(h){ this.setAttribute('height', h); }
	if(ver){ this.setAttribute('version', new Flash.Version(ver.toString().split('.'))); }
	this.installedVer = Flash.getVersion();
	if(c){ this.addParam('bgcolor', c); }
	var q = quality ? quality : 'high';
	this.addParam('quality', q);
	this.setAttribute('useExpressInstall', false);
	this.setAttribute('doExpressInstall', false);
},

getVersion: function()
{
	var PlayerVersion = new Flash.Version([0, 0, 0]);

	if(navigator.plugins && navigator.mimeTypes.length)
	{
		var x = navigator.plugins['Shockwave Flash'];
		if(x && x.description){
			PlayerVersion = new Flash.Version(x.description.replace(/([a-zA-Z]|\s)+/, '').replace(/(\s+r|\s+b[0-9]+)/, '.').split('.'));
		}
	}
	else if(navigator.userAgent && navigator.userAgent.indexOf('Windows CE') >= 0)  // if Windows CE
	{
		var axo = 1;
		var counter = 3;
		while(axo)
		{
			try{
				counter++;
				axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.'+ counter);
				PlayerVersion = new Flash.Version([counter, 0, 0]);
			}
			catch(e){
				axo = null;
			}
		}
	} 
	else // Win IE (non mobile)
	{
		try{
			var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.7');
		}
		catch(e)
		{
			try{
				var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
				PlayerVersion = new Flash.Version([6, 0, 21]);
				axo.AllowScriptAccess = 'always'; // error if player version < 6.0.47 (thanks to Michael Williams @ Adobe for this code)
			} 
			catch(e){
				if(PlayerVersion.major == 6) 
				{
					return PlayerVersion;
				}
			}
			try{
				axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			}
			catch(e){}
		}
		if(axo != null) 
		{
			PlayerVersion = new Flash.Version(axo.GetVariable('$version').split(' ')[1].split(','));
		}
	}
	return PlayerVersion;
}

};

Ot.Extend(Flash.Version, {

isSuperieur: function(fv)
{
	if(this.major < fv.major){
		return false;
	}
	else if(this.major > fv.major){
		return true;
	}
	else if(this.minor < fv.minor){
		return false;
	}
	else if(this.minor > fv.minor){
		return true;
	}
	else if(this.rev < fv.rev){
		return false;
	}
	else{
		return true;
	}
}

});


Ot.Extend(Flash.Obj, {

useExpressInstall: function(path) 
{
	this.xiSWFPath = !path ? 'ExpressInstall.swf' : path;
	this.setAttribute('useExpressInstall', true);
},

setAttribute: function(name, value)
{
	this.attributes[name] = value;
},

getAttribute: function(name)
{
	return this.attributes[name];
},

addParam: function(name, value)
{
	this.params[name] = value;
},

getParams: function()
{
	return this.params;
},

addVariable: function(name, value)
{
	this.variables[name] = value;
},

getVariable: function(name)
{
	return this.variables[name];
},

getVariables: function()
{
	return this.variables;
},

getVariablePairs: function()
{
	var variablePairs = [];
	var key;
	var variables = this.getVariables();
	for(var key in variables)
	{
		variablePairs[variablePairs.length] = key +'='+ variables[key];
	}
	return variablePairs;
},

getHtml: function() 
{
	var Html = '';

	if(navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) // netscape plugin architecture
	{
		if(this.getAttribute('doExpressInstall')) 
		{
			this.addVariable('MMplayerType', 'PlugIn');
			this.setAttribute('swf', this.xiSWFPath);
		}

		Html = '<embed type="application/x-shockwave-flash" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
		Html += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';

		var params = this.getParams();
		for(var key in params){ Html += [key] +'="'+ params[key] +'" '; }
		var pairs = this.getVariablePairs().join('&');
		if(pairs.length > 0){ Html += 'flashvars="'+ pairs +'"'; }
		Html += '/>';
	}
	else //IE
	{
		if(this.getAttribute("doExpressInstall"))
		{
			this.addVariable("MMplayerType", "ActiveX");
			this.setAttribute('swf', this.xiSWFPath);
		}
		Html = '<object id="'+this.getAttribute('id')+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';

		Html += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
		var params = this.getParams();
		for(var key in params)
		{
			Html += '<param name="'+ key +'" value="'+ params[key] +'" />';
		}
		var pairs = this.getVariablePairs().join('&');
		if(pairs.length > 0){ Html += '<param name="flashvars" value="'+ pairs +'" />'; }
		Html += '</object>';
	}

	return Html;
},

add: function(element)
{
	if(this.getAttribute('useExpressInstall')) 
	{
		var expressInstallReqVer = new Flash.Version([6, 0, 65]);
		if(this.installedVer.isSuperieur(expressInstallReqVer) && !this.installedVer.isSuperieur(this.getAttribute('version'))) 
		{
			this.setAttribute('doExpressInstall', true);
			this.addVariable('MMredirectURL', escape(window.location));
			document.title = document.title.slice(0, 47) + ' - Flash Player Installation';
			this.addVariable('MMdoctitle', document.title);
		}
	}

	
	if(this.getAttribute('doExpressInstall') || this.installedVer.isSuperieur(this.getAttribute('version')))
	{
		var Obj = element;
		Obj.innerHTML = this.getHtml();

		this.Obj = element.firstChild;

		return true;
	}

	return false;
}

});
