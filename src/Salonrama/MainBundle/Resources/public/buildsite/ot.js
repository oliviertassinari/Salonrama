var Browser = {

Engine: {
	name: 'unknown',
	version: 0
},

Platform: {
	name: (window.orientation != undefined) ? 'ipod' : (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase()
},

Features: {
	xpath: !!(document.evaluate),
	air: !!(window.runtime),
	query: !!(document.querySelector)
},

Plugins: { },

Engines: {

	presto: function()
	{
		return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925));
	},

	trident: function()
	{
		return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? ((document.querySelectorAll) ? 6 : 5) : 4);
	},

	webkit: function()
	{
		return (navigator.taintEnabled) ? false : ((Browser.Features.xpath) ? ((Browser.Features.query) ? 525 : 420) : 419);
	},

	gecko: function()
	{
		return (!document.getBoxObjectFor && window.mozInnerScreenX == null) ? false : ((document.getElementsByClassName) ? 19 : 18);
	}
},

detect: function()
{
	for(var engine in this.Engines)
	{
		var version = this.Engines[engine]();
		if(version)
		{
			this.Engine = { name: engine, version: version };
			this.Engine[engine] = this.Engine[engine + version] = true;
			break;
		}
	}

	return { name: engine, version: version };
}

};

Browser.Platform[Browser.Platform.name] = true;
Browser.detect();

var Ot = {

CClient: function()
{
	var Navigateur, Version, Os, Version_pos;

	if(navigator.appName == 'Microsoft Internet Explorer'){
		Navigateur = 'IExploreur';
		Version_pos = navigator.userAgent.indexOf('MSIE');
		Version = navigator.userAgent.substring(Version_pos+5, Version_pos+8);
	}
	else if(navigator.userAgent.indexOf('Firefox') != -1){
		Navigateur = 'Firefox';
		Version_pos = navigator.userAgent.indexOf('Firefox/');
		Version = navigator.userAgent.substring(Version_pos+8, Version_pos+11);
	}
	else if(navigator.appName == 'Opera'){
		Navigateur = 'Opera';
		Version = navigator.appVersion.substring(0, 4);
	}
	else if(navigator.userAgent.indexOf('Chrome') != -1){
		Navigateur = 'Chrome';
		Version_pos = navigator.userAgent.indexOf('Chrome/');
		Version = navigator.userAgent.substring(Version_pos+7, Version_pos+10);
	}
	else if(navigator.userAgent.indexOf('Safari') != -1){
		Navigateur = 'Safari';
		Version_pos = navigator.userAgent.indexOf('Version/');
		Version = navigator.userAgent.substring(Version_pos+8, Version_pos+11);
	}
	else{
		Navigateur = 'Inconnu';
		Version = 'Inconnu';
	}

	if(navigator.appVersion.indexOf('Win') != -1){
		Os = 'Windows';
	}
	else if(navigator.appVersion.indexOf('Mac') != -1){
		Os = 'Mac';
	}
	else if(navigator.appVersion.indexOf('Linux') != -1){
		Os = 'Linux';
	}

    return [Navigateur, Version, Os]; 
},

addEvent: function(Obj, event, CallBack)
{
	if(typeof Obj.addEventListener != 'undefined')
	{
		if(event == 'mousewheel'){
			Obj.addEventListener('DOMMouseScroll', CallBack, false);
			Obj.addEventListener('mousewheel', CallBack, false);
		}
		if(event == 'mouseenter'){
			Obj.addEventListener('mouseover', Ot.mouseEnter(CallBack), false);
		}
		else if(event == 'mouseleave'){
			Obj.addEventListener('mouseout', Ot.mouseEnter(CallBack), false);
		}
		else{
			Obj.addEventListener(event, CallBack, false);
		}
	}
	else if(typeof Obj.attachEvent != 'undefined') //IE
	{
		if(event == 'mouseenter'){
			Obj.attachEvent('onmouseenter', Ot.mouseEnterIE(CallBack));
		}
		else if(event == 'mouseleave'){
			Obj.attachEvent('onmouseleave', Ot.mouseEnterIE(CallBack));
		}
		else{
			Obj.attachEvent('on' + event, CallBack);
		}
	}
},

stopEvent: function(Obj, event, CallBack)
{
	if(typeof Obj.removeEventListener != 'undefined')
	{
		if(event == 'mousewheel'){
			Obj.removeEventListener('DOMMouseScroll', CallBack, false);
			Obj.removeEventListener('mousewheel', CallBack, false);
		}
		else{
			Obj.removeEventListener(event, CallBack, false);
		}
	}
	else if(typeof Obj.detachEvent != 'undefined'){ //IE
		Obj.detachEvent('on' + event, CallBack);
	}
},

cancelEvent: function(e)
{
	e = e || window.event;

	if(e.preventDefault){
		e.preventDefault();
	}
	else{
		e.returnValue = false;
	}
},

mouseEnterIE: function(CallBack)
{
	return function(event)
	{
		if(event.fromElement && event.fromElement.nodeName != 'SELECT')
		{
			CallBack.call(event);
		}
	};
},

mouseEnter: function(CallBack)
{
	return function(event)
	{
		var relTarget = event.relatedTarget;
		if(Ot.isAChildOf(this, relTarget))
		{
			return;
		}

		CallBack.call(event);
	};
},

getTarget: function(event)
{
	return event.target || event.srcElement;
},

Key:
{
	BackSpace: 8,
	Tab: 9,
	Enter: 13,
	Escape: 27,
	Space: 32,
	PageUp: 33,
	PageDown: 34,
	End: 35,
	Debut: 36,
	Left: 37,
	Up: 38,
	Right: 39,
	Down: 40,
	Delete: 46,

	isNumber: function(keyCode)
	{
		if(96 <= keyCode && keyCode <= 105){ //De 0 à 9
			return true;
		}
		else{
			return false;
		}
	}
},

getXMLHttpRequest: function()
{
	var xhr;

	if(window.XMLHttpRequest || window.ActiveXObject)
	{
		if(window.XMLHttpRequest){
			xhr = new XMLHttpRequest(); 
		}
		else{ // Internet Explorer <7
			try{ xhr = new ActiveXObject("Msxml2.XMLHTTP"); } 
			catch(e){ xhr = new ActiveXObject("Microsoft.XMLHTTP"); }
		}
		return xhr;
	}
	else
	{
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest... (AJAX)");
		return null;
	}
},

SendAjax: function(Type, Url, Param, CallBack)
{
	var sParam = '';
	for(var i in Param){
		if(sParam != ''){ sParam += '&'; }
		sParam += encodeURIComponent(i)+ '=' +encodeURIComponent(Param[i]);
	}

	var xhr = Ot.getXMLHttpRequest();
	if(xhr && xhr.readyState != 0){ xhr.abort(); }

	if(Type == 'POST')
	{
		xhr.open(Type, Url, true);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4){ CallBack(xhr); }
		};

		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(sParam);
	}
	else if(Type == 'GET')
	{
		xhr.open(Type, Url+'?'+sParam, true);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4){ CallBack(xhr); }
		};

		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(null);
	}
},

decodeAjaxReturn: function(Rtext, onSucced, onFail)
{
	try
	{
		var Rjs = JSON.decode(Rtext);
	}
	catch(e)
	{
	}

	if(Rjs && Rjs != false)
	{
		if(Rjs.error == 0){
			onSucced(Rjs.description);
		}
		else if(Rjs.error == 1){
			onFail(Rjs.description);
		}

		if(Rjs.onload != ''){
			eval(Rjs.onload);
		}
	}
	else
	{
		onFail(Ot.clearPhpError(Rtext, 'encode'));
	}
},

clearPhpError: function(Text)
{
	return Text.replace(/<.[^>]*>/g, '').replace(/&quot;/g, '"');
},

getCompletUrl: function(Url)
{
	if(typeof(Url) !== 'string' || Url.match(/^https?:\/\//i) || Url.match(/^\//)){
		return Url;
	}

	var currentURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
	var indexSlash = window.location.pathname.lastIndexOf('/');

	if(indexSlash <= 0){
		var path = '/';
	}
	else{
		var path = window.location.pathname.substr(0, indexSlash) + '/';
	}

	return currentURL + path + Url;
},

getGETFromUrl: function(Url, Parametre)
{
	Parametre = Parametre.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

	var regex = new RegExp("[\\?&]"+Parametre+"=([^&#]*)");
	var results = regex.exec(Url);

	if(results == null){
		return '';
	}
	else{
		return results[1];
	}
},

getBrowserSize: function()
{
	var SizeX = (document.documentElement && document.documentElement.clientWidth) || window.innerWidth || document.body.clientWidth;
	var SizeY = (document.documentElement && document.documentElement.clientHeight) || window.innerHeight || document.body.clientHeight;

	return { x: SizeX, y: SizeY };
},

getPageSize: function()
{
	var SizeX = (document.documentElement && document.documentElement.scrollWidth) || window.innerWidth + window.scrollMaxX || document.body.scrollWidth;
	var SizeY = (document.documentElement && document.documentElement.scrollHeight) || window.innerHeight + window.scrollMaxY || document.body.scrollHeight;

	return { x: SizeX, y: SizeY };
},

getPageScroll: function()
{
	var ScrollX = (document.documentElement && document.documentElement.scrollLeft) || window.pageXOffset || document.body.scrollLeft;
	var ScrollY = (document.documentElement && document.documentElement.scrollTop) || window.pageYOffset || document.body.scrollTop;

	return { x: ScrollX, y: ScrollY };
},

isBody: function(Obj)
{
	return (/^(?:body|html)$/i).test(Obj.tagName);
},

getObjScroll: function(Obj)
{
	var element = Obj;
	var position = { x: 0, y: 0 };

	if(this.isBody(Obj)){ return position; }

	while(element && !this.isBody(element))
	{
		position.x += element.scrollLeft;
		position.y += element.scrollTop;
		element = element.parentNode;
	}

	return position;
},

getObjOffset: function(Obj)
{
	var element = Obj;
	var position = { x: 0, y: 0 };

	if(this.isBody(Obj)){ return position; }

	while(element && !this.isBody(element))
	{
		position.x += element.offsetLeft;
		position.y += element.offsetTop;

		if(Browser.Engine.gecko)
		{
			if(Ot.getValueOfObjPropr(element, '-moz-box-sizing') != 'border-box')
			{
				position.x += Ot.getNumberOfObjPropr(element, 'border-left-width');
				position.y += Ot.getNumberOfObjPropr(element, 'border-top-width');
			}

			var parent = element.parentNode;
			if(parent && Ot.getValueOfObjPropr(parent, 'overflow') != 'visible')
			{
				position.x += Ot.getNumberOfObjPropr(parent, 'border-left-width');
				position.y += Ot.getNumberOfObjPropr(element, 'border-top-width');
			}
		}
		else if(element != Obj && Browser.Engine.webkit)
		{
			position.x += Ot.getNumberOfObjPropr(element, 'border-left-width');
			position.y += Ot.getNumberOfObjPropr(element, 'border-top-width');
		}

		element = element.offsetParent;
	}

	if(Browser.Engine.gecko && Ot.getValueOfObjPropr(Obj, '-moz-box-sizing') != 'border-box')
	{
		position.x += Ot.getNumberOfObjPropr(Obj, 'border-left-width');
		position.y += Ot.getNumberOfObjPropr(Obj, 'border-top-width');
	}

	return position;
},

getObjPosition: function(Obj, Relative)
{
	var Scroll = this.getObjScroll(Obj);
	var Offset = this.getObjOffset(Obj);

	var position = {
		x: Offset.x - Scroll.x,
		y: Offset.y - Scroll.y
	};

	var relativePosition = (Relative) ? Ot.getObjPosition(Relative) : { x: 0, y: 0 };

	return {
		x: position.x - relativePosition.x,
		y: position.y - relativePosition.y
	};
},

getMousePosition: function(event)
{
	var PageScroll = Ot.getPageScroll();

	return { x: event.clientX + PageScroll.x, y: event.clientY + PageScroll.y };
},

setLeftTop: function(Obj, Left, Top)
{
	if(Left == 'Center' || Top == 'Center'){
		var BrowserSize = Ot.getBrowserSize();
	}

	if(Left == 'Center'){
		Left = (BrowserSize.x - Obj.offsetWidth)/2;
	}
	if(Top == 'Center'){
		Top = (BrowserSize.y - Obj.offsetHeight)/2 + Ot.getPageScroll().y;
		if(Top < 0){ Top = 0; }
	}

	Obj.style.left = Left + 'px';
	Obj.style.top = Top + 'px';
},

setScrollOpt: function(Parent, Child)
{
	var ChildTop = Child.offsetTop;
	var ChildHeight = Child.offsetHeight;

	if(ChildTop + ChildHeight + 10 > Parent.offsetHeight)
	{
		Parent.scrollTop = ChildTop - 20;
	}
	else
	{
		Parent.scrollTop = 0;
	}
},

isBetween: function(Min, Nbr, Max)
{
	if(Min < Nbr && Nbr < Max){
		return true;
	}
	else{
		return false;
	}
},

hasClass: function(Obj, Class)
{
	var Reg = new RegExp('(\\s|^)'+Class+'(\\s|$)');

	if(Obj.className && Reg.test(Obj.className)){
		return true;
	}
	else{
		return false;
	}
},

removeClass: function(Obj, Class)
{
	if(Ot.hasClass(Obj, Class))
	{
		var Reg = new RegExp('(\\s|^)'+Class+'(\\s|$)');
		Obj.className = Obj.className.replace(Reg, ' ');
	}
},

addClass: function(Obj, Class)
{
	if(!Ot.hasClass(Obj, Class))
	{
		Obj.className += ' '+Class;
	}
},

insertAfter: function(New, Obj)
{
	if(Obj.nextSibling){
		Obj.parentNode.insertBefore(New, Obj.nextSibling);
	}
	else{
		Obj.parentNode.appendChild(New);
	}
},

getElementsByClassName: function(className, Tag, Parent)
{
	var R = [];
	var element = Parent.getElementsByTagName(Tag);

	for(var i = 0; i < element.length; i++)
	{
		if(Ot.hasClass(element[i], className)){
			R.push(element[i]);
		}
	}
	return R;
},

getWidthFont: function(Texte, font, size, weight, type, To)
{
	var oSpan = document.createElement(type);
	oSpan.innerHTML = Texte;
	oSpan.style.fontFamily = font;
	oSpan.style.fontSize = size;
	oSpan.style.fontWeight = weight;
	To.appendChild(oSpan);

	var Width = oSpan.offsetWidth;
	To.removeChild(oSpan);
	return Width;
},

getValueOfObjPropr: function(Obj, Propr)
{
	var Value = false;

	if(Obj.currentStyle){
        Propr = Propr.replace(/\-(\w)/g, function(strMatch, p1){ return p1.toUpperCase(); });
		Value = Obj.currentStyle[Propr];
	}
	else if(window.getComputedStyle){
		Value = document.defaultView.getComputedStyle(Obj, null).getPropertyValue(Propr);
	}

	return Value;
},

getNumberOfObjPropr: function(Obj, Propr)
{
	var Value = this.getValueOfObjPropr(Obj, Propr);

	if(Value){
		return parseInt(Value, 10);
	}
	else{
		return 0;
	}
},

getRandId: function(Base)
{
	var i = 0;
	var Id;

	do
	{
		i += 1;
		Id = Base + Ot.getRandNbr(4); //4 Chiffres

		if(i > 50){ // id saturé
			Id = Base + Ot.getTime();
			break;
		}
	}
	while(document.getElementById(Id));

	return Id;
},

getRandNbr: function(Len)
{
	return Math.floor(Math.random() * Math.pow(10, Len));
},

CombineHash: function(Hash1, Hash2)
{
	for(var i in Hash2)
	{
		Hash1[i] = Hash2[i];
	}
	return Hash1;
},

getArrayLength: function(Array)
{
	var y = 0;
	for(var i in Array)
	{
		y++;
	}
	return y;
},

CloneObjet: function(Objet)
{
	if(typeof(Objet) != 'object' || Objet == null)
	{
		return Objet;
	}

	var newObjet = Objet.constructor();

	for(var i in Objet)
	{
		newObjet[i] = Ot.CloneObjet(Objet[i]);
	}

	return newObjet;
},

ArrayRemove: function(Array, Nb)
{
	Array.splice(Nb,1);
	return Array;
},

getKeyArrayValue: function(Array, Value)
{
	var key = false;

	for(var i in Array)
	{
		if(Array[i] == Value)
		{
			key = i;
			break;
		}
	}

	return key;
},

isInArray: function(needle, Array, argStrict)
{
	var found = false, key, strict = !!argStrict;

	for(var key in Array)
	{
		if((strict && Array[key] === needle) || (!strict && Array[key] == needle))
		{
			found = true;
			break;
		}
	}

	return found;
},

removeDoublonArray: function(Array)
{
	var listeK = {};
	for(var i = 0; i < Array.length; i++)
	{
		listeK[Array[i]] = i;
	}

	Array = [];
	var x = 0;
	for(var y in listeK)
	{
		if(isNaN(listeK[y]))
		{
			Array[listeK[y]] = y;
		}
		else{
			Array[x] = y;
		}

		x++;
	}

	return Array;
},

getTextLenMax: function(Txt, LenMax)
{
	var LenAct = Txt.length;

	if(LenAct > LenMax)
	{
		var LenMid = Math.round(LenMax / 2) - 1;

		return Txt.substring(0, LenMid)+'...'+Txt.substring(LenAct-LenMid-3, LenAct);
	}
	else{
		return Txt;
	}
},

removeTagHtml: function(Txt)
{
	return Txt.replace(/(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)|(<!--.*?-->)/gim, '');
},

moveScroll: function(ToY, CallBack)
{
	var Act = Ot.getPageScroll().y;

	if(ToY == 'Bottom'){
		ToY = Ot.getPageSize().y - Ot.getBrowserSize().y;
	}

	if(ToY != Act)
	{
		Ot.stopFx(document);
		new Fx(document, { From: Act, To: ToY, Mode: 'scroll', duree: 1000, CallBack: CallBack });
	}
	else
	{
		if(Ot.isFonc(CallBack)){
			CallBack();
		}
	}
},

setOpacity: function(obj, value)
{
	obj.style.filter = 'alpha(opacity:'+ Math.round(value*100) +')';
	obj.style.opacity = value;
},

Obj: function(Type, Atribut, Html, append)
{
	var Obj = document.createElement(Type);

	for(var i in Atribut)
	{
		eval('Obj.'+i+' = "'+Atribut[i]+'"');
	}

	if(Html){
		Obj.innerHTML = Html;
	}
	if(append){
		append.appendChild(Obj);
	}

	return Obj;
},

Cumulator: function(event, Obj, CallBack)
{
	if(event.type == 'mousedown')
	{
		CallBack();

		Ot.addEvent(Obj, 'mouseup', function()
		{
			window.clearInterval(Timer);
			CallBack = null;
		});

		Ot.addEvent(Obj, 'mouseout', function()
		{
			window.clearInterval(Timer);
			CallBack = null;
		});

		var Timer = window.setInterval(function()
		{
			window.clearInterval(Timer);
			Timer = window.setInterval(function(){ CallBack(); }, 50);
		}, 250);
	}
},

getDeltaWheel: function(event)
{
	var Delta = 0;

	if(event.wheelDelta){
		Delta = event.wheelDelta / 120;
		if(window.opera){ Delta = -Delta; }
	}
	else if(event.detail){
		Delta = -event.detail / 3;
	}

	if(Ot.CClient()[0] == 'Opera'){ //Bug inversion
		Delta = -Delta;
	}

	return Delta; // 1 ou -1
},

getCursorPosition: function(Input)
{
	Input.focus();

	var selectionStart = false;
	var selectionEnd = false;

	if(typeof Input.selectionStart != 'undefined')
	{
		selectionStart = Input.selectionStart;
		selectionEnd = Input.selectionEnd;
	}
	else if(typeof document.selection != 'undefined')
	{
		var range = document.selection.createRange();
		selectionStart = Math.abs(document.selection.createRange().moveStart('character', -1000000));
		selectionEnd = selectionStart + range.text.length;
	}

	return { start: selectionStart, end: selectionEnd };
},

setCursorPosition: function(Input, Position)
{
	Input.focus();

	if(Position == 'End'){
		var Start = Input.value.length;
		var End = Input.value.length;
	}
	else if(Position == 'Start'){
		var Start = 0;
		var End = 0;
	}
	else{
		var Start = Position.start;
		var End = Position.end;
	}

	if(typeof Input.selectionStart != 'undefined')
	{
		Input.setSelectionRange(Start, End);
	}
	else if(typeof document.selection != 'undefined')
	{
		var Range = Input.createTextRange();
		Range.moveStart('character', Start);
		Range.collapse(true);
		Range.moveEnd('character', End-Start);
		Range.select();
	}
},

addTextInInputPosition: function(Input, Txt)
{
	var CursorPosition = this.getCursorPosition(Input);
	var TxtEnd = CursorPosition.start + Txt.length;

	Input.value = Input.value.substr(0, CursorPosition.start) + Txt + Input.value.substr(CursorPosition.end);

	this.setCursorPosition(Input, { start: TxtEnd, end: TxtEnd});
},

addScript: function(Document)
{
	var script = Document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	Document.getElementsByTagName('head')[0].appendChild(script);

	return script;
},

addStyle: function(Document)
{
	var link = Document.createElement('link');
	link.setAttribute('type', 'text/css');
	link.rel = 'stylesheet';
	Document.getElementsByTagName('head')[0].appendChild(link);

	return link;
},

isFonc: function(Fonc)
{
	if(Fonc && typeof Fonc == 'function'){
		return true;
	}
	else{
		return false;
	}
},

isAChildOf: function(Parent, Child)
{
	while(Child && Child !== Parent)
	{
		Child = Child.parentNode;
	}

	return Child === Parent;
},

infoPopup: [],

openPopup: function(Loc, Width, Height)
{
	if(!Ot.infoPopup[Loc] || Ot.infoPopup[Loc].closed)
	{
		var screenLeft = window.screenX || window.screenLeft;
		var screenTop = window.screenY || window.screenTop;

		if(Width == 'Full')
		{
			var availWidth = screen.availWidth;

			Width = availWidth*0.8;
			Height = screen.availHeight;

			var Left = availWidth*0.1;
			var Top = 0;
		}
		else{
			var Left = screenLeft+15;
			var Top = screenTop+15;
		}

		var Pop = window.open(Loc, '', 'toolbar=0, location=0, directories=0, status=0, scrollbars=1, resizable=1, copyhistory=0, menubar=0, width='+Width+', height='+Height+', left='+Left+', top='+Top);

		if(Pop){
			Ot.infoPopup[Loc] = Pop;
		}
		else{
			alert('Votre navigateur a bloqué la pop-up.\nVeuillez désactiver votre bloqueur de pop-ups pour l\'ouvrir.');
		}
	}
	else
	{
		Ot.infoPopup[Loc].close();
		delete Ot.infoPopup[Loc];
		Ot.openPopup(Loc, Width, Height);
	}
},

domReady:
{
	add: function(fn) // Ot.domReady.add(function() { alert("domready"); });
	{
		if(Ot.domReady.loaded){ return fn(); }

		var observers = Ot.domReady.observers;
		if (!observers){ observers = Ot.domReady.observers = []; }
		observers.push(fn);

		if(Ot.domReady.callback){ return '0'; }

		Ot.domReady.callback = function()
		{
			if(Ot.domReady.loaded){ return; }

			Ot.domReady.loaded = true;
			if(Ot.domReady.timer)
			{
				window.clearInterval(Ot.domReady.timer);
				Ot.domReady.timer = null;
			}

			var observers = Ot.domReady.observers;
			for(var i = 0, length = observers.length; i < length; i++)
			{
				var fn = observers[i];
				observers[i] = null;
				fn(); // make 'this' as window
			}
			Ot.domReady.callback = Ot.domReady.observers = null;
		};

		var isIe = !!(window.attachEvent && !window.opera);
		var webkit = navigator.userAgent.indexOf('AppleWebKit/') > -1;

		if(document.readyState && webkit) // Apple WebKit (Safari, OmniWeb, ...)
		{
			Ot.domReady.timer = window.setInterval(function()
			{
				var state = document.readyState;
				if(state == 'loaded' || state == 'complete'){
					Ot.domReady.callback();
				}
			}, 50); 
		}
		else if(document.readyState && isIe){ // Windows IE
			var src = (window.location.protocol == 'https:') ? '://0' : 'javascript:void(0)';
			document.write('<script defer="defer" src="'+src+'" onreadystatechange="if(this.readyState == \'complete\'){ Ot.domReady.callback(); }"><\/script>');
		}
		else
		{
			if(window.addEventListener){ // for Mozilla browsers, Opera 9
				document.addEventListener('DOMContentLoaded', Ot.domReady.callback, false);
				window.addEventListener('load', Ot.domReady.callback, false);
			}
			else if(window.attachEvent){
				window.attachEvent('onload', Ot.domReady.callback);
			}
			else{ // Legacy browsers (e.g. Mac IE 5)
				window.onload = function()
				{
					Ot.domReady.callback();
					if(fn){ fn(); }
				};
			}
		}

		return '0';
	}
},

Extend: function(Class, Method)
{
	var o = Class.prototype;

	for(var i in Method)
	{
		o[i] = Method[i];
	}
},

getTime: function(){
	return +new Date;
},

forEach: function(object, block, context)
{
	if(object)
	{
		if(object instanceof Function)
		{
			Function.forEach(object, block, context);
		}
		else if(object.forEach instanceof Function)
		{
			object.forEach(block, context);
		}
		else if(typeof object == 'string')
		{
			String.forEach(object, block, context);
		}
		else if(typeof object.length == 'number')
		{
			Array.forEach(object, block, context);
		}
	}
},

stopFx: function(Obj)
{
	var List = ListFx[Obj];

	if(List && List.length > 0)
	{
		while(typeof List[0] != 'undefined')
		{
			List[0].setStyle(List[0].From, List[0].To, 1);
			List[0].Complete();
		}
	}

	ListFx[Obj] = [];
}

};


if(!Array.forEach)
{
	Array.forEach = function(array, CallBack, context)
	{
		for(var i = 0; i < array.length; i++)
		{
			CallBack.call(context, array[i], i, array);
		}
	};
}

Function.prototype.forEach = function(object, CallBack, context)
{
	for(var key in object)
	{
		if(typeof this.prototype[key] == "undefined")
		{
			CallBack.call(context, object[key], key, object);
		}
	}
};

String.forEach = function(string, CallBack, context)
{
	Array.forEach(string.split(''), function(chr, index)
	{
		CallBack.call(context, chr, index, string);
	});
};


var ListFx = {};

var Fx = function(Obj, Param)
{
	this.Obj = Obj;

	for(var i in Param){ //Initaalisation Var
		this[i] = Param[i];
	}

	if(!this.From && isNaN(this.From))
	{
		var prop = 'offset' + this.Mode.substring(0,1).toUpperCase() + this.Mode.substring(1,this.Mode.length).toLowerCase();
		eval('this.From = this.Obj.'+prop+';');
	}

	this.time = 0;
	this.transition = this.getTransition(this.Tran);

	this.startTimer();
};

Ot.Extend(Fx,{

interv: 50,
duree: 500,
Tran: 'def',

Step: function()
{
	var time = Ot.getTime();

	if(time < this.time + this.duree)
	{
		var delta = this.transition((time - this.time) / this.duree);
		this.setStyle(this.From, this.To, delta);
	}
	else //End
	{
		this.setStyle(this.From, this.To, 1);
		this.Complete();
	}
},

Calcu: function(From, To, Delta)
{
	return (To - From) * Delta + From;
},

setStyle: function(From, To, Delta)
{
	try
	{
		var Var = this.Calcu(From, To, Delta);

		if(this.Mode == 'opacity'){
			Ot.setOpacity(this.Obj, Var);
		}
		else if(this.Mode == 'scroll'){
			window.scrollTo(0, Var);
		}
		else if(this.Mode == 'backgroundColor' || this.Mode == 'color')
		{
			var FromRgb = Colors.HexToRgb(From);
			var ToRgb = Colors.HexToRgb(To);
			var r = this.Calcu(FromRgb.r, ToRgb.r, Delta);
			var g = this.Calcu(FromRgb.g, ToRgb.g, Delta);
			var b = this.Calcu(FromRgb.b, ToRgb.b, Delta);
			Var = Colors.RgbToHex({ r: r , g: g , b: b });

			eval('this.Obj.style.'+this.Mode+' = "'+Var+'";');
		}
		else{
			eval('this.Obj.style.'+this.Mode+' = "'+Var+'px";');
		}
	}
	catch(e)
	{
		this.Complete();
	}
},

Complete: function()
{
	if(this.stopTimer()){
		this.onComplete();
	}
},

onComplete: function()
{
	if(Ot.isFonc(this.CallBack)){
		this.CallBack();
	}
},

getTransition: function(Mode)
{
	if(Mode == 'def'){
		return function(p){ return -(Math.cos(Math.PI * p) - 1)/2; };
	}
	else if(Mode == 'Back')
	{
		var transition = function(p){
			var x = 1.618;
			return Math.pow(p, 2) * ((x + 1) * p - x);
		};
		return function(p){ return (p <= 0.5) ? transition(2 * p) / 2 : (2 - transition(2 * (1 - p))) / 2; };
	}
	else{
		return function(p) { return 1 - (Math.cos(p * 3.5 * Math.PI) * Math.exp(-p * 4.5));	};
	}
},

startTimer: function()
{
	if(!ListFx[this.Obj]){
		ListFx[this.Obj] = [];
	}

	ListFx[this.Obj].push(this);

	if(this.timer){ return false; }
	this.time = Ot.getTime() - this.time;
	var self = this;
	this.timer = window.setInterval(function(){ self.Step();}, this.interv);
	return true;
},

stopTimer: function()
{
	var Index = Ot.getKeyArrayValue(ListFx[this.Obj], this);

	Ot.ArrayRemove(ListFx[this.Obj], Index);

	if(!this.timer){ return false; }
	this.time = Ot.getTime() - this.time;
	this.timer = this.clearTimer(this.timer);
	return true;
},

clearTimer: function(timer){
	window.clearInterval(timer);
	return null;
}

});
