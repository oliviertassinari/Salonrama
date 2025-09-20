var Cadre = function(){};

Ot.Extend(Cadre,{

addFont: function()
{
	var Font = document.createElement('div');
	Font.className = 'CadFont';

	var CClient = Ot.CClient();
	if(CClient[0] == 'IExploreur' && CClient[1] < '7.0')
	{
		var PageSize = Ot.getPageSize();

		Font.style.position = 'absolute';
		Font.style.width = PageSize.x+'px';
		Font.style.height = PageSize.y+'px';
	}

	document.body.appendChild(Font);

	this.Font = Font;

	return Font;
},

suprFont: function()
{
	document.body.removeChild(this.Font);
},

addCadre: function(Head, Cont, Width)
{
	var Cadre = document.createElement('div');
	Cadre.className = 'CadGlobal';
	Cadre.innerHTML = '<div class="CadGlobalShadow"></div><div class="CadGlobalMiddle"><div class="CadGlobalMiddle2">'+
							'<div class="CadGlobalHead"><h2>'+Head+'</h2></div>'+
							'<div class="CadGlobalCon">'+Cont+'</div>'+
					  '</div></div>';

	Cadre.style.width = Width;

	Ot.setOpacity(Cadre.firstChild, 0.7);
	Ot.setOpacity(Cadre.lastChild.firstChild, 1);

	document.body.appendChild(Cadre);

	if(Width.indexOf('%') != -1){
		Cadre.style.top = '25%';
		Cadre.style.left = Math.round(Width.replace('%', '')/2)+'%';
	}
	else
	{
		Cadre.style.display = 'block';
		Ot.setLeftTop(Cadre, 'Center', 160);
		Cadre.style.display = 'none';

		this.onResize = function()
		{
			if(Cadre.style.display == 'block')
			{
				Ot.setLeftTop(Cadre, 'Center', 'Center');
			}
		};

		Ot.addEvent(window, 'resize', this.onResize);
	}

	this.Head = Cadre.lastChild.firstChild.firstChild;
	this.Cadre = Cadre;

	return Cadre;
},

suprCadre: function()
{
	if(this.onResize && Ot.isFonc(this.onResize))
	{
		Ot.stopEvent(window, 'resize', this.onResize);
		this.onResize = '';
	}

	document.body.removeChild(this.Cadre);
}

});



var CadInfo = {

Cad: new Cadre(),

open: function(Head, Html)
{
	this.Cad.addFont();
	this.Cad.addCadre(Head, Html, '50%');
	Ot.setOpacity(this.Cad.Font, 0);
	this.Cad.Font.style.display = 'block';
	this.Cad.Head.style.cursor = 'default';

	new Fx(this.Cad.Font, { From: 0, To: 0.4, Mode: 'opacity', CallBack: function(){ CadInfo.Cad.Cadre.style.display = 'block'; } });
},

close: function()
{
	var Cad = CadInfo.Cad;

	Cad.suprCadre();
	new Fx(Cad.Font, { From: 0.4, To: 0, Mode: 'opacity', CallBack: function(){ Cad.suprFont(); } });
}

};


var CadPrompt = {

Cad: new Cadre(),
Busy: false,
CallBack: function(){},

open: function(Nom, Question, Act, CallBack, LocFileHome)
{
	if(this.Busy === false)
	{
		if(!LocFileHome){
			LocFileHome = '';
		}

		this.Busy = true;
		this.CallBack = CallBack;

		var Html = '<div style="margin:10px 10px 20px;"><strong>'+Question+' : </strong><br/><input type="text" class="FormInputText" maxlength="50" style="width:330px;"/>'+
				   '</div><div class="CadFoot"><button type="button" class="button-small button-small-red" onclick="CadPrompt.close()">Annuler</button>'+
				   '<button type="button" class="button-small button-small-green" onclick="CadPrompt.valide()"><i class="icon-ok"></i>OK</button>'+
				   '<div class="Clear"></div></div>';

		this.Cad.addFont();
		Ot.setOpacity(this.Cad.Font, 0);
		this.Cad.addCadre(Nom, Html, '400px');
		this.Cad.Head.style.cursor = 'default';

		new Fx(this.Cad.Font, { From: 0, To: 0.4, Mode: 'opacity' });

		var Input = this.Cad.Cadre.getElementsByTagName('input')[0];
		Input.value = Act;

		this.Cad.Font.style.display = 'block';
		this.Cad.Cadre.style.display = 'block';

		Input.focus();
		Input.select();

		Ot.addEvent(document, 'keydown', CadPrompt.valide);
	}
},

valide: function(event)
{
	if(event)
	{
		if(event.keyCode == Ot.Key.Enter){
			CadPrompt.valide();
		}
	}
	else
	{
		var Var = this.Cad.Cadre.getElementsByTagName('input')[0].value;

		this.CallBack(Var);

		this.close();
	}
},

close: function()
{
	Ot.stopEvent(document, 'keydown', CadPrompt.valide);
	this.Cad.suprCadre();
	this.Cad.suprFont();
	this.CallBack = function(){};
	this.Busy = false;
}

};



var GCadre = {

List: {},

add: function(Id, Head, Width, Titre, Con, Foot)
{
	if(!document.getElementById(Id)) // Si il est pas deja créée
	{
		var Cad = new Cadre();

		var Html = '<div class="CadClose" title="Fermer ce cadre" onclick="GCadre.close(\''+Id+'\')"></div>'+
		'<div id="'+Id+'Titre" class="CadGlobalConHead CadColor CadOrange">'+Titre+'</div>'+
		'<div id="'+Id+'Con">'+Con+'</div>'+
		'<div id="'+Id+'Foot" class="CadFoot Clear">'+Foot+'</div>';

		Cad.addCadre(Head, Html, Width);
		Cad.Cadre.id = Id;
		Cad.Head.onmousedown = function(e){
			e = e || window.event;
			GCadreDrag.start(e, Id);
		};
		Cad.Head.title = 'Déplacer ce cadre';

		this.List[Id] = { Open: false, CallBack: '', dontClose: false };

		return true;
	}
	else{
		return false;
	}
},

open: function(Id, CallBack)
{
	var Obj = document.getElementById(Id);

	if(Obj.style.display != 'block')
	{
		Obj.style.display = 'block';
		Ot.setLeftTop(Obj, 'Center', 160);
		Ot.setOpacity(Obj, 1);

		Ot.addEvent(document, 'mousedown', GCadre.event);
		Ot.addEvent(document, 'keydown', GCadre.event);

		if(GWys.Act.Win)
		{
			Ot.addEvent(GWys.Act.Win.document, 'keydown', GCadre.event);
		}

		this.List[Id] = { Open: true, CallBack: CallBack, dontClose: false };
	}
},

event: function(event)
{
	var isOut = true;

	var Target = Ot.getTarget(event);
	var Obj = Target;
	while(Obj)
	{
		if(Ot.hasClass(Obj, 'CadGlobal') || Ot.hasClass(Obj, 'CadImagePreVis'))
		{
			isOut = false;
			Obj = false;
		}
		else{
			Obj = Obj.parentNode;
		}
	}

	if(event.type == 'keydown' && (event.ctrlKey || event.shiftKey || event.altKey || event.keyCode == 20)){
		isOut = false;
	}

	if(isOut)
	{
		GCadre.closeAll();
	}
},

closeAll: function()
{
	for(var Id in this.List)
	{
		if(this.List[Id].Open === true)
		{
			this.close(Id);
		}
	}
},

close: function(Id)
{
	if(GCadre.List[Id].dontClose == false)
	{
		Ot.stopEvent(document, 'mousedown', GCadre.event);
		Ot.stopEvent(document, 'keydown', GCadre.event);

		for(var i in GWys.List)
		{
			if(GWys.List[i].Win){
				Ot.stopEvent(GWys.List[i].Win.document, 'keydown', GCadre.event);
			}
		}

		var CallBack = this.List[Id].CallBack;

		if(Ot.isFonc(CallBack)){
			CallBack();
			this.List[Id].CallBack = '';
		}

		var Cad = document.getElementById(Id);

		new Fx(Cad, { From: 1, To: 0, Mode:'opacity', duree: 450, CallBack: function()
		{
			Cad.style.display = 'none';
			Cad.style.top = '-1000px';
			Cad.style.left = '-1000px';

			GCadre.List[Id] = { Open: false, CallBack: '' };
		}});
	}
}

};

var CadScreenFull = {

Cad: new Cadre(),
CallBack: function(){},

open: function(Html, CallBack)
{
	this.CallBack = CallBack;

	var CadScreenFullObj = document.createElement('div');
	CadScreenFullObj.id = 'CadScreenFull';
	CadScreenFullObj.className = 'CadScreenFull';
	CadScreenFullObj.innerHTML = Html;

	this.Cad.addFont();
	Ot.setOpacity(this.Cad.Font, 0);
	new Fx(this.Cad.Font, { From: 0, To: 0.4, Mode: 'opacity' });

	document.body.appendChild(CadScreenFullObj);

	this.Cad.Font.style.display = 'block';

	this.setCentrer();

	var CadScreenFullClose = document.createElement('div');
	CadScreenFullClose.id = 'CadScreenFullClose';
	CadScreenFullClose.title = 'Fermer ce cadre';
	CadScreenFullClose.onclick = function(){ CadScreenFull.close(); };
	document.body.appendChild(CadScreenFullClose);

	Ot.addEvent(window, 'resize', CadScreenFull.setCentrer);
	Ot.addEvent(window, 'keyup', CadScreenFull.keyup);
},

keyup: function(event)
{
	if(event.keyCode == Ot.Key.Escape)
	{
		CadScreenFull.close();
	}
},

setCentrer: function()
{
	var Obj = document.getElementById('CadScreenFull');
	var BrowserSize = Ot.getBrowserSize();

	var Width = BrowserSize.x - 200;
	var Height = BrowserSize.y - 200;

	Obj.style.width = Width + 'px';
	Obj.style.height = Height + 'px';
},

close: function()
{
	Ot.stopEvent(window, 'resize', CadScreenFull.setCentrer);
	Ot.stopEvent(window, 'keyup', CadScreenFull.keyup);

	document.body.removeChild(document.getElementById('CadScreenFull'));
	document.body.removeChild(document.getElementById('CadScreenFullClose'));
	this.Cad.suprFont();

	if(Ot.isFonc(this.CallBack))
	{
		this.CallBack();
	}
}

};

var GCadreDrag = {

data: {},

start: function(event, Id)
{
	Ot.cancelEvent(event);

	this.data.Cadre = document.getElementById(Id);

	var ObjPosition = Ot.getObjPosition(this.data.Cadre);
	var MousePosition = Ot.getMousePosition(event);

	this.data.dX = MousePosition.x - ObjPosition.x;
	this.data.dY = MousePosition.y - ObjPosition.y;

	GBlock.setProtect('block', 'move');

	Ot.addEvent(document, 'mousemove', GCadreDrag.move);
	Ot.addEvent(document, 'mouseup', GCadreDrag.stop);
},

move: function(event)
{
	Ot.cancelEvent(event);

	var MousePosition = Ot.getMousePosition(event);
	var Left = MousePosition.x - GCadreDrag.data.dX;
	var	Top = MousePosition.y - GCadreDrag.data.dY;

	Ot.setLeftTop(GCadreDrag.data.Cadre, Left, Top);
},

stop: function()
{
	Ot.stopEvent(document, 'mousemove', GCadreDrag.move);
	Ot.stopEvent(document, 'mouseup', GCadreDrag.stop);

	GBlock.setProtect('none');

	GCadreDrag.data = {};
}

};

var CadWin = {

List: {},

DetectEvent: function(ObjId)
{
	Ot.addEvent(document, 'mousedown', CadWin.closeAll);
	Ot.addEvent(document, 'keydown', CadWin.closeAll);

	if(GWys.Act.Win)
	{
		Ot.addEvent(GWys.Act.Win.document, 'keydown', CadWin.closeAll);
	}

	this.List[ObjId] = 1;
},

closeAll: function(event)
{
	var isOut = true;

	if(event)
	{
		var Target = Ot.getTarget(event);
		var Obj = Target;
		while(Obj)
		{
			if(Ot.hasClass(Obj, 'CadWin')){
				isOut = false;
				Obj = false;
			}
			else{
				Obj = Obj.parentNode;
			}
		}
	}

	if(isOut == true)
	{
		for(var Id in CadWin.List)
		{
			if(CadWin.List[Id] == 1)
			{
				if(Id == 'CadContextMenu')
				{
					CadContextMenu.close(event);
				}
				else if(Id == 'CadPolice' || Id == 'CadTaille')
				{
					CadPoliceTaille.close(event, Id);
				}
				else if(Id == 'CadCouleur')
				{
					CadCouleur.close(event);
				}
			}
		}
	}
},

close: function(Id, CallBack)
{
	Ot.stopEvent(document, 'mousedown', CadWin.closeAll);
	Ot.stopEvent(document, 'keydown', CadWin.closeAll);

	for(var i in GWys.List)
	{
		Ot.stopEvent(GWys.List[i].Win.document, 'keydown', CadWin.closeAll);
	}

	var Obj = document.getElementById(Id);
	var self = this;

	new Fx(Obj, { From: 1, To: 0, Mode: 'opacity', CallBack: function()
	{
		Obj.style.display = 'none';
		Obj.style.top = '-1000px';
		Obj.style.left = '-1000px';
		delete self.List[Obj.id];

		if(Ot.isFonc(CallBack)){
			CallBack();
		}
	}, duree: 450 });
}

};

var CadContextMenu = {

open: function(event)
{
	Ot.cancelEvent(event);

	var Obj = document.getElementById('CadContextMenu');
	var PosObjRelative = Ot.getObjPosition(GWys.Act.Iframe);
	var MousePosition = Ot.getMousePosition(event);

	var SelectList = Ot.getElementsByClassName('CadOption', 'div', Obj);
	if(GWys.getSelect().text == '')
	{
		Ot.addClass(SelectList[0], 'disable');
		SelectList[0].firstChild.style.backgroundPosition = '-16px 0';
		Ot.addClass(SelectList[1], 'disable');
		SelectList[1].firstChild.style.backgroundPosition = '-16px -16px';
	}
	else{
		Ot.removeClass(SelectList[0], 'disable');
		SelectList[0].firstChild.style.backgroundPosition = '0 0';
		Ot.removeClass(SelectList[1], 'disable');
		SelectList[1].firstChild.style.backgroundPosition = '0 -16px';
	}

	var Etat = GWys.PreSuiv('Act');
	if(Etat.isPre){
		Ot.removeClass(SelectList[4], 'disable');
		SelectList[4].firstChild.style.backgroundPosition = '0 -144px';
	}
	else{
		Ot.addClass(SelectList[4], 'disable');
		SelectList[4].firstChild.style.backgroundPosition = '-16px -144px';
	}


	Obj.style.display = 'block';
	Ot.setOpacity(Obj, 1);
	Ot.setLeftTop(Obj, MousePosition.x + PosObjRelative.x, MousePosition.y + PosObjRelative.y);
	CadWin.DetectEvent('CadContextMenu');

	GWys.setRange();
},

close: function(event)
{
	var Clique = event.which || event.button;
	if(!event || Clique == 1 || Clique == 0)
	{
		CadWin.close('CadContextMenu');
	}
}

};

var CadPoliceTaille = {

open: function(event, Mode)
{
	var ObjId = 'Cad'+Mode;
	var Obj = document.getElementById(ObjId);

	if(Obj.style.display != 'block')
	{
		if(Mode == 'Police'){
			var td = 0;
		}
		else{
			var td = 2;
		}

		var SelectList = document.getElementById('BOSelect').getElementsByTagName('td');
		var PosObjRelative = Ot.getObjPosition(SelectList[td].firstChild);

		Ot.addClass(SelectList[td], 'select');
		Ot.addClass(SelectList[td+1], 'select');

		this.setVarAct(Mode);

		Obj.style.display = 'block';
		Ot.setOpacity(Obj, 1);
		Ot.setLeftTop(Obj, PosObjRelative.x, PosObjRelative.y + Ot.getTarget(event).offsetHeight);
		CadWin.DetectEvent(ObjId);

		GWys.setRange();
	}
},

setVarAct: function(Mode)
{
	if(Mode == 'Police'){
		var nbr = 3;
		var VarDef = GWys.PoliceAct;
	}
	else{
		var nbr = 2;
		var VarDef = GWys.SizeAct;
	}

	var OptionList = document.getElementById('Cad'+Mode).getElementsByTagName('div');
	for(var i = 0; i < OptionList.length ; i += nbr)
	{
		if(OptionList[i].lastChild.innerHTML.toLowerCase() == VarDef){
			Ot.addClass(OptionList[i], 'hover');
		}
		else{
			Ot.removeClass(OptionList[i], 'hover');
		}
	}
},

resetVarAct: function(Mode)
{
	if(Mode == 'Police'){
		var nbr = 3;
	}
	else{
		var nbr = 2;
	}

	var OptionList = document.getElementById('Cad'+Mode).getElementsByTagName('div');
	for(var i = 0; i < OptionList.length ; i += nbr)
	{
		Ot.removeClass(OptionList[i], 'hover');
	}
},

close: function(event, Id)
{
	var SelectList = document.getElementById('BOSelect').getElementsByTagName('td');
	Ot.removeClass(SelectList[0], 'select');
	Ot.removeClass(SelectList[1], 'select');
	Ot.removeClass(SelectList[2], 'select');
	Ot.removeClass(SelectList[3], 'select');

	Ot.stopEvent(document, 'mousemove', GWys.showMove);
	GWys.ShowAct.Etat = 'End';

	CadWin.close(Id, function(){ GWys.ShowAct.isIniti = false; });
}

};

var CadCouleur = {

open: function()
{
	var Obj = document.getElementById('CadCouleur');

	if(Obj.style.display != 'block')
	{
		var Target = document.getElementById('BOCouleurInfo');
		var PosObjRelative = Ot.getObjPosition(Target);

		Ot.addClass(document.getElementById('BOCouleurInfo'), 'select');
		Ot.addClass(document.getElementById('BOCouleurOpen'), 'select');
		document.getElementById('BOCouleurDefault').style.background = GWys.CouleurAct;

		Obj.style.display = 'block';
		Ot.setOpacity(Obj, 1);
		Ot.setLeftTop(Obj, PosObjRelative.x, PosObjRelative.y + Target.offsetHeight);
		CadWin.DetectEvent('CadCouleur');

		GWys.setRange();
	}
},

setRecent: function(Couleur)
{
	var CadCouleurRecent = document.getElementById('CadCouleurRecent');
	var TdList = CadCouleurRecent.getElementsByTagName('table')[0].getElementsByTagName('td');
	var isIn = false;

	var a = document.createElement('a');
	a.style.background = Couleur;
	for(var i = 0; i < TdList.length; i++)
	{
		if(TdList[i].firstChild.style.background == a.style.background)
		{
			isIn = true;
			break;
		}
	}

	if(isIn == false)
	{
		CadCouleurRecent.style.display = 'block';
		TdList[9].firstChild.style.background = Couleur;
		TdList[9].style.visibility = 'visible';

		TdList[9].parentNode.insertBefore(TdList[9], TdList[0]);
	}
},

close: function(event)
{
	Ot.removeClass(document.getElementById('BOCouleurInfo'), 'select');
	Ot.removeClass(document.getElementById('BOCouleurOpen'), 'select');

	Ot.stopEvent(document, 'mousemove', GWys.showMove);
	GWys.ShowAct.Etat = 'End';

	CadWin.close('CadCouleur', function(){ GWys.ShowAct.isIniti = false; });
}

};

var CadACouleur = {

Act: { h: 0, s: 100, v: 100 },
isTxtSelect: false,

open: function()
{
	GCadre.add('CadACouleur', 'Autres Couleurs', '360px',
		'Ajouter une couleur personalisé',
		'<div id="CadACouleurPalette">'+
			'<div id="CadACouleurMap"></div>'+
			'<div id="CadACouleurMapHover"></div>'+
			'<div id="CadACouleurPoint" onmousedown="CadACouleur.startMap(event)"></div>'+
			'<div id="CadACouleurBarre"></div>'+
			'<div id="CadACouleurCursor" onmousedown="CadACouleur.startBarre(event)"></div>'+
		'</div>'+
		'<table class="Collapse">'+
		'<tr>'+
			'<td>Couleur : <input type="text" id="CadACouleurHex" class="FormInputText" value="#" style="width:70px;" maxlength="7" onkeyup="CadACouleur.onkeyHex()"/></td>'+
			'<td style="width:60px;"></td>'+
			'<td>Nouvelle&nbsp;</td>'+
			'<td><div id="CadACouleurNew"></div></td>'+
		'</tr>'+
		'<tr>'+
			'<td></td><td></td>'+
			'<td>Actuelle</td>'+
			'<td><div id="CadACouleurOld"></div></td>'+
		'</tr>'+
		'</table>',
		'<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadACouleur\')">Annuler</button>'+
		'<button type="button" class="button-small button-small-green" onclick="CadACouleur.apply()"><i class="icon-ok"></i>Appliquer</button>'+
		'<div class="Clear"></div>'
	);

	Ot.setOpacity(document.getElementById('CadACouleurMap'), 1);
	Ot.setOpacity(document.getElementById('CadACouleurMapHover'), 1);

	document.getElementById('CadACouleurOld').style.background = GWys.CouleurAct;

	Ot.addEvent(document.getElementById('CadACouleur'), 'mousewheel', CadACouleur.MouseWheel);
	Ot.addEvent(document.getElementById('CadACouleurMap'), 'mousedown', CadACouleur.startMap);
	Ot.addEvent(document.getElementById('CadACouleurBarre'), 'mousedown', CadACouleur.startBarre);

	GWys.setRange();

	this.isTxtSelect = false;
	this.set(GWys.CouleurAct);
	this.isTxtSelect = (GWys.getSelect().text != '') ? true : false;

	var WysAct = GWys.Act;

	GCadre.open('CadACouleur', function()
	{
		GWys.setRange(WysAct);
		WysAct.Doc.execCommand('forecolor', false, GWys.CouleurAct);

		Ot.stopEvent(document.getElementById('CadACouleur'), 'mousewheel', CadACouleur.MouseWheel);
		Ot.stopEvent(document.getElementById('CadACouleurMap'), 'mousedown', CadACouleur.startMap);
		Ot.stopEvent(document.getElementById('CadACouleurBarre'), 'mousedown', CadACouleur.startBarre);
	});
},

apply: function()
{
	var Hex = Color.HsvToHex(this.Act);

	GWys.CouleurAct = Hex;
	CadCouleur.setRecent(Hex);

	GCadre.close('CadACouleur');
},

set: function(Hex)
{
	if(Hex){
		var Hsv = Color.HexToHsv(Hex);

		this.Act.h = Hsv.h;
		this.Act.s = Hsv.s;
		this.Act.v = Hsv.v;
	}
	else{
		Hex = Color.HsvToHex(this.Act);
	}

	document.getElementById('CadACouleurHex').value = Hex;
	document.getElementById('CadACouleurNew').style.background = Hex;
	document.getElementById('CadACouleurBarre').style.backgroundColor = Color.HsvToHex({ h: this.Act.h, s: 100, v: this.Act.v });

	Ot.setOpacity(document.getElementById('CadACouleurMap'), this.Act.s / 100);
	Ot.setLeftTop(document.getElementById('CadACouleurPoint'), this.Act.h / 1.40, (255 - this.Act.v * 2.55) + 1);
	document.getElementById('CadACouleurCursor').style.top = (256 - this.Act.s * 2.55 + 7) + 'px';

	if(this.isTxtSelect == true)
	{
		GWys.setRange();
		GWys.Act.Doc.execCommand('forecolor', false, Hex);
		GWys.saveRange();
		GWys.removeRange();
	}
},

onkeyHex: function()
{
	var Hex = document.getElementById('CadACouleurHex').value.toUpperCase().replace(/[^A-F0-9-#]/g, '0');
	document.getElementById('CadACouleurHex').value = Hex;

	var RegExp = /^#[A-F0-9]{6}/;

	if(RegExp.test(Hex) == true)
	{
		this.set(Hex);
	}
},

startMap: function(event)
{
	Ot.addEvent(document, 'mousemove', CadACouleur.moveMap);
	Ot.addEvent(document, 'mouseup', CadACouleur.stopMap);

	CadACouleur.moveMap(event);
},

moveMap: function(event)
{
	Ot.cancelEvent(event);

	var ObjPosition = Ot.getObjPosition(document.getElementById('CadACouleurPalette'));
	var MousePosition = Ot.getMousePosition(event);

	var Left = MousePosition.x - ObjPosition.x - 10;
	Left = (Left < 0) ? 0 : Left;
	Left = (Left > 256) ? 256 : Left;

	var Top = MousePosition.y - ObjPosition.y - 10;
	Top = (Top < 0) ? 0 : Top;
	Top = (Top > 256) ? 256 : Top;

	CadACouleur.Act.h = Math.round(Left * 1.40);
	CadACouleur.Act.v = 100 - Math.round(Top / 2.55);
	CadACouleur.set();
},

stopMap: function()
{
	Ot.stopEvent(document, 'mousemove', CadACouleur.moveMap);
	Ot.stopEvent(document, 'mouseup', CadACouleur.stopMap);
},

startBarre: function(event)
{
	Ot.addEvent(document, 'mousemove', CadACouleur.moveBarre);
	Ot.addEvent(document, 'mouseup', CadACouleur.stopBarre);

	CadACouleur.moveBarre(event);
},

moveBarre: function(event)
{
	Ot.cancelEvent(event);

	var ObjPosition = Ot.getObjPosition(document.getElementById('CadACouleurPalette'));
	var MousePosition = Ot.getMousePosition(event);

	var Top = MousePosition.y - ObjPosition.y - 15;
	Top = (Top < 0) ? 0 : Top;
	Top = (Top > 256) ? 256 : Top;

	CadACouleur.Act.s = 100 - Math.round(Top / 2.55);
	CadACouleur.set();
},

stopBarre: function()
{
	Ot.stopEvent(document, 'mousemove', CadACouleur.moveBarre);
	Ot.stopEvent(document, 'mouseup', CadACouleur.stopBarre);
},

MouseWheel: function(e)
{
	e = e || window.event;

	var Delta = Ot.getDeltaWheel(e);

	var NewS = CadACouleur.Act.s + (Delta*10);

	if(NewS < 0){
		NewS = 0;
	}
	else if(NewS > 100){
		NewS = 100;
	}

	CadACouleur.Act.s = NewS;
	CadACouleur.set();
}

};

var CadCaractere = {

List: {
	'Caractères généraux': '"«»‹›“”„\'‘’‚…!¡?¿()[]{}¨´`^ˆ~˜¸#*.:;·•¯-–—_|¦†‡§¶©®™@/\\',
	'Alphabet accentué et spécial': 'ÁÂÀÅÃÄÆÇÉÊÈËÍÎÌÏÑÓÔÒØÕÖŒŠÚÛÙÜÝŸáâàåãäæçéêèëíîìïñóôòøõöœšßðÐþÞúûùüýÿ',
	'Alphabet Grec': 'αΑβϐΒγΓδΔεΕζΖηΗθΘϑϴιΙκϰΚλΛμΜνΝξΞοΟπϖΠρϱΡσςΣτΤυΥφϕΦχΧψΨωΩ',
	'Flèches': '←↑→↓↔↕↖↗╭╮╯╰➔➘➙➚➛➜➝➞⤀⤁⤂⤃⤄⤅⤆⤇⤈',
	'Symboles monétaires': '€$₤ψ₠₡₢₣₥₦₧₨₩₪₫₭₮₯₰₱',
	'Musique': '♩♪♫♬♭♮♯',
	'Religion et politique': '☥☦☧☨☩☪☫☬☭☮☯♰♱✝✞✟',
	'Astronomie': '☼☽☾☿♀♁♂♃♄♅♆♇♈♉♊♋♌♍♎♏♐♑♒♓',
	'Jeux': '♠♣♥♦♤♧♡♢♔♕♖♗♘♙♚♛♜♝♞♟',
	'Mathématique Chiffres romains': 'ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯↀↁↂↃⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅺⅻⅼⅽⅾⅿ',
	'Mathématique Ensembles de nombres': 'ℂℍℕℙℚℝℤ∅',
	'Mathématique Relations': '≡≤⩽≥⩾∈∋∝∴∼≅≈⊂⊃⊆⊇∥≠≢∉⊄∦',
	'Mathématique Opérateurs': '±×÷•∂∏∑−∗√∧∨∩∪∫∬∭∮∯∰∱∲∳⊕⊗⋅',
	'Mathématique Fractions': '¼½¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟'
},

open: function()
{
	var isNew = GCadre.add('CadCaractere', 'Ajouter des caractères spéciaux', '500px',
		'Cliquer sur la caractère à ajouter',
		'<div class="FormChamp">'+
			'<label class="FormLabel" for="CadCaractereSelect">Type de caractère : </label>'+
			'<select class="FormSelect" id="CadCaractereSelect"></select>'+
		'</div>'+
		'<div id="CadCaractereTable"></div>'+
		'<div id="CadCaractereRecent">'+
			'Caractères ajoutés récemment : '+
			'<table class="Collapse"><tbody><tr></tr></tbody></table>'+
		'</div>'+
		'<div class="FormChamp">'+
			'<label class="FormLabel" for="CadCaractereInput">Texte à ajouter :</label>'+
			'<input class="FormInputText" id="CadCaractereInput" type="text" size="50" onkeyup="CadCaractere.onKeyUp(event)"/></label>'+
		'</div>'+
		'<div id="CadCaractereApercu"></div>',
		''
	);

	var CadCaractereInput = document.getElementById('CadCaractereInput');
	var CadCaractereSelect = document.getElementById('CadCaractereSelect');

	if(isNew)
	{
		for(var Nom in this.List)
		{
			var option = document.createElement('option');
			option.value = Nom;
			option.innerHTML = Nom;

			CadCaractereSelect.appendChild(option);
		}

		CadCaractereSelect.onchange = function()
		{
			var Select = GFormF.getSelect(CadCaractereSelect);
			CadCaractere.setTable(Select);
		};

		this.setTable('Caractères généraux');
	}

	this.setFoot();
	GWys.setRange();

	GCadre.open('CadCaractere');

	CadCaractereInput.value = '';
	CadCaractereInput.focus();
},

onKeyUp: function(event)
{
	if(event.keyCode == Ot.Key.Enter && document.getElementById('CadCaractereInput').value != ''){
		this.apply();
	}
	else{
		this.setFoot();
	}
},

setTable: function(Nom)
{
	var CadCaractereTable = document.getElementById('CadCaractereTable');
	var LigneNbr = 0;
	var ListAct = this.List[Nom].split('');
	var ColNbr = 0;
	var Html = '<table class="Collapse">';

	for(var i = 0; i < ListAct.length; i++)
	{
		ColNbr++;

		if(ColNbr == 1){
			LigneNbr++;
			Html += '<tr>';
		}

		if(i == ListAct.length-1 && LigneNbr > 1){
			var More = ' colspan="'+(22-ColNbr+1)+'"';
		}
		else{
			var More = '';
		}

		Html += '<td'+More+'>'+ListAct[i]+'</td>';

		if(ColNbr == 22){
			ColNbr = 0;
			Html += '</tr>';
		}
	}

	Html += '</table>';

	CadCaractereTable.innerHTML = Html;

	this.setTableEvent(CadCaractereTable);
},

setTableEvent: function(Table)
{
	var CadCaractereInput = document.getElementById('CadCaractereInput');
	var CadCaractereApercu = document.getElementById('CadCaractereApercu');
	var CursorPosition;
	var Interval;

	var TdList = Table.getElementsByTagName('td');
	for(var i = 0; i < TdList.length; i++)
	{
		TdList[i].onmousedown = function()
		{
			window.clearInterval(Interval);
			CadCaractereApercu.style.display = 'none';

			CursorPosition = Ot.getCursorPosition(CadCaractereInput);
		};
		TdList[i].onclick = function()
		{
			var Html = this.innerHTML;

			Ot.setCursorPosition(CadCaractereInput, CursorPosition);
			Ot.addTextInInputPosition(CadCaractereInput, Html);
			CadCaractere.setFoot();

			if(Table.id == 'CadCaractereTable'){
				CadCaractere.setRecent(Html);
			}
		};
		TdList[i].onmouseover = function()
		{
			var Obj = this;

			Interval = window.setInterval(function()
			{
				window.clearInterval(Interval);

				CadCaractereApercu.innerHTML = Obj.innerHTML;
				CadCaractereApercu.style.display = 'block';
				var ObjPosition = Ot.getObjPosition(Obj, CadCaractereApercu.parentNode.parentNode.parentNode);

				var Left = ObjPosition.x;
				var LeftMax = CadCaractereApercu.parentNode.offsetWidth - 68;
				Left = (Left > LeftMax) ? LeftMax : Left;
				var Top = ObjPosition.y + Obj.offsetHeight;

				Ot.setLeftTop(CadCaractereApercu, Left, Top);
			}, 500);
		};
		TdList[i].onmouseout = function()
		{
			window.clearInterval(Interval);
			CadCaractereApercu.style.display = 'none';
		};
	}
},

setRecent: function(Html)
{
	var CadCaractereRecent = document.getElementById('CadCaractereRecent');
	var TdList = CadCaractereRecent.lastChild.firstChild.firstChild;
	var isIn = false;

	if(TdList.firstChild)
	{
		var List = TdList.childNodes;
		for(var i = 0; i < List.length; i++)
		{
			if(List[i].innerHTML == Html)
			{
				isIn = true;
				break;
			}
		}
	}

	if(!isIn) // Si le caractère  n'est pas encore ajouté
	{
		if(TdList.childNodes.length > 10)
		{
			TdList.lastChild.innerHTML = Html;
			TdList.insertBefore(TdList.lastChild, TdList.firstChild);
		}
		else
		{
			var td = document.createElement('td');
			td.innerHTML = Html;

			if(TdList.firstChild){
				TdList.insertBefore(td, TdList.firstChild);
			}
			else{
				TdList.appendChild(td);
			}
		}

		this.setTableEvent(TdList);
	}
},

setFoot: function()
{
	if(document.getElementById('CadCaractereInput').value != ''){
		var Html = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadCaractere\')">Annuler</button>'+
		'<button type="button" class="button-small button-small-green" onclick="CadCaractere.apply()"><i class="icon-ok"></i>Ajouter</button>';
	}
	else{
		var Html = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadCaractere\')">Fermer</button>';
	}

	document.getElementById('CadCaractereFoot').innerHTML = Html+'<div class="Clear"></div>';
},

apply: function()
{
	GCadre.close('CadCaractere');
	GWys.insertHtml(document.getElementById('CadCaractereInput').value);
	GWys.resize(GWys.Act);
	GWys.PreSuiv('Save');
}

};

var CadLienClick = {

Wys: '',
Lien: '',
isOpen: false,

open: function(Lien, event)
{
	var isCliqueGauche = true;

	if(event)
	{
		var Clique = event.which || event.button;
		if(Clique == 2 || Clique == 3) // Clique droit
		{
			isCliqueGauche = false;
		}
	}

	if(isCliqueGauche) //Clique gauche
	{
		var CadLienClickObj = document.getElementById('CadLienClick');
		var ObjPosition = Ot.getObjPosition(Lien);
		var IframePosition = Ot.getObjPosition(GWys.Act.Iframe);
		var CadLienClickLien = CadLienClickObj.getElementsByTagName('span')[0];
		var Href = Lien.href;
		CadLienClick.Wys = GWys.Act;
		CadLienClick.Lien = Lien;
		CadLienClick.isOpen = true;

		CadLienClickObj.style.display = 'block';
		Ot.setLeftTop(CadLienClickObj, ObjPosition.x + IframePosition.x, ObjPosition.y + IframePosition.y + Lien.offsetHeight);

		if(Href.substring(0, 7) == 'mailto:')
		{
			Href = Href.replace(/^mailto:/, '');
			CadLienClickLien.innerHTML = '<strong>'+Ot.getTextLenMax(Href, 40)+'</strong>';
		}
		else if(Href.substring(0, 12) == 'salonrama://')
		{
			Href = Href.replace(/^salonrama:\/\//, '');

			var index = GPage.getIndexListId(Href);

			if(index != -1){
				Href = GPage.List[index].name;
			}
			else{
				Href = 'Page supprimer';
			}

			CadLienClickLien.innerHTML = '<strong>'+Ot.getTextLenMax(Href, 40)+'</strong>';
		}
		else
		{
			CadLienClickLien.innerHTML = '<a href="'+Href+'" target="_blank">'+Ot.getTextLenMax(Href, 40)+'</a>';
		}

		Ot.addEvent(document, 'mousedown', CadLienClick.onMouseDown);

		Ot.addEvent(CadLienClick.Wys.Win.document, 'keydown', CadLienClick.close);
		for(var i in GWys.List)
		{
			if(GWys.List[i].Win){
				Ot.addEvent(GWys.List[i].Win.document, 'mousedown', CadLienClick.close);
			}
		}
	}
},

onMouseDown: function(event)
{
	var Target = Ot.getTarget(event);

	if(!Ot.isAChildOf(document.getElementById('CadLienClick'), Target))
	{
		CadLienClick.close();
	}
},

modif: function()
{
	this.close();
	CadLien.open(this.Lien);
},

remove: function()
{
	this.close();
	CadLien.removeLien(this.Lien);
	GWys.PreSuiv('Save');
},

close: function()
{
	Ot.stopEvent(document, 'mousedown', CadLienClick.onMouseDown);

	Ot.stopEvent(CadLienClick.Wys.Win.document, 'keydown', CadLienClick.close);
	for(var i in GWys.List)
	{
		if(GWys.List[i].Win){
			Ot.stopEvent(GWys.List[i].Win.document, 'mousedown', CadLienClick.close);
		}
	}

	var CadLienClickObj = document.getElementById('CadLienClick');

	CadLienClickObj.style.display = 'none';
	this.isOpen = false;
}

};

var CadLien = {

Modif: { is: false, Lien: '', Txt: '' },
Form: new GForm(''),

open: function(Lien)
{
	GCadre.add('CadLien', 'Lien', '500px',
		'',
		'<strong>Lien vers : </strong>'+
		'<div class="CadLienChamp">'+
			'<div class="Ratio">'+
				'<input type="radio" name="CadLienTypeList" id="CadLienTypeUrl" value="Url" checked="checked" onclick="CadLien.setType(\'Url\')"/><label for="CadLienTypeUrl">adresse internet</label>'+
				'<input type="radio" name="CadLienTypeList" id="CadLienTypeSite" value="Site" onclick="CadLien.setType(\'Site\')"/><label for="CadLienTypeSite">page du site</label>'+
				'<input type="radio" name="CadLienTypeList" id="CadLienTypeEmail" value="Email" onclick="CadLien.setType(\'Email\')"/><label for="CadLienTypeEmail">adresse email</label>'+
			'</div>'+
			'<div id="CadLienType">'+
				'<div class="FormChamp" id="CadLienUrl">'+
					'<label class="FormLabel" for="CadLienUrlInput">Adresse internet : </label>'+
					'<input class="FormInputText" id="CadLienUrlInput" type="text" size="40"/>'+
				'</div>'+
				'<div class="FormChamp" id="CadLienSite">'+
					'<label class="FormLabel" for="CadLienSiteInput">Page du site : </label>'+
					'<select class="FormSelect" id="CadLienSiteInput"></select>'+
				'</div>'+
				'<div class="FormChamp" id="CadLienEmail">'+
					'<label class="FormLabel" for="CadLienEmailInput">Adresse email : </label>'+
					'<input class="FormInputText" id="CadLienEmailInput" type="text" size="40"/>'+
				'</div>'+
				'<div class="TextLittle" style="margin-left:122px;"></div>'+
			'</div>'+
		'</div>'+
		'<strong>Affichage : </strong>'+
		'<div class="CadLienChamp">'+
			'<div class="FormChamp">'+
				'<label class="FormLabel" for="CadLienTxt" style="width:60px;">Texte : </label>'+
				'<input class="FormInputText" id="CadLienTxt" type="text" size="50" onkeyup="CadLien.setExempleLien(this)"/>'+
			'</div>'+
			'<div class="TextLittle" style="margin-left:62px;">exemple : <a href="#" onclick="return false">Texte qui sera ici</a></div>'+

			'<div class="FormChamp" id="CadLienOpen">'+
				'<input type="checkbox" name="option" id="CadLienOpenInput"/><label for="CadLienOpenInput"> Ouvrir le lien dans une nouvelle fenêtre</label>'+
			'</div>'+
		'</div>'+
		'<div id="CadLienFormEtat"></div>',
		''
	);

	GWys.setRange();

	var CadLienUrlInput = document.getElementById('CadLienUrlInput');
	var CadLienSiteInput = document.getElementById('CadLienSiteInput');
	var CadLienEmailInput = document.getElementById('CadLienEmailInput');
	var CadLienTxt = document.getElementById('CadLienTxt');
	var CadLienOpenInput = document.getElementById('CadLienOpenInput');

	this.Modif = { is: false, Lien: '', Txt: '' };
	CadLienTxt.value = '';
	CadLienUrlInput.value = '';
	CadLienEmailInput.value = '';
	CadLienOpenInput.checked = false;

	if(!Lien)
	{
		var Select = GWys.getSelect();
		var SelectParent = Select.parent;

		while(SelectParent && SelectParent.nodeName.toLowerCase() != 'a'){
			SelectParent = SelectParent.parentNode;
		}

		Lien = SelectParent;
	}

	if(Lien && Lien.nodeName.toLowerCase() == 'a')
	{
		if(Lien.href.substring(0, 7) == 'mailto:')
		{
			this.setType('Email');
			CadLienEmailInput.value = Lien.href.replace(/^mailto:/, '');
		}
		else if(Lien.href.substring(0, 12) == 'salonrama://')
		{
			this.setType('Site');
			var Page = Lien.href.replace(/^salonrama:\/\//, '');
		}
		else
		{
			this.setType('Url');
			CadLienUrlInput.value = Lien.href;
			if(Lien.target == '_blank'){ CadLienOpenInput.checked = true; }
		}

		var Txt = Ot.removeTagHtml(Lien.innerHTML);

		CadLienTxt.value = Txt;

		this.Modif.is = true;
		this.Modif.Lien = Lien;
		this.Modif.Txt = Txt;
	}
	else if(Select.text != '')
	{
		this.setType('Url');
		CadLienTxt.value = Select.text;
	}
	else{
		this.setType('Url');
	}

	this.setExempleLien(CadLienTxt);

	CadLienSiteInput.innerHTML = '<option value="empty" disabled="disabled" selected="selected">Sélectionner une page :</option>';

	for(var i = 0; i < GPage.List.length; i++)
	{
		var option = document.createElement('option');
		option.value = GPage.List[i].id;
		option.innerHTML = GPage.List[i].name;

		if(i == Page){
			option.selected = true;
		}

		CadLienSiteInput.appendChild(option);
	}

	this.setTitre();
	this.setFoot();

	GCadre.open('CadLien');

	Ot.setCursorPosition(CadLienTxt, 'End');
},

setTitre: function()
{
	if(this.Modif.is){
		var Html = '<strong>Modifier</strong> le lien.';
	}
	else{
		var Html = '<strong>Ajouter</strong> un lien sur votre page.';
	}

	document.getElementById('CadLienTitre').innerHTML = Html;
},

setType: function(Type)
{
	var CadLienTypeExemple = document.getElementById('CadLienType').lastChild;
	var CadLienUrl = document.getElementById('CadLienUrl');
	var CadLienSite = document.getElementById('CadLienSite');
	var CadLienEmail = document.getElementById('CadLienEmail');
	var CadLienOpen = document.getElementById('CadLienOpen');

	CadLienUrl.style.display = 'none';
	CadLienSite.style.display = 'none';
	CadLienEmail.style.display = 'none';
	CadLienOpen.style.visibility = 'hidden';
	this.Form.setFormEtat(document.getElementById('CadLienFormEtat'), '', '');

	if(Type == 'Url')
	{
		document.getElementById('CadLienTypeUrl').checked = true;

		CadLienUrl.style.display = 'block';
		CadLienOpen.style.visibility = 'visible';
		CadLienTypeExemple.innerHTML = 'exemple : http://www.google.com';
	}
	else if(Type == 'Site')
	{
		document.getElementById('CadLienTypeSite').checked = true;

		CadLienSite.style.display = 'block';
		CadLienTypeExemple.innerHTML = 'exemple : '+GPage.List[GPage.getIndexListId(GPage.Act)].name;
	}
	else if(Type == 'Email')
	{
		document.getElementById('CadLienTypeEmail').checked = true;

		CadLienEmail.style.display = 'block';
		CadLienTypeExemple.innerHTML = 'exemple : jerome@salorama.fr';
	}
},

setFoot: function()
{
	if(this.Modif.is){
		var Html = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadLien\')">Annuler</button>'+
		'<button type="button" class="button-small button-small-green" onclick="CadLien.apply()"><i class="icon-ok"></i>Modifier</button>';
	}
	else{
		var Html = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadLien\')">Fermer</button>'+
		'<button type="button" class="button-small button-small-green" onclick="CadLien.apply()"><i class="icon-ok"></i>Ajouter</button>';
	}

	document.getElementById('CadLienFoot').innerHTML = Html+'<div class="Clear"></div>';
},

setExempleLien: function(CadLienTxt)
{
	if(CadLienTxt.value != ''){
		var Exemple = CadLienTxt.value;
	}
	else{
		var Exemple = 'Texte qui sera ici';
	}

	CadLienTxt.parentNode.nextSibling.lastChild.innerHTML = Exemple;
},

apply: function()
{
	var CadLienOpenInput = document.getElementById('CadLienOpenInput');
	var Type = GFormF.getRadio(document.getElementById('CadLienType').previousSibling);
	var Txt = GFormF.Trim(document.getElementById('CadLienTxt').value);
	var CadLienFormEtat = document.getElementById('CadLienFormEtat');

	if(Txt != '')
	{
		if(Type == 'Url')
		{
			var Value = GFormF.Trim(document.getElementById('CadLienUrlInput').value);

			if(Value != '')
			{
				if(CadLienOpenInput.checked){
					this.setLien(Value, Txt, true);
				}
				else{
					this.setLien(Value, Txt);
				}

				GWys.PreSuiv('Save');
				GCadre.close('CadLien');
			}
			else
			{
				this.Form.setFormEtat(CadLienFormEtat, false, 'Incomplet.');
				Ot.setOpacity(CadLienFormEtat, 1);
			}
		}
		else if(Type == 'Site')
		{
			var Value = GFormF.getSelect(document.getElementById('CadLienSiteInput'));

			if(Value != 'empty')
			{
				this.setLien('salonrama://'+Value, Txt);

				GWys.PreSuiv('Save');
				GCadre.close('CadLien');
			}
			else
			{
				this.Form.setFormEtat(CadLienFormEtat, false, 'Incomplet.');
				Ot.setOpacity(CadLienFormEtat, 1);
			}
		}
		else if(Type == 'Email')
		{
			var Value = GFormF.Trim(document.getElementById('CadLienEmailInput').value);

			if(Value != '')
			{
				this.setLien('mailto:'+Value, Txt);

				GWys.PreSuiv('Save');
				GCadre.close('CadLien');
			}
			else
			{
				this.Form.setFormEtat(CadLienFormEtat, false, 'Incomplet.');
				Ot.setOpacity(CadLienFormEtat, 1);
			}
		}
	}
	else
	{
		this.Form.setFormEtat(CadLienFormEtat, false, 'Incomplet.');
		Ot.setOpacity(CadLienFormEtat, 1);
	}
},

setLien: function(Href, Txt, Target)
{
	if(this.Modif.is)
	{
		if(Txt != this.Modif.Txt)
		{
			this.Modif.Lien.innerHTML = Txt;
		}

		this.Modif.Lien.href = Href;

		if(Target){
			this.Modif.Lien.target = '_blank';
		}
		else{
			this.Modif.Lien.target = '';
		}
	}
	else
	{
		if(Target){
			var More = ' target="_blank"';
		}
		else{
			var More = '';
		}

		GWys.insertHtml('<a href="'+Href+'"'+More+'>'+Txt+'</a>');
		GWys.Act.Doc.execCommand('unlink', false, null);
		GWys.setLienRule(GWys.Act);
	}
},

removeLien: function(Lien)
{
	Lien.id = Ot.getRandId('Lien');

	var LienHtmlIn = Lien.innerHTML;

	var div = document.createElement('div');
	var LienClone = Lien.cloneNode(true);
	div.appendChild(LienClone);

	var LienHtmlOut = div.innerHTML;

	var Body = GWys.Act.Win.document.body;
	Body.innerHTML = Body.innerHTML.replace(LienHtmlOut, LienHtmlIn);
}

};

var CadHtml = {

open: function(ModuleObj)
{
	GCadre.add('CadHtml', 'Code HTML', '720px',
		'',
		'HTML : <br/><textarea id="CadHtmlTexta" class="FormTexta" rows="15" cols="10"></textarea>',
		''
	);

	if(ModuleObj) //Modifier
	{
		var Html = document.getElementById(ModuleObj).innerHTML;

		if(CClient[0] == 'IExploreur'){
			Html = Html.replace(/<br>/g, '<br>\n');
		}
	}
	else{
		var Html = '';
	}

	var CadHtmlTexta = document.getElementById('CadHtmlTexta');
	CadHtmlTexta.value = Html;

	this.setTitre(ModuleObj);
	this.setFoot(ModuleObj);

	GCadre.open('CadHtml');

	Ot.setCursorPosition(CadHtmlTexta, 'End');
},

apply: function(ModuleObjId)
{
	var Html = document.getElementById('CadHtmlTexta').value;
	Html = GWys.cleanInject(Html);
	Html = Html.replace(/<object /gi, '<object wmode="transparent" '); // Video
	Html = Html.replace(/<embed /gi, '<embed wmode="transparent" '); // Video

	if(ModuleObjId) //Modifier
	{
		var ModuleObj = document.getElementById(ModuleObjId);

		ModuleObj.innerHTML = Html;
		GBlock.resizeBlockCon(ModuleObj.parentNode);
	}
	else
	{
		addBlockHtml({ T: 'Html', V: Html, P: [] }, 'addByUser');
	}

	GCadre.close('CadHtml');
},

setTitre: function(ModuleObjId)
{
	if(ModuleObjId){
		var Html = '<strong>Modifier</strong> le code HTML de l\'élement.';
	}
	else{
		var Html = '<strong>Ajouter</strong> un élement de code HTML sur votre page.';
	}

	document.getElementById('CadHtmlTitre').innerHTML = Html;
},

setFoot: function(ModuleObjId)
{
	if(ModuleObjId){
		var Html = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadHtml\')">Annuler</button>'+
		'<button type="button" class="button-small button-small-green" onclick="CadHtml.apply(\''+ModuleObjId+'\')" id="CadPageBoutModif"><i class="icon-ok"></i>Modifier';
	}
	else{
		var Html = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadHtml\')">Fermer</button>'+
		'<button type="button" class="button-small button-small-green" id="HtmlAdd" onclick="CadHtml.apply()"><i class="icon-plus"></i>Ajouter</button>';
	}

	document.getElementById('CadHtmlFoot').innerHTML = Html+'<div class="Clear"></div>';
},

getSave: function(ModuleObj)
{
	return GWys.cleanInject(ModuleObj.innerHTML);
}

};

var CadPage = {

SaveList: '',
ModifAct: '',
ModifList: [],

open: function()
{
	this.ModifAct = GPage.Act;
	this.ModifList = Ot.CloneObjet(GPage.List);
	this.SaveList = JSON.encode(GPage.List);

	GCadre.add('CadPage', 'Gestion des pages', '720px',
		'Vous pouvez ici <strong>organiser</strong> vos pages.<br/>'+
		'Le nom de vos pages apparaîssent dans le menu, dans le titre de la fenêtre du navigateur et dans les résultats des moteurs de recherche.<br/>'+
		'Cliquer sur "<strong>Appliquer les modifications</strong>" une fois terminé.',
		'<div id="CadPageLeft">'+
			'<span>Liste de vos pages :<span class="TextLittle"></span></span>'+
			'<div id="CadPageList" class="DragList"></div>'+
		'</div>'+
		'<div id="CadPageRight">'+
			'Page actuelle :'+
			'<div class="CadColor CadBlue2">'+
				'Nom de la page : <input type="text" id="PageTitle" class="FormInputText" size="30" onkeyup="CadPage.onKeyTitre()"/><br/>'+
				'<br/><br/>'+
				'<button type="button" class="button-small button-small-red" onclick="CadPage.remove()">Supprimer cette page</button>'+
			'</div>'+
			'<button type="button" class="button-small button-small-green" onclick="CadPage.add()"><i class="icon-plus"></i>Ajouter une page</button>'+
		'</div>'+
		'<div class="Clear"></div>',
		''
	);

	GCadre.open('CadPage');

	this.setDragList();
},

setDragList: function(isOnly)
{
	var CadPageList = document.getElementById('CadPageList');
	var DragSelect;
	var isFirst = true;

	if(this.ModifList.length > 1){
		var Info = ' ('+this.ModifList.length+' pages)';
	}
	else{
		var Info = ' ('+this.ModifList.length+' page)';
	}
	CadPageList.previousSibling.lastChild.innerHTML = Info;


	CadPageList.innerHTML = '';

	for(var i = 0; i < this.ModifList.length; i++)
	{
		var Drag = document.createElement('div');
		Drag.className = 'Drag';

		if(this.ModifList[i].id == this.ModifAct){
			Drag.className += ' select';
			DragSelect = Drag;
		}

		if(isFirst == true)	{
			Drag.className += ' home';
			isFirst = false;
		}

		Drag.innerHTML = '<div class="BoutDrag" title="Déplacer la page" onmousedown="GDrag.start(this.parentNode, event, function(){ CadPage.GDrag(); })"></div>'+
						 '<span title="'+this.ModifList[i].id+'">'+this.ModifList[i].name+'</span>';

		(function(z){
			Drag.onclick = function(e)
			{
				e = e || window.event;
				CadPage.select(e, z);
			};
		})(this.ModifList[i].id);

		CadPageList.appendChild(Drag);
	}

	if(!isOnly){
		document.getElementById('PageTitle').value = this.ModifList[this.getIndexListId(this.ModifAct)].name;
	}

	Ot.setScrollOpt(CadPageList, DragSelect);

	this.setFoot();
},

GDrag: function()
{
	var CadPageList = document.getElementById('CadPageList').childNodes;

	this.ModifList = [];

	for(var i = 0; i < CadPageList.length; i++)
	{
		var span = CadPageList[i].lastChild;

		Ot.removeClass(CadPageList[i], 'home');

		if(i == 0){
			CadPageList[i].className += ' home';
		}

		this.ModifList[i] = { 'id': span.title, 'name': span.innerHTML };
	}

	this.setFoot();
},

add: function()
{
	var newId;
	var i = 0;

	do
	{
		i += 1;

		newId = Ot.getRandNbr(4);

		if(i > 50){ // id saturé
			newId = Ot.getTime();
			break;
		}
	}
	while(this.getIndexListId(newId) != -1);

	this.ModifList[this.ModifList.length] = { 'id': newId.toString(), 'name': 'Titre' };
	this.ModifAct = newId;

	this.setDragList();
},

select: function(event, i)
{
	var Target = Ot.getTarget(event);

	if(Target.className != 'BoutDrag')
	{
		this.ModifAct = i;

		this.setDragList();
	}
},

setFoot: function()
{
	if(JSON.encode(this.ModifList) == this.SaveList){
		var Html = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadPage\')">Fermer</button>';
	}
	else{
		var Html = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadPage\')">Annuler</button>'+
		'<button type="button" class="button-small button-small-green" onclick="CadPage.apply()" id="CadPageBoutModif"><i class="icon-ok"></i>Appliquer les modifications</button>';
	}

	document.getElementById('CadPageFoot').innerHTML = Html+'<div class="Clear"></div>';
},

onKeyTitre: function()
{
	var Titre = document.getElementById('PageTitle').value;
	Titre = (Titre == '') ? 'Titre': Titre;

	this.ModifList[this.getIndexListId(this.ModifAct)].name = Titre;

	this.setDragList(true);
},

remove: function()
{
	if(this.ModifList.length > 1)
	{
		var indexAct = this.getIndexListId(this.ModifAct);

		for(var i = indexAct; i < this.ModifList.length - 1; i++)
		{
			this.ModifList[i] = this.ModifList[i+1];
		}

		this.ModifList.pop();

		if(indexAct < this.ModifList.length)
		{
			this.ModifAct = this.ModifList[indexAct].id;
		}
		else
		{
			this.ModifAct = this.ModifList[this.ModifList.length-1].id;
		}

		this.setDragList();
	}
},

apply: function()
{
	GPage.List = this.ModifList;

	var GPageAct = false;
	var GBlockList = {};

	for(var i = 0; i < GPage.List.length; i++)
	{
		if(i == 0 && GPage.List[0].id != 'index')
		{
			var newId = 'index';
		}
		else if(i != 0 && GPage.List[i].id == 'index')
		{
			var i = 0;
			var newId;

			do
			{
				i += 1;

				newId = Ot.getRandNbr(4).toString();

				if(i > 50){ // id saturé
					newId = Ot.getTime().toString();
					break;
				}
			}
			while(this.getIndexListId(newId) != -1);
		}
		else
		{
			var newId = GPage.List[i].id;
		}

		if(GPage.List[i].id == GPage.Act)
		{
			GPageAct = newId;
		}

		if(!GBlock.List[newId]){
			GBlockList[newId] = {};
		}
		else{
			GBlockList[newId] = GBlock.List[GPage.List[i].id];
		}

		GPage.List[i].id = newId;
	}

	GBlock.List = GBlockList;
	GPage.saveVar(['pageList', 'blockList'], [JSON.encode(GPage.List), JSON.encode(GBlock.List)]);

	GCadre.close('CadPage');

	if(GPageAct == false)
	{
		GPage.set('index');
	}
	else
	{
		GPage.Act = GPageAct;
		GPage.setMenu();
	}
},

getIndexListId: function(id)
{
	var index = -1;

	for(var i = 0; i < this.ModifList.length; i++)
	{
		if(this.ModifList[i].id == id)
		{
			index = i;
			break;
		}
	}

	return index;
}

};

var CadTheme = {

ModifAct: '',
CadSelect: '',

open: function()
{
	var CadSelect = document.createElement('div');
	CadSelect.className = 'CadSelect';
	CadSelect.innerHTML = '<div></div><div class="CadSelect2"></div>';
	Ot.setOpacity(CadSelect.firstChild, 0.3);
	Ot.setOpacity(CadSelect.lastChild, 1);
	this.CadSelect = CadSelect;

	this.ModifAct = GTheme.Act;

	GCadre.add('CadTheme', 'Changer de théme', '700px',
		'Pour <strong>changer</strong> de théme selectionner celui qui vous convient. <span class="TextLittle">('+GTheme.List.length+' thèmes)</span>',
		'<div id="CadThemeList"><div></div></div>',
		''
	);

	Ot.setOpacity(document.getElementById('CadThemeList'), 1);

	this.setFoot();

	var CadThemeList = document.getElementById('CadThemeList');
	CadThemeList.firstChild.innerHTML = '';

	for(var i = 0; i < GTheme.List.length; i++)
	{
		var CadImageObj = document.createElement('div');
		CadImageObj.className = 'CadImage';
		CadImageObj.title = 'Selectionner ce theme';
		CadImageObj.innerHTML = '<img src="/bundles/salonramamain/theme/'+GTheme.List[i]+'/screenshot_min.jpg" alt="'+GTheme.List[i]+'" title="Selectionner" width="130"/>';

		(function(z, CadImageObj){
			CadImageObj.onclick = function(){
				CadImageObj.appendChild(CadTheme.CadSelect);
				CadTheme.ModifAct = GTheme.List[z];
				CadTheme.setFoot();
			};
		})(i, CadImageObj);

		CadThemeList.firstChild.appendChild(CadImageObj);

		if(GTheme.List[i] == this.ModifAct)
		{
			CadImageObj.appendChild(this.CadSelect);
		}
	}

	var div = document.createElement('div');
	div.className = 'Clear';
	CadThemeList.firstChild.appendChild(div);

	GCadre.open('CadTheme');

	Ot.setScrollOpt(CadThemeList, CadSelect.parentNode);
},

setFoot: function()
{
	if(this.ModifAct == GTheme.Act){
		var Html = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadTheme\')">Fermer</button>';
	}
	else{
		var Html = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadTheme\')">Annuler</button>'+
		'<button type="button" class="button-small button-small-green" onclick="CadTheme.apply()" id="CadPageBoutModif"><i class="icon-ok"></i>Selectionner ce thème</button>';
	}

	document.getElementById('CadThemeFoot').innerHTML = Html+'<div class="Clear"></div>';
},

apply: function()
{
	GTheme.change(this.ModifAct, function()
	{
		GCadre.close('CadTheme');
	});
}

};

var CadImage = {

PreVis: {},
Modif: { is: false, ModuleObj: '', Nom: '', Act: '' },
CadSelect: '',
Form: '',

open: function(ModuleObjId)
{
	var CadSelect = document.createElement('div');
	CadSelect.className = 'CadSelect';
	CadSelect.innerHTML = '<div></div><div class="CadSelect2"></div>';
	CadSelect.title = 'Déselectionner';
	Ot.setOpacity(CadSelect.firstChild, 0.3);
	Ot.setOpacity(CadSelect.lastChild, 1);
	this.CadSelect = CadSelect;

	if(ModuleObjId)
	{
		this.Modif.is = true;
		this.Modif.ModuleObj = document.getElementById(ModuleObjId);
		this.Modif.Nom = GImage.getNom(this.Modif.ModuleObj.firstChild.src);
		this.Modif.Act = this.Modif.Nom;
	}
	else{
		this.Modif = { is: false, ModuleObj: '', Nom: '', Act: '' };
	}

	GCadre.add('CadImage', 'Images', '750px', '', '', '');
	GCadre.open('CadImage');

	this.setPage('Index');
},

setPage: function(Page)
{
	document.getElementById('CadImageCon').innerHTML = '';
	this.setTitre(Page);
	this.setFoot(Page);

	if(Page == 'Index')
	{
		document.getElementById('CadImageCon').innerHTML = ''+
		'<div id="CadImageLeft">'+
			'<span class="button-big button-big-green" onclick="CadImage.setPage(\'Pc\');">'+
			'<img src="/bundles/salonramamain/buildsite/image/picture.png" width="48" height="48"/>'+
			'Ajouter une photo depuis mon ordinateur ou depuis mon appareil photo</span>'+
			'<span class="button-big button-big-yellow" onclick="CadImage.setPage(\'Bdd\');">'+
			'<img src="/bundles/salonramamain/buildsite/image/folder.png" width="48" height="48"/>'+
			'Ajouter une photo depuis notre galerie</span>'+
			'<span class="button-big button-big-blue" onclick="CadImage.setPage(\'Url\');">'+
			'<img src="/bundles/salonramamain/buildsite/image/earth.png" width="48" height="48"/>'+
			'Ajouter une photo depuis son adresse internet</span>'+
		'</div>'+
		'<div id="CadImageRight">'+
			'<span>Vos images :<span class="TextLittle"></span></span>'+
			'<div id="CadImageList"><div></div></div>'+
		'</div>'+
		'<div class="Clear"></div>';

		Ot.setOpacity(document.getElementById('CadImageList'), 1);

		this.setImageList();
	}
	else if(Page == 'Pc')
	{
		document.getElementById('CadImageCon').innerHTML = '<div id="CadImageUpload"></div>';

		Upload.initi(document.getElementById('CadImageUpload'),
		{
			SWFUrl: '/bundles/salonramamain/buildsite/upload.swf',
			uploadUrl: pathBuildsite+'image',
			DataPost: 'session_id='+sessionId,
			MaxFile: 1,
			ExtensionImage: ['jpg', 'jpeg', 'jpe', 'gif', 'png'],
			BoutUploadStart: document.getElementById('CadImageUploadStart'),
			onUploadSuccess: function(Return)
			{
				GImage.add(Return[0], Return[1], Return[2]);
				CadImage.apply(Return[0]);
			},
			onUploadFinish: function()
			{
			}
		});
	}
	else if(Page == 'Bdd')
	{
		var div = document.createElement('div');
		div.id = 'CadImageBddList';

		if(this.Modif.is == true){
			var M = 'Remplacer';
			var M2 = '<img src="image/icone/ok.png"/>Remplacer';
		}
		else{
			var M = 'Ajouter';
			var M2 = '<img src="image/icone/add.png"/>Ajouter';
		}

		var Html = '';
		for(var i in GImage.BddList)
		{
			var ImageInfo = GImage.getInfo(i);
			var ImageSizeOpt = GImage.getSizeOpt(ImageInfo.w, ImageInfo.h, 90, 90);

			Html += '<div class="CadImage">'+
						'<a href="'+ImageInfo.src+'" class="MPreVis" title="Agrandir cette image">'+
							'<img src="'+ImageInfo.src+'" width="'+ImageSizeOpt.w+'" height="'+ImageSizeOpt.h+'"/>'+
							'<span class="Zoom"></span>'+
						'</a>'+
						'<a href="#" onclick="CadImage.addBdd(\''+i+'\'); return false">'+M+'</a>'+
					'</div>';
		}
		div.innerHTML = '<div>'+Html+'<div class="Clear"></div></div>';

		document.getElementById('CadImageCon').appendChild(div);
		document.getElementById('CadImagePreVis').innerHTML = M2;

		this.PreVis.Initi(document.getElementById('CadImageBddList'), 'White');
	}
	else if(Page == 'Url')
	{
		document.getElementById('CadImageCon').innerHTML = '<div id="CadImageUrlCon">'+
																'Adresse de l\'image (.jpg .jpeg .jpe .gif .png), 10Mo max :<br/>'+
																'<input size="60" class="FormInputText"/>'+
																'<div class="TextLittle">exemple : http://www.salonrama.fr/image/logo.png</div>'+
															'</div>';

		var Input = document.getElementById('CadImageCon').getElementsByTagName('input')[0];

		this.Form = new GForm('', this.addUrl);
		this.Form.addChamp('Input', Input, { RegExp: 'UrlImg' });

		Input.focus();
		Input.select();
	}
},

setImageList: function()
{
	var self = this;
	var CadImageList = document.getElementById('CadImageList');
	var CadImageSelect;
	var Nbr = Ot.getArrayLength(GImage.List);

	if(Nbr > 1){
		var Info = ' ('+Nbr+' images)';
	}
	else{
		var Info = ' ('+Nbr+' image)';
	}
	CadImageList.previousSibling.lastChild.innerHTML =  Info;


	if(Nbr == 0)
	{
		CadImageList.firstChild.innerHTML = '<div style="text-align:left;margin:15px;"><strong>Il n\'y a pas d\'image.</strong><br>Utilisez les boutons à gauche pour ajouter une image.</div>';
	}
	else
	{
		CadImageList.firstChild.innerHTML = '';

		for(var i in GImage.List)
		{
			var ImageInfo = GImage.getInfo(i);
			var ImageSizeOpt = GImage.getSizeOpt(ImageInfo.w, ImageInfo.h, 70, 70);

			var CadImageObj = document.createElement('div');
			CadImageObj.className = 'CadImage';
			CadImageObj.title = 'Selectionner';
			CadImageObj.innerHTML = '<img src="'+ImageInfo.src+'" width="'+ImageSizeOpt.w+'" height="'+ImageSizeOpt.h+'"/>'+
			'<div class="BoutEdit" title="Modifier cette image"></div>'+
			'<div class="CadClose" onclick="CadImage.remove(this.parentNode)" title="Supprimer cette image"></div>';

			(function(z, CadImageObj, Src){
				CadImageObj.firstChild.nextSibling.onclick = function()
				{
					GCadre.List['CadImage'].dontClose = true;
					CadImage.Picnik.open(Src, function()
					{
						GCadre.List['CadImage'].dontClose = false;
						self.setImageList();
					});
				};

				CadImageObj.onclick = function(e)
				{
					e = e || window.event;
					var Target = Ot.getTarget(e);

					if(Ot.isAChildOf(CadImage.CadSelect, Target))
					{
						CadImage.CadSelect.parentNode.removeChild(CadImage.CadSelect);

						CadImage.Modif.Act = '';
					}
					else if(!Target.className || ( Target.className != 'BoutEdit' && Target.className != 'CadClose'))
					{
						CadImageObj.appendChild(CadImage.CadSelect);

						CadImage.Modif.Act = z;
					}

					CadImage.setFoot('Index');
				};
			})(i, CadImageObj, ImageInfo.src);

			if(i == this.Modif.Act){
				CadImageObj.appendChild(this.CadSelect);
				CadImageSelect = CadImageObj;
			}

			CadImageList.firstChild.appendChild(CadImageObj);
		}

		var div = document.createElement('div');
		div.className = 'Clear';
		CadImageList.firstChild.appendChild(div);

		if(CadImageSelect){
			Ot.setScrollOpt(CadImageList, CadImageSelect);
		}
	}
},

setTitre: function(Page)
{
	var Titre = '';

	if(Page == 'Index')
	{
		if(this.Modif.is == true){
			Titre = 'Pour <strong>changer</strong> la image, cliquez sur l’un des boutons.';
		}
		else{
			Titre = 'Pour <strong>ajouter</strong> une image sur votre page, cliquez sur l’un des boutons.';
		}
	}
	else if(Page == 'Pc'){
		Titre = 'Ajouter une image depuis mon <strong>ordinateur</strong>.';
	}
	else if(Page == 'Bdd'){
		Titre = 'Ajouter une image depuis notre <strong>galerie</strong> d\'image.';
	}
	else if(Page == 'Url'){
		Titre = 'Ajouter une image depuis une <strong>adresse internet</strong>.';
	}

	document.getElementById('CadImageTitre').innerHTML = Titre;
},

setFoot: function(Page)
{
	var Foot = '';

	if(Page == 'Index')
	{
		if(this.Modif.is == true)
		{
			Foot = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadImage\')">Annuler</button>';

			if(this.Modif.Act != '' && this.Modif.Act != this.Modif.Nom){
				Foot += '<button type="button" class="button-small button-small-green" onclick="CadImage.apply(CadImage.Modif.Act)"><i class="icon-pencil"></i>Remplacer par cette image</button>';
			}
		}
		else
		{
			Foot = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadImage\')">Fermer</button>';

			if(this.Modif.Act != ''){
				Foot += '<button type="button" class="button-small button-small-green" onclick="CadImage.apply(CadImage.Modif.Act)"><i class="icon-plus"></i>Ajouter cette image</button>';
			}
		}
	}
	else if(Page == 'Pc'){
		Foot = '<button type="button" class="button-small button-small-blue" onclick="CadImage.setPage(\'Index\')" style="float:left;"><i class="icon-angle-left"></i>Retour</button>';

		if(this.Modif.is == true)
		{
		   Foot += '<button type="button" class="button-small button-small-green" id="CadImageUploadStart" style="display:none;"><i class="icon-pencil"></i>Remplacer par cette image</button>';
		}
		else
		{
		   Foot += '<button type="button" class="button-small button-small-green" id="CadImageUploadStart" style="display:none;"><i class="icon-plus"></i>Ajouter cette image</button>';
		}
	}
	else if(Page == 'Bdd'){
		Foot = '<button type="button" class="button-small button-small-blue" onclick="CadImage.setPage(\'Index\')" style="float:left;"><i class="icon-angle-left"></i>Retour</button>';
	}
	else if(Page == 'Url'){
		Foot = '<button type="button" class="button-small button-small-blue" onclick="CadImage.setPage(\'Index\')" style="float:left;"><i class="icon-angle-left"></i>Retour</button>';

		if(this.Modif.is == true)
		{
		   Foot += '<button type="button" class="button-small button-small-green" onclick="CadImage.Form.Valide()"><i class="icon-pencil"></i>Remplacer par cette image</button>';
		}
		else
		{
		   Foot += '<button type="button" class="button-small button-small-green" onclick="CadImage.Form.Valide()"><i class="icon-plus"></i>Ajouter cette image</button>';
		}
	}

	document.getElementById('CadImageFoot').innerHTML = Foot+'<div class="Clear"></div>';
},

apply: function(Nom)
{
	CadImage.addBlock(Nom);
	GCadre.close('CadImage');
},

addBdd: function(Nom)
{
	bsCadreLoad.show();

	if(Nom == 'PreVis'){
		Nom = GImage.getNom(this.PreVis.Ele.ImgA.src);
		this.PreVis.closeStart();
	}

	$.ajax({
		type: 'POST',
		url: pathBuildsite+'image',
		data: { addBdd: Nom },
		dataType: 'json',
		success: function(response){
			GImage.add(response.text, GImage.BddList[Nom][0], GImage.BddList[Nom][1]);
			CadImage.apply(response.text);
		},
		error: function(rs, e) {
			alert('Erreur : ' + e);
		},
		complete: function(jqXHR, textStatus) {
			bsCadreLoad.hide();
		}
	});
},

addUrl: function(R)
{
	if(R == 0)
	{
		bsCadreLoad.show();

		var Input = document.getElementById('CadImageCon').getElementsByTagName('input')[0]; //URL

		$.ajax({
			type: 'POST',
			url: pathBuildsite+'image',
			data: { addUrl: Input.value },
			dataType: 'json',
			success: function(response){
				if(response.state == 0)
				{
					GImage.add(response.text[0], response.text[1], response.text[2]);
					CadImage.apply(response.text[0]);
				}
				else
				{
					this.error('', response.text);
				}
			},
			error: function(rs, e) {
				GFormF.setChampErr(Input, Input.nextSibling, false, e);
			},
			complete: function(jqXHR, textStatus) {
				bsCadreLoad.hide();
			}
		});
	}
},

remove: function(CadImageObj)
{
	if(confirm('Voulez-vouz vraiment supprimer cette image ?\nElle sera aussi supprimer des éléments qui l\'utilisent.'))
	{
		var Nom = GImage.getNom(CadImageObj.firstChild.src);

		GImage.remove(Nom);
		this.setImageList();
	}
},

getSave: function(ModuleObj)
{
	var Nom = GImage.getNom(ModuleObj.firstChild.src);
	var ImageInfo = GImage.getInfo(Nom);

	return GImage.getNom(ImageInfo.src);
},

addBlock: function(Nom)
{
	if(this.Modif.is == true)
	{
		var ModuleObj = this.Modif.ModuleObj;

		new Fx(ModuleObj, { From: 1, To: 0, Mode: 'opacity', CallBack: function()
		{
			ModuleObj.firstChild.src = GImage.getInfo(Nom).src;
			new Fx(ModuleObj, { From: 0, To: 1, Mode: 'opacity' });
		}});
	}
	else
	{
		addBlockImage({ T: 'Image', V: Nom, P: [] }, 'addByUser');
	}
},

Picnik:
{
	APIKey: '17e426c6f79fb39661c344986aa9cf3a',
	NomAct: '',

	open: function(Src, CallBack)
	{
		this.NomAct = GImage.getNom(Src);
		Src = Ot.getCompletUrl(Src);

		var Href = ''+
		'http://www.picnik.com/service?_apikey='+this.APIKey+
		'&_host_name=Salonrama'+
		'&_replace=confirm'+
		'&_export_title=Enregistrer sur Salonrama'+
		'&_export_agent=browser'+
		'&_export_method=POST'+
		'&_export='+encodeURIComponent(Ot.getCompletUrl('creator/picnik.php'))+
		'&_exclude=out,in'+
		'&_import='+encodeURIComponent(Src)+
		'&_original_thumb='+encodeURIComponent(Src)+
		'&_imageid='+this.NomAct+
		'&LocHomeImg='+encodeURIComponent(LocHomeSite+'upload/'+this.NomAct);

		CadScreenFull.open('<iframe frameborder="0" class="BlockWHFull" src="'+Href+'"></iframe>', CallBack);
	},

	close: function(Rt)
	{
		var Rj = JSON.decode(Rt);

		if(Rj[0] == 0)
		{
			GImage.List[this.NomAct][0] = Rj[1];
			GImage.List[this.NomAct][1] = Rj[2];
			GImage.ListNew[this.NomAct] = Ot.getRandNbr(5); //5 Chiffre
			GPage.change('reload');
		}
		else{
			alert('Une erreur a eu lieu pendant le traitement de votre photo :\n- '+Rj);
		}

		CadScreenFull.close();
	}
}

};
